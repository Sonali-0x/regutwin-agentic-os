import ollama

class OllamaClient:

    @staticmethod
    def analyze(prompt: str):

        response = ollama.chat(
            model="llama3.1:8b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            options={
                "temperature": 0.1
            }
        )

        return response["message"]["content"]