import axios from "axios";

export class AIService {
  static async analyze(text: string) {
    const response = await axios.post("http://localhost:8001/api/v1/analyst/analyze", { text });

    return response.data;
  }
}
