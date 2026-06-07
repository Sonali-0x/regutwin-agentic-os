# Analyst Agent

## Overview

The Analyst Agent is responsible for transforming unstructured regulatory documents into structured compliance intelligence.

The agent extracts:

* Obligations
* Deadlines
* Affected Departments
* Affected Systems
* Risk Levels
* Executive Summaries

The generated output is consumed by:

* MAP Generation Engine
* Conflict Engine
* Mapper Agent
* Validation Agent

---

# Folder Structure

```text
ai/
│
├── agents/
│   └── analyst/
│       ├── analyst_agent.py
│       ├── obligation_extractor.py
│       ├── deadline_extractor.py
│       ├── impact_analyzer.py
│       ├── risk_analyzer.py
│       ├── regulation_summarizer.py
│       ├── output_formatter.py
│       └── schemas.py
│
├── prompts/
│   └── analyst/
│
├── llm/
│
└── workflows/
```

---

# Data Schema

File:

```text
agents/analyst/schemas.py
```

```python
from pydantic import BaseModel
from typing import List

class Deadline(BaseModel):
    description: str
    date: str

class RegulationAnalysis(BaseModel):
    title: str
    summary: str

    obligations: List[str]

    deadlines: List[Deadline]

    affected_departments: List[str]

    affected_systems: List[str]

    risk_level: str
```

Purpose:

* Enforces structure
* Prevents invalid outputs
* Enables API validation

---

# OpenAI Client

File:

```text
llm/openai_client.py
```

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def ask_llm(prompt: str):

    response = client.chat.completions.create(
        model="gpt-5",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content
```

Purpose:

Centralized LLM communication layer.

---

# Obligation Extractor

File:

```text
agents/analyst/obligation_extractor.py
```

```python
from llm.openai_client import ask_llm

def extract_obligations(text: str):

    prompt = f"""
    Extract all compliance obligations.

    Return JSON array only.

    Regulation:

    {text}
    """

    return ask_llm(prompt)
```

Example Output:

```json
[
  "Implement MFA",
  "Encrypt customer data"
]
```

---

# Deadline Extractor

File:

```text
agents/analyst/deadline_extractor.py
```

```python
from llm.openai_client import ask_llm

def extract_deadlines(text: str):

    prompt = f"""
    Extract all compliance deadlines.

    Return JSON only.

    Regulation:

    {text}
    """

    return ask_llm(prompt)
```

Example Output:

```json
[
  {
    "description": "Implement MFA",
    "date": "2026-12-31"
  }
]
```

---

# Impact Analyzer

File:

```text
agents/analyst/impact_analyzer.py
```

```python
from llm.openai_client import ask_llm

def analyze_impact(text: str):

    prompt = f"""
    Identify:

    - Departments
    - Systems
    - Applications

    Return JSON.

    {text}
    """

    return ask_llm(prompt)
```

Example Output:

```json
{
  "departments": [
    "Compliance",
    "IT Security"
  ],

  "systems": [
    "Mobile Banking",
    "KYC Portal"
  ]
}
```

---

# Risk Analyzer

File:

```text
agents/analyst/risk_analyzer.py
```

```python
HIGH_RISK_KEYWORDS = [
    "kyc",
    "aml",
    "fraud",
    "cybersecurity",
    "authentication"
]

def calculate_risk(obligations):

    for obligation in obligations:

        lower = obligation.lower()

        for keyword in HIGH_RISK_KEYWORDS:

            if keyword in lower:
                return "HIGH"

    return "MEDIUM"
```

Purpose:

Rule-based risk classification.

---

# Regulation Summarizer

File:

```text
agents/analyst/regulation_summarizer.py
```

```python
from llm.openai_client import ask_llm

def summarize(text):

    prompt = f"""
    Summarize this regulation.

    Maximum 100 words.

    {text}
    """

    return ask_llm(prompt)
```

Example Output:

```text
RBI requires implementation of MFA
across all customer-facing banking
applications before December 2026.
```

---

# Output Formatter

File:

```text
agents/analyst/output_formatter.py
```

```python
from schemas import RegulationAnalysis

def build_analysis(
    title,
    summary,
    obligations,
    deadlines,
    impact,
    risk
):

    return RegulationAnalysis(
        title=title,
        summary=summary,
        obligations=obligations,
        deadlines=deadlines,
        affected_departments=impact["departments"],
        affected_systems=impact["systems"],
        risk_level=risk
    )
```

Purpose:

Generate final standardized object.

---

# Main Analyst Agent

File:

```text
agents/analyst/analyst_agent.py
```

```python
from obligation_extractor import extract_obligations
from deadline_extractor import extract_deadlines
from impact_analyzer import analyze_impact
from risk_analyzer import calculate_risk
from regulation_summarizer import summarize
from output_formatter import build_analysis

def analyze_regulation(text):

    obligations = extract_obligations(text)

    deadlines = extract_deadlines(text)

    impact = analyze_impact(text)

    risk = calculate_risk(obligations)

    summary = summarize(text)

    return build_analysis(
        title="Generated Title",
        summary=summary,
        obligations=obligations,
        deadlines=deadlines,
        impact=impact,
        risk=risk
    )
```

Purpose:

Orchestrates all analyst modules.

---

# LangGraph Integration

File:

```text
workflows/regulation_workflow.py
```

```python
from langgraph.graph import StateGraph

def analyst_node(state):

    analysis = analyze_regulation(
        state["regulation_text"]
    )

    state["analysis"] = analysis

    return state

builder = StateGraph(dict)

builder.add_node(
    "analyst",
    analyst_node
)
```

---

# Example Output

```json
{
  "title": "KYC Session Timeout",

  "summary": "RBI requires banks to implement session timeout.",

  "obligations": [
    "Implement session timeout after 30 seconds"
  ],

  "deadlines": [
    {
      "description": "Deploy timeout policy",
      "date": "2026-09-01"
    }
  ],

  "affected_departments": [
    "IT Security"
  ],

  "affected_systems": [
    "KYC Portal"
  ],

  "risk_level": "HIGH"
}
```

---

# Workflow

```text
Regulation PDF
        ↓
Watchman Agent
        ↓
Analyst Agent
        ↓
MAP Generator
        ↓
Conflict Engine
        ↓
Mapper Agent
        ↓
Validator Agent
```

This completes the Analyst Agent implementation and serves as the foundation of the ReguTwin regulatory intelligence pipeline.
