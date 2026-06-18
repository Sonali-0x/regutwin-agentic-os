import os
import chromadb
from chromadb.config import Settings
import uuid

# We will use Ollama for embeddings
from langchain_ollama import OllamaEmbeddings
from core.llm import config as llm_config

# Ensure we have a path for persistent storage
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_data")

# Initialize ChromaDB client
client = chromadb.PersistentClient(path=DB_PATH)

# We use Langchain's OllamaEmbeddings as a wrapper, but Chroma expects an embedding function class
# So we create a simple adapter
class OllamaEmbeddingFunction(chromadb.EmbeddingFunction):
    def __init__(self):
        # We will use nomic-embed-text for embeddings as it's better, or just use the default model
        # Let's use the default model from config for simplicity unless specified
        self.embeddings = OllamaEmbeddings(
            model=llm_config.model,
            base_url=llm_config.base_url
        )

    def __call__(self, input: list[str]) -> list[list[float]]:
        return self.embeddings.embed_documents(input)

embedding_fn = OllamaEmbeddingFunction()

# Get or create the collection for regulatory obligations
obligations_collection = client.get_or_create_collection(
    name="obligations",
    embedding_function=embedding_fn
)

def store_obligations(regulation_id: str, title: str, source: str, obligations: list):
    """
    Stores extracted obligations in ChromaDB.
    """
    docs = []
    metadatas = []
    ids = []

    for idx, ob in enumerate(obligations):
        doc = f"Regulation: {title}\nRequirement: {ob.requirement}\nPriority: {ob.priority}\nCategory: {ob.category}"
        docs.append(doc)
        
        meta = {
            "regulation_id": regulation_id,
            "title": title,
            "source": source,
            "priority": ob.priority,
            "category": ob.category,
            "requirement": ob.requirement
        }
        metadatas.append(meta)
        
        # Unique ID for each obligation
        ids.append(f"{regulation_id}_{idx}_{uuid.uuid4().hex[:8]}")

    if docs:
        obligations_collection.add(
            documents=docs,
            metadatas=metadatas,
            ids=ids
        )

def search_similar_obligations(query: str, n_results: int = 5) -> list:
    """
    Search for similar obligations in ChromaDB.
    """
    results = obligations_collection.query(
        query_texts=[query],
        n_results=n_results
    )
    
    matches = []
    if results['documents'] and results['documents'][0]:
        for idx, doc in enumerate(results['documents'][0]):
            meta = results['metadatas'][0][idx]
            dist = results['distances'][0][idx] if 'distances' in results and results['distances'] else None
            matches.append({
                "document": doc,
                "metadata": meta,
                "distance": dist
            })
            
    return matches
