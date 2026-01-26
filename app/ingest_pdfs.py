import os
import uuid
from inngest import Inngest, step
from llama_parse import LlamaParse
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.schema import TextNode
from llama_index.core import Document, VectorStoreIndex
from .vector_db import QdrantStorage

# Cliente Inngest
inngest_client = Inngest(
    app_id="rag-pdf-processor",
    event_key=os.getenv("INNGEST_EVENT_KEY"),
    is_production=False
)

@inngest_client.create_function(
    fn_id="process-pdf",
    trigger=inngest_client.event("pdf/uploaded"),
    concurrency=[inngest_client.Concurrency(limit=5)],
    throttle=inngest_client.Throttle(limit=20, period="1h"),
    retries=3
)
async def process_pdf_function(ctx, step):
    """
    Procesa un PDF en 3 steps:
    1. Parse PDF con LlamaParse (desde bytes)
    2. Chunk en nodos
    3. Insertar en Qdrant
    """
    pdf_content = ctx.event.data["pdf_content"].encode('latin-1')
    filename = ctx.event.data["filename"]
    
    # Step 1: Parse PDF desde bytes
    @step.run("parse-pdf")
    async def parse_pdf():
        parser = LlamaParse(
            api_key=os.getenv("LLAMA_CLOUD_API_KEY"),
            result_type="markdown"
        )
        # LlamaParse puede recibir bytes directamente
        docs = parser.load_data(file=pdf_content, extra_info={"file_name": filename})
        return [{"text": doc.text, "metadata": doc.metadata} for doc in docs]
    
    docs_data = await parse_pdf()
    
    # Step 2: Chunk documents
    @step.run("chunk-documents")
    async def chunk_docs():
        splitter = SentenceSplitter(chunk_size=1000, chunk_overlap=200)
        docs = [Document(text=d["text"], metadata=d["metadata"]) for d in docs_data]
        nodes = splitter.get_nodes_from_documents(docs)
        
        for i, node in enumerate(nodes):
            node.id_ = str(uuid.uuid5(uuid.NAMESPACE_URL, f"{filename}:{i}"))
            node.metadata["source"] = filename
        
        return [{"id": n.id_, "text": n.text, "metadata": n.metadata} for n in nodes]
    
    nodes_data = await chunk_docs()
    
    # Step 3: Insertar en Qdrant
    @step.run("insert-to-qdrant")
    async def insert_nodes():
        qdrant = QdrantStorage()
        nodes = [
            TextNode(id_=n["id"], text=n["text"], metadata=n["metadata"])
            for n in nodes_data
        ]
        index = VectorStoreIndex(nodes=nodes, storage_context=qdrant.storage_context)
        return len(nodes)
    
    chunks_count = await insert_nodes()
    
    return {
        "status": "success",
        "pdf": filename,
        "chunks": chunks_count
    }