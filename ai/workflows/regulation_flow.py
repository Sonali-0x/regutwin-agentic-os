from services.analyst_service import (AnalystService)

def run_regulation_flow(text: str):
    analysis = (AnalystService.process(text))

    print(analysis)

    return analysis