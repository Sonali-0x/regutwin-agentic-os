from pydantic import BaseModel, Field
from typing import List

class MAPItem(BaseModel):
    action_required: str = Field(..., description="The specific action needed to comply with the obligation.")
    description: str = Field(..., description="A clear description of the tasks required.")

class MAPList(BaseModel):
    maps: List[MAPItem] = Field(..., description="List of Measurable Action Points (MAPs)")

class AssignedMAP(BaseModel):
    action_required: str = Field(...)
    description: str = Field(...)
    assignedTo: str = Field(..., description="The department assigned to this task (e.g., IT Security, Risk, Legal, Compliance, Finance)")

class AssignedMAPList(BaseModel):
    maps: List[AssignedMAP] = Field(...)
