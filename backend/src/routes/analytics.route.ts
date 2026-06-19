import { Router } from "express";
import { getComplianceHealth } from "../controllers/analytics.controller.js";

const router = Router();

router.get("/health", getComplianceHealth);

export default router;
