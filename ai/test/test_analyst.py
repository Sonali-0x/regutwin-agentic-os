import sys
import os

# Add the ai directory to the python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.analyst import analyze_regulation

sample_text = "All banks must implement Multi-Factor Authentication within thirty days."

if __name__ == "__main__":
    try:
        print("Testing Analyst Agent...")
        result = analyze_regulation(sample_text)
        print("Success! Extracted JSON:")
        print(result.model_dump_json(indent=2))
    except Exception as e:
        print(f"Error: {e}")
