from core.llm import ask_llm
from schemas.analysis import RegulationAnalysis, Obligation, Deadline
from vector_db.chroma_client import store_obligations

def analyze_regulation(text: str, regulation_id: str = "unknown", title: str = "Unknown", source: str = "Unknown") -> RegulationAnalysis:
    """
    Agentic-style wrapper that uses the LLM to perform a structured analysis.
    In the future, this will be replaced by a LangGraph workflow.
    """
    system_prompt = (
        "You are an expert Regulatory Compliance Analyst. Your task is to analyze "
        "legal documents and extract structured data. You must be precise, "
        "objective, and ensure no critical obligations are missed."
    )

    prompt = f"Analyze the following regulatory text and extract all obligations, deadlines, and impacts:\n\n{text}"

    # We use the structured output capability of the llm client
    analysis_result = ask_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        structured_output=RegulationAnalysis
    )

    # Store obligations in ChromaDB for future conflict detection
    if analysis_result and analysis_result.obligations and regulation_id != "unknown":
        store_obligations(
            regulation_id=regulation_id,
            title=title if title != "Unknown" else analysis_result.title,
            source=source,
            obligations=analysis_result.obligations
        )

    return analysis_result
