import os
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

class LLMConfig(BaseModel):
    model: str = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
    base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    temperature: float = 0.1

config = LLMConfig()

def ask_llm(prompt: str, system_prompt: str = "You are a helpful assistant.", structured_output: Optional[type] = None) -> any:
    """
    Function to communicate with Ollama using Langchain.
    Supports both raw text and structured Pydantic output.
    """
    llm = ChatOllama(
        model=config.model,
        base_url=config.base_url,
        temperature=config.temperature,
    )
    
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("user", "{input}")
    ])
    
    if structured_output:
        structured_llm = llm.with_structured_output(structured_output)
        chain = prompt_template | structured_llm
        return chain.invoke({"input": prompt})
    else:
        chain = prompt_template | llm
        return chain.invoke({"input": prompt}).content
