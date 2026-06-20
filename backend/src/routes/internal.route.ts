import { Router } from "express";
import {
  saveAnalysis,
  postWorkflowUpdate,
  postHITLRequest,
  approveWorkflow,
} from "../controllers/internal.controller.js";

const router = Router();

// Existing internal endpoints
router.post("/analysis", saveAnalysis);
router.post("/workflow-update", postWorkflowUpdate);

// Phase 9: HITL endpoints
router.post("/hitl-request", postHITLRequest);   // AI → Backend → Frontend (relay)
router.post("/approve-workflow", approveWorkflow); // Frontend → Backend → AI (resume)

export default router;
