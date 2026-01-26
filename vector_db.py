"""
Manejo del vector store con Qdrant.
Solo responsable de la conexión y gestión del vector database.
"""
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance


class QdrantStorage:
    def __init__(self, url: str = "http://localhost:6333", collection: str = "docs", dim: int = 3072):
        self.client = QdrantClient(url=url, timeout=30)
        self.collection = collection
        self.dim = dim
        
        # Crear colección si no existe
        if not self.client.collection_exists(self.collection):
            self.client.create_collection(
                collection_name=self.collection,
                vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
            )
        
        # Configurar vector store
        self.vector_store = QdrantVectorStore(
            client=self.client,
            collection_name=self.collection
        )
        
        self.storage_context = StorageContext.from_defaults(
            vector_store=self.vector_store
        )
    
    def get_query_engine(self, top_k=5):
        index = VectorStoreIndex.from_vector_store(
            vector_store=self.vector_store,
            storage_context=self.storage_context
        )
        return index.as_query_engine(similarity_top_k=top_k)