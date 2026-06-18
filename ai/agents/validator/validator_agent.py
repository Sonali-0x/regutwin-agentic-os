from pydantic import BaseModel, Field
from core.llm import ask_llm

class ValidationResult(BaseModel):
    is_valid: bool = Field(..., description="Whether the evidence meets the MAP requirements.")
    confidence: int = Field(..., description="Confidence score from 0 to 100.")
    feedback: str = Field(..., description="Feedback explaining why it passed or failed.")

def validate_map(action_required: str, description: str, evidence_text: str) -> ValidationResult:
    """
    Validates a MAP based on provided evidence text.
    """
    system_prompt = (
        "You are an expert Compliance Auditor. Your job is to review a Measurable Action Point (MAP) "
        "and the provided evidence to determine if the requirement has been met. "
        "Be strict but fair. If the evidence is insufficient or irrelevant, fail the validation."
    )

    prompt = (
        f"MEASURABLE ACTION POINT (MAP):\n"
        f"Action: {action_required}\n"
        f"Description: {description}\n\n"
        f"PROVIDED EVIDENCE:\n{evidence_text}\n\n"
        "Evaluate if the evidence satisfies the MAP requirements."
    )

    return ask_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        structured_output=ValidationResult
    )
