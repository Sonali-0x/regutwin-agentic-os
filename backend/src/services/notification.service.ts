import { getIO } from "../utils/socket.js";

export class NotificationService {
  /**
   * Simulates sending an email/Slack notification to a department manager.
   * Also broadcasts an alert via Socket.IO so the UI can show a notification.
   */
  static async sendAlert(department: string, subject: string, message: string) {
    console.log(`[ALERT -> ${department}]: ${subject}`);
    console.log(`Message: ${message}`);
    
    // In a real implementation, you would use Nodemailer, Slack Webhooks, or Twilio here.
    
    // Broadcast to the frontend NotificationCenter
    try {
      getIO().emit("new_alert", {
        id: Date.now().toString(),
        department,
        subject,
        message,
        timestamp: new Date().toISOString(),
        read: false
      });
    } catch (err) {
      console.warn("Socket not initialized yet, couldn't send alert via WS.");
    }
  }
}
