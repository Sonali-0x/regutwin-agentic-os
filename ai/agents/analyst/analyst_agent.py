import json

from json_repair import repair_json

from llm.ollama_client import OllamaClient
from .prompts import ANALYST_PROMPT

class AnalystAgent:

    @staticmethod
    def analyze(text: str):

        prompt = f"""
        {ANALYST_PROMPT}

        Regulation:
        {text}
        """

        response = OllamaClient.analyze(prompt)

        fixed = repair_json(response)

        return json.loads(fixed)