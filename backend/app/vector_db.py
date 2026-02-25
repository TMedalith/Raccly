from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core.retrievers import VectorIndexRetriever, BaseRetriever
from llama_index.core.postprocessor import LLMRerank, SimilarityPostprocessor
from llama_index.core.schema import QueryBundle, NodeWithScore
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from dotenv import load_dotenv
import os

load_dotenv()


class _EnrichedRetriever(BaseRetriever):
    def __init__(self, base_retriever, qdrant_client, collection: str):
        super().__init__()
        self._base = base_retriever
        self._client = qdrant_client
        self._collection = collection

    def _retrieve(self, query_bundle: QueryBundle) -> list[NodeWithScore]:
        nodes = self._base.retrieve(query_bundle)
        return self._enrich_batch(nodes)

    def _enrich_batch(self, nodes: list[NodeWithScore]) -> list[NodeWithScore]:
        if not nodes:
            return nodes
        ids = [n.node_id for n in nodes]
        try:
            points = self._client.retrieve(
                collection_name=self._collection,
                ids=ids,
                with_payload=True,
            )
            payloads = {str(p.id): p.payload for p in points}
            for node in nodes:
                payload = payloads.get(str(node.node_id), {})
                for field in ("title", "authors", "year", "doi", "journal", "pmc_id", "source"):
                    if field in payload and field not in node.metadata:
                        node.metadata[field] = payload[field]

        except Exception as e:
            print(f"[vector_db] {e}")
        return nodes


class QdrantStorage:
    def __init__(self, url: str = None, api_key: str = None, collection: str = "docs", dim: int = 3072):
        self.url = url or os.getenv("QDRANT_URL")
        self.api_key = api_key or os.getenv("QDRANT_API_KEY")
        self.client = QdrantClient(url=self.url, api_key=self.api_key, timeout=30)
        self.collection = collection
        self.dim = dim

        if not self.client.collection_exists(self.collection):
            self.client.create_collection(
                collection_name=self.collection,
                vectors_config=VectorParams(size=dim, distance=Distance.COSINE),
            )

        self.vector_store = QdrantVectorStore(client=self.client, collection_name=self.collection)
        self.storage_context = StorageContext.from_defaults(vector_store=self.vector_store)
        self.index = VectorStoreIndex.from_vector_store(
            vector_store=self.vector_store,
            storage_context=self.storage_context,
        )

    def _make_enriched_retriever(self, top_k: int) -> _EnrichedRetriever:
        base = VectorIndexRetriever(index=self.index, similarity_top_k=top_k)
        return _EnrichedRetriever(base, self.client, self.collection)

    def retrieve_nodes(self, query: str, top_k: int = 10, use_rerank: bool = True, use_hyde: bool = False) -> list[NodeWithScore]:
        retrieval_k = top_k * 2 if use_rerank else top_k
        retriever = self._make_enriched_retriever(retrieval_k)

        query_bundle = QueryBundle(query)
        if use_hyde:
            try:
                from llama_index.core.indices.query.query_transform import HyDEQueryTransform
                hyde = HyDEQueryTransform(include_original=True)
                query_bundle = hyde(query_bundle)
            except ImportError:
                pass

        nodes = retriever.retrieve(query_bundle)
        sp = SimilarityPostprocessor(similarity_cutoff=0.3)
        nodes = sp.postprocess_nodes(nodes, query_bundle=query_bundle)

        for node in nodes:
            node.metadata["_cosine"] = round(node.score, 4) if node.score is not None else None

        if use_rerank and nodes:
            try:
                from llama_index.llms.openai import OpenAI as _OpenAI
                reranker = LLMRerank(
                    choice_batch_size=5,
                    top_n=top_k,
                    llm=_OpenAI(model="gpt-4o-mini", temperature=0),
                )
                nodes = reranker.postprocess_nodes(nodes, query_bundle=query_bundle)
            except Exception as e:
                print(f"[vector_db] rerank error: {e}")
                nodes = nodes[:top_k]
        else:
            nodes = nodes[:top_k]

        return nodes

    def get_index(self):
        return self.index
