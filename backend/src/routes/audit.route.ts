import { Router } from "express";
import { getAudits } from "../controllers/audit.controller.js";

const router = Router();

router.get("/", getAudits);

export default router;
