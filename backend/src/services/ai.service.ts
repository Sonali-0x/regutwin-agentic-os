import axios from "axios";

export class AIService {
  static async analyze(regulationId: string, text: string) {
    const response = await axios.post("http://localhost:8001/analyze", {
      text,
    });

    return response.data;
  }
}
