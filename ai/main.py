from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from agents.analyst import analyze_regulation
from schemas.analysis import RegulationAnalysis
from schemas.map import AssignedMAPList
from agents.mapper.map_generator import generate_maps
from agents.mapper.mapper_agent import assign_departments

app = FastAPI(title="ReguTwin AI Bridge")

class AnalysisRequest(BaseModel):
    text: str
    regulation_id: str = "unknown"
    title: str = "Unknown Title"
    source: str = "Unknown Source"

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "AI Bridge is healthy"}

@app.post("/analyze", response_model=RegulationAnalysis)
async def analyze(request: AnalysisRequest):
    try:
        result = analyze_regulation(
            text=request.text,
            regulation_id=request.regulation_id,
            title=request.title,
            source=request.source
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-maps", response_model=AssignedMAPList)
async def generate_maps_endpoint(request: RegulationAnalysis):
    try:
        # 1. Break down obligations into maps
        map_list = generate_maps(request)
        # 2. Assign departments
        assigned_maps = assign_departments(map_list)
        return assigned_maps
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from agents.conflict_engine import detect_conflicts, ConflictReport

class ConflictRequest(BaseModel):
    regulation_id: str
    obligations: list

@app.post("/detect-conflicts", response_model=ConflictReport)
async def detect_conflicts_endpoint(request: ConflictRequest):
    try:
        # Pydantic may parse the obligations as dicts if we don't type them explicitly,
        # but the detect_conflicts function expects objects with `.requirement`.
        # So let's convert them to the Obligation schema if they are dicts
        from schemas.analysis import Obligation
        parsed_obs = [Obligation(**ob) if isinstance(ob, dict) else ob for ob in request.obligations]
        result = detect_conflicts(request.regulation_id, parsed_obs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from workflows.regulation_flow import run_regulation_flow

@app.post("/run-workflow")
async def run_workflow_endpoint(request: AnalysisRequest):
    try:
        result = run_regulation_flow(
            regulation_id=request.regulation_id,
            text=request.text,
            title=request.title,
            source=request.source
        )
        # The result is the final state which contains everything we need
        return {
            "analysis": result.get("analysis"),
            "conflicts": result.get("conflicts"),
            "maps": result.get("maps")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from agents.validator.validator_agent import validate_map, ValidationResult

class ValidationRequest(BaseModel):
    action_required: str
    description: str
    evidence_text: Optional[str] = ""
    target_api_endpoint: Optional[str] = None
    test_config: Optional[dict] = None

@app.post("/validate-map", response_model=ValidationResult)
async def validate_map_endpoint(request: ValidationRequest):
    try:
        result = validate_map(
            action_required=request.action_required,
            description=request.description,
            evidence_text=request.evidence_text,
            target_api_endpoint=request.target_api_endpoint,
            test_config=request.test_config
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
