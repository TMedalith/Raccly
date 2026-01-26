"""
Manejo del vector store con Qdrant.
Solo responsable de la conexión y gestión del vector database.
"""
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from dotenv import load_dotenv
import os

load_dotenv()

class QdrantStorage:
    def __init__(self, url: str = None,   api_key: str = None,collection: str = "docs", dim: int = 3072):
        self.url = url or os.getenv("QDRANT_URL")
        self.api_key = api_key or os.getenv("QDRANT_API_KEY")
        self.client = QdrantClient(url=self.url, api_key=self.api_key, timeout=30)
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
    
    def insert_nodes_from_json(json_path, qdrant_storage=None):
        """
        Carga nodos desde un archivo JSON y los inserta en Qdrant.
        """
        import json
        if qdrant_storage is None:
            qdrant_storage = QdrantStorage()
        with open(json_path, 'r', encoding='utf-8') as f:
            nodes_data = json.load(f)
        all_nodes = []
        for nodes in nodes_data.values():
            all_nodes.extend(nodes)
        qdrant_storage.insert_nodes(all_nodes)
        print(f"✅ Todos los nodos de {json_path} insertados en Qdrant.")
