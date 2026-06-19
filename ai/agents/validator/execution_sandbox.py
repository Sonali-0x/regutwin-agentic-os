import requests
import json

def execute_http_test(method: str, url: str, headers: dict = None, payload: dict = None, timeout: int = 40):
    """
    A controlled sandbox function to execute HTTP requests safely.
    It restricts execution to HTTP requests only and catches errors safely.
    """
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, timeout=timeout)
        elif method.upper() == 'POST':
            response = requests.post(url, headers=headers, json=payload, timeout=timeout)
        elif method.upper() == 'PUT':
            response = requests.put(url, headers=headers, json=payload, timeout=timeout)
        elif method.upper() == 'DELETE':
            response = requests.delete(url, headers=headers, timeout=timeout)
        else:
            return {"error": f"Unsupported HTTP method: {method}"}

        return {
            "status_code": response.status_code,
            "response_text": response.text[:1000],  # Limit length
            "headers": dict(response.headers)
        }
    except Exception as e:
        return {"error": str(e)}
