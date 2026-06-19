import json
from pydantic import BaseModel, Field
from core.llm import ask_llm
from agents.validator.execution_sandbox import execute_http_test

class ValidationResult(BaseModel):
    is_valid: bool = Field(..., description="Whether the evidence meets the MAP requirements.")
    confidence: int = Field(..., description="Confidence score from 0 to 100.")
    feedback: str = Field(..., description="Feedback explaining why it passed or failed.")

def validate_map(action_required: str, description: str, evidence_text: str = "", target_api_endpoint: str = None, test_config: dict = None) -> ValidationResult:
    """
    Validates a MAP based on provided evidence text or live API testing.
    """
    
    # 1. Execute live API test if configured
    api_test_results = ""
    if target_api_endpoint and test_config:
        print(f"[Validator] Executing live API test against {target_api_endpoint}")
        method = test_config.get("method", "GET")
        payload_str = test_config.get("payload", "")
        payload = {}
        if payload_str:
            try:
                payload = json.loads(payload_str)
            except Exception:
                pass
                
        test_result = execute_http_test(
            method=method,
            url=target_api_endpoint,
            payload=payload
        )
        
        api_test_results = (
            f"--- LIVE API TEST RESULTS ---\n"
            f"Target: {method} {target_api_endpoint}\n"
            f"Response Status: {test_result.get('status_code', 'ERROR')}\n"
            f"Response Body: {test_result.get('response_text', test_result.get('error', 'None'))}\n"
            f"Expected Status: {test_config.get('expectedStatus', 'Any')}\n"
            f"Expected Substring: {test_config.get('expectedResponseSubstring', 'Any')}\n"
            f"-----------------------------\n"
        )
        
        # If no written evidence was provided, we use the API test results
        if not evidence_text:
            evidence_text = "See API test results."

    # 2. Ask LLM to grade the evidence + API results
    system_prompt = (
        "You are an expert Compliance Auditor. Your job is to review a Measurable Action Point (MAP) "
        "and the provided evidence/live test results to determine if the requirement has been met. "
        "Be strict but fair. If the evidence is insufficient or the live API test failed to meet the expected criteria, fail the validation."
    )

    prompt = (
        f"MEASURABLE ACTION POINT (MAP):\n"
        f"Action: {action_required}\n"
        f"Description: {description}\n\n"
        f"PROVIDED EVIDENCE:\n{evidence_text}\n\n"
        f"{api_test_results}\n"
        "Evaluate if the evidence satisfies the MAP requirements."
    )

    return ask_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        structured_output=ValidationResult
    )
