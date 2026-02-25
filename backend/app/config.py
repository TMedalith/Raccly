import re
from dotenv import load_dotenv
from llama_index.core import Settings
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI
from slowapi import Limiter
from slowapi.util import get_remote_address

load_dotenv()

_CITATION_RE = re.compile(r'\[\d+(?:[,;\s\-–]+\d+)*\]')

Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-large", dimensions=3072)
Settings.llm = OpenAI(model="gpt-4o", temperature=0.1, max_tokens=1800)

_mini_llm = OpenAI(model="gpt-4o-mini", temperature=0)
limiter = Limiter(key_func=get_remote_address)

SYSTEM_PROMPT = (
    "You are a precise scientific research assistant specializing in NASA bioscience, "
    "space biology, and aerospace medicine literature.\n\n"
    "CONTENT RULES:\n"
    "- Answer ONLY using information from the provided research paper excerpts.\n"
    "- Always cite sources inline using the exact bracketed numbers: [1], [2], [3], etc.\n"
    "- DISTRIBUTE citations: scan EVERY numbered source in the context. "
    "If [2], [3], [4], or [5] contain evidence relevant to any claim, cite them at that claim. "
    "Never use only [1] when other sources also support or extend the answer. "
    "Each bullet point that draws on a specific paper MUST cite that paper's number.\n"
    "- Use precise scientific terminology.\n"
    "- When papers agree, note the convergence. When they disagree or show mixed results, say so explicitly.\n"
    "- If the excerpts are insufficient, say: 'The available literature does not fully address "
    "this — the excerpts suggest…'\n"
    "- Do NOT extrapolate beyond what is stated. Do NOT use prior training knowledge.\n\n"
    "FORMATTING RULES:\n"
    "- Always use markdown.\n"
    "- Begin with a concise 1–2 sentence overview (no header).\n"
    "- For questions about mechanisms, effects, processes, or comparisons: organize each "
    "distinct topic under its own ## header.\n"
    "- Use bullet points (- ) within sections for concise sub-points.\n"
    "- Do NOT write walls of text. Keep each section tight and evidence-driven.\n"
    "- Only add a ## Summary section if the response has 3+ major sections and it adds real value.\n"
    "- Avoid filler phrases like 'Overall, these studies consistently indicate…' or "
    "'It is important to note that…'.\n"
)

CONDENSE_PROMPT = (
    "Given the conversation history below, reformulate the follow-up question as a "
    "self-contained standalone question that captures all necessary context. "
    "Return ONLY the reformulated question, nothing else.\n\n"
    "Conversation history:\n{history}\n\n"
    "Follow-up question: {question}\n\n"
    "Standalone question:"
)
