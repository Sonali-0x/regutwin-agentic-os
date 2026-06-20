import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Adjust in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected via Socket.IO:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const broadcastWorkflowUpdate = (regulationId: string, node: string, status: string, payload?: any) => {
  if (io) {
    io.emit("workflow_update", {
      regulationId,
      node,
      status,
      payload,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Phase 9 — HITL: Broadcasts a human approval request to all connected
 * frontend clients when a CRITICAL risk regulation needs sign-off before
 * MAP generation can proceed.
 */
export const broadcastHITLRequest = (
  regulationId: string,
  threadId: string,
  legalRisk: string,
  recommendedAction: string,
  rationale: string
) => {
  if (io) {
    io.emit("hitl_request", {
      id: Date.now().toString(),
      regulationId,
      threadId,
      legalRisk,
      recommendedAction,
      rationale,
      timestamp: new Date().toISOString(),
      resolved: false,
    });
  }
};
