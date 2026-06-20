"""
Legal Reviewer Agent (Phase 9)
================================
A specialized LangGraph node that performs deep legal analysis on HIGH/CRITICAL
risk regulations before MAPs are generated. It produces a structured
LegalReviewSummary that surfaces jurisdictional exposure, legal precedents,
and a recommended escalation action for human review.
"""

from pydantic import BaseModel, Field
from typing import List
from core.llm import ask_llm


class JurisdictionExposure(BaseModel):
    jurisdiction: str = Field(..., description="Regulatory body or jurisdiction (e.g., RBI, SEBI, FATF)")
    exposure_level: str = Field(..., description="Exposure level: Critical, High, Medium, Low")
    notes: str = Field(..., description="Specific exposure details for this jurisdiction")


class LegalReviewSummary(BaseModel):
    overall_legal_risk: str = Field(
        ...,
        description="Overall legal risk rating: Critical, High, Medium, or Low"
    )
    jurisdictions_affected: List[JurisdictionExposure] = Field(
        ...,
        description="List of regulatory jurisdictions and their exposure levels"
    )
    potential_penalties: str = Field(
        ...,
        description="Summary of potential fines, penalties, or sanctions for non-compliance"
    )
    legal_precedents: str = Field(
        ...,
        description="Known legal precedents or prior enforcement cases related to this regulation"
    )
    conflicting_obligations_summary: str = Field(
        ...,
        description="Summary of any legal tensions between this regulation and existing obligations"
    )
    recommended_action: str = Field(
        ...,
        description="Recommended human action: APPROVE_AND_PROCEED, ESCALATE_TO_LEGAL_TEAM, or REJECT_AND_INVESTIGATE"
    )
    rationale: str = Field(
        ...,
        description="Clear explanation of why this recommendation was made"
    )


def perform_legal_review(
    regulation_title: str,
    regulation_summary: str,
    obligations: list,
    conflicts_summary: str = "No conflicts detected."
) -> LegalReviewSummary:
    """
    Performs a deep legal analysis of a high-risk regulation before MAPs are
    generated. Used as a LangGraph node for HIGH/CRITICAL risk regulations.

    Args:
        regulation_title: Title of the regulation being reviewed.
        regulation_summary: High-level summary of the regulation.
        obligations: List of extracted obligations (Obligation objects).
        conflicts_summary: Summary of any conflicts detected by the Conflict Engine.

    Returns:
        A structured LegalReviewSummary with risk assessment and recommendations.
    """
    system_prompt = (
        "You are a Senior Legal Counsel specializing in banking regulatory compliance, "
        "with deep expertise in RBI, SEBI, FATF, and Basel III frameworks. "
        "You are conducting a mandatory legal review of a HIGH or CRITICAL risk regulation "
        "before it is processed into action plans. Your analysis must be thorough, precise, "
        "and structured. Identify jurisdictional exposures, potential penalties, relevant "
        "legal precedents, and make a clear recommendation on whether to proceed, escalate, "
        "or investigate further."
    )

    obligations_text = "\n".join(
        f"  - [{ob.priority}] {ob.requirement}" for ob in obligations
    ) if obligations else "  (No obligations extracted)"

    prompt = (
        f"REGULATION UNDER LEGAL REVIEW:\n"
        f"Title: {regulation_title}\n"
        f"Summary: {regulation_summary}\n\n"
        f"EXTRACTED OBLIGATIONS:\n{obligations_text}\n\n"
        f"CONFLICT INTELLIGENCE:\n{conflicts_summary}\n\n"
        "Please perform a comprehensive legal review of this regulation. "
        "Assess jurisdictional exposure, potential penalties, any known legal precedents, "
        "and provide a clear recommended action."
    )

    return ask_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        structured_output=LegalReviewSummary
    )
