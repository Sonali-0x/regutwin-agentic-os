from pydantic import BaseModel
from typing import List
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class AnalysisResult(BaseModel):
    obligations: List[str]
    deadlines: List[str]
    affectedSystems: List[str]
    policyChanges: List[str]
    riskLevel: RiskLevel