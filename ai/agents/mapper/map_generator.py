from core.llm import ask_llm
from schemas.analysis import RegulationAnalysis
from schemas.map import MAPList

def generate_maps(analysis: RegulationAnalysis) -> MAPList:
    """
    Breaks RegulationAnalysis obligations into atomic Measurable Action Points (MAPs).
    """
    system_prompt = (
        "You are an expert Compliance Project Manager. Your task is to take "
        "a set of regulatory obligations and break them down into actionable, "
        "atomic Measurable Action Points (MAPs). Focus on clarity, verb-driven "
        "tasks, and making the actions highly specific."
    )

    prompt = (
        f"Based on the following regulatory analysis, generate a list of MAPs.\n\n"
        f"Title: {analysis.title}\n"
        f"Summary: {analysis.summary}\n"
        "Obligations:\n"
    )
    for ob in analysis.obligations:
        prompt += f"- {ob.requirement} (Priority: {ob.priority}, Category: {ob.category})\n"

    return ask_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        structured_output=MAPList
    )
