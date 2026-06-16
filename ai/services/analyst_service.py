from agents.analyst.analyst_agent import AnalystAgent
from agents.analyst.schemas import AnalysisResult

class AnalystService:

    @staticmethod
    def process(text: str):

        result = AnalystAgent.analyze(text)

        validated = AnalysisResult(**result)

        return validated.model_dump()