from typing import TypedDict, Optional
from langgraph.graph import StateGraph, END
from agents.analyst import analyze_regulation
from agents.conflict_engine import detect_conflicts, ConflictReport
from agents.mapper.map_generator import generate_maps
from agents.mapper.mapper_agent import assign_departments
from schemas.analysis import RegulationAnalysis
from schemas.map import AssignedMAPList

# Define the state of the graph
class RegulationState(TypedDict):
    regulation_id: str
    text: str
    title: str
    source: str
    analysis: Optional[RegulationAnalysis]
    conflicts: Optional[ConflictReport]
    maps: Optional[AssignedMAPList]

import requests
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3000/api/v1")

def broadcast_update(regulation_id: str, node: str, status: str, payload: dict = None):
    try:
        requests.post(f"{BACKEND_URL}/internal/workflow-update", json={
            "regulationId": regulation_id,
            "node": node,
            "status": status,
            "payload": payload
        })
    except Exception as e:
        print(f"Failed to broadcast update: {e}")

# Define Nodes
def extract_obligations(state: RegulationState) -> RegulationState:
    print(f"[Node] Extracting obligations for {state['regulation_id']}")
    broadcast_update(state['regulation_id'], "extract", "IN_PROGRESS")
    analysis = analyze_regulation(
        text=state["text"],
        regulation_id=state["regulation_id"],
        title=state["title"],
        source=state["source"]
    )
    broadcast_update(state['regulation_id'], "extract", "COMPLETED")
    return {"analysis": analysis}

def detect_conflicts_node(state: RegulationState) -> RegulationState:
    print(f"[Node] Detecting conflicts for {state['regulation_id']}")
    broadcast_update(state['regulation_id'], "detect_conflicts", "IN_PROGRESS")
    analysis = state.get("analysis")
    if analysis and analysis.obligations:
        conflicts = detect_conflicts(state["regulation_id"], analysis.obligations)
        broadcast_update(state['regulation_id'], "detect_conflicts", "COMPLETED")
        return {"conflicts": conflicts}
    broadcast_update(state['regulation_id'], "detect_conflicts", "COMPLETED")
    return {"conflicts": None}

def generate_maps_node(state: RegulationState) -> RegulationState:
    print(f"[Node] Generating MAPs for {state['regulation_id']}")
    broadcast_update(state['regulation_id'], "generate_maps", "IN_PROGRESS")
    analysis = state.get("analysis")
    if analysis and analysis.obligations:
        map_list = generate_maps(analysis)
        assigned = assign_departments(map_list)
        broadcast_update(state['regulation_id'], "generate_maps", "COMPLETED")
        return {"maps": assigned}
    broadcast_update(state['regulation_id'], "generate_maps", "COMPLETED")
    return {"maps": None}

# Build the Graph
workflow = StateGraph(RegulationState)

workflow.add_node("extract", extract_obligations)
workflow.add_node("detect_conflicts", detect_conflicts_node)
workflow.add_node("generate_maps", generate_maps_node)

workflow.set_entry_point("extract")
workflow.add_edge("extract", "detect_conflicts")
workflow.add_edge("detect_conflicts", "generate_maps")
workflow.add_edge("generate_maps", END)

# Compile the workflow
regulation_app = workflow.compile()

def run_regulation_flow(regulation_id: str, text: str, title: str = "Unknown", source: str = "Unknown") -> RegulationState:
    """
    Helper function to run the full LangGraph workflow for a regulation.
    """
    initial_state = RegulationState(
        regulation_id=regulation_id,
        text=text,
        title=title,
        source=source,
        analysis=None,
        conflicts=None,
        maps=None
    )
    
    # Run the workflow
    final_state = regulation_app.invoke(initial_state)
    return final_state