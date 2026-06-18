from core.llm import ask_llm
from vector_db.chroma_client import search_similar_obligations
from pydantic import BaseModel, Field
from typing import List

class Conflict(BaseModel):
    is_conflict: bool = Field(..., description="Whether there is a genuine contradiction or conflict between the obligations.")
    explanation: str = Field(..., description="Explanation of the conflict if one exists.")
    conflicting_regulation_id: str = Field(..., description="The ID of the conflicting regulation.")
    conflicting_title: str = Field(..., description="The title of the conflicting regulation.")

class ConflictReport(BaseModel):
    conflicts: List[Conflict] = Field(..., description="List of conflicts found.")

def detect_conflicts(regulation_id: str, new_obligations: list) -> ConflictReport:
    """
    Query ChromaDB for semantically similar obligations and use the LLM to verify if they conflict.
    """
    all_conflicts = []

    system_prompt = (
        "You are an expert Regulatory Compliance Analyst specializing in conflict detection. "
        "You are given a NEW obligation and an EXISTING obligation. "
        "Determine if they contradict each other or create a compliance conflict. "
        "Return your findings as structured data."
    )

    # We will search each new obligation
    for ob in new_obligations:
        # Search Chroma for similar past obligations
        similar = search_similar_obligations(query=ob.requirement, n_results=3)
        
        for match in similar:
            existing_req = match["metadata"].get("requirement", match["document"])
            existing_reg_id = match["metadata"].get("regulation_id", "")
            existing_title = match["metadata"].get("title", "")
            
            # Skip if comparing to same regulation
            if existing_reg_id == regulation_id:
                continue
                
            prompt = (
                f"NEW OBLIGATION (Regulation ID: {regulation_id}):\n"
                f"{ob.requirement}\n\n"
                f"EXISTING OBLIGATION (Regulation ID: {existing_reg_id}, Title: {existing_title}):\n"
                f"{existing_req}\n\n"
                "Do these two obligations conflict?"
            )
            
            # We use a simple Pydantic model for a single conflict check
            class SingleConflictCheck(BaseModel):
                is_conflict: bool
                explanation: str
                
            result = ask_llm(
                prompt=prompt,
                system_prompt=system_prompt,
                structured_output=SingleConflictCheck
            )
            
            if result and result.is_conflict:
                all_conflicts.append(Conflict(
                    is_conflict=True,
                    explanation=result.explanation,
                    conflicting_regulation_id=existing_reg_id,
                    conflicting_title=existing_title
                ))

    # Deduplicate conflicts by regulation ID for brevity
    unique_conflicts = {}
    for c in all_conflicts:
        if c.conflicting_regulation_id not in unique_conflicts:
            unique_conflicts[c.conflicting_regulation_id] = c
            
    return ConflictReport(conflicts=list(unique_conflicts.values()))
