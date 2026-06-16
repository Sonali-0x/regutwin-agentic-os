from fastapi import APIRouter
from pydantic import BaseModel

from services.analyst_service import AnalystService

router = APIRouter()

class RegulationRequest(BaseModel):
    text: str

@router.post("/analyze")
def analyze(req: RegulationRequest):

    result = AnalystService.process(req.text)

    return result