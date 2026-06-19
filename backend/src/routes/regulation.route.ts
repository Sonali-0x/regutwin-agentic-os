import { Router } from "express";

import {
  uploadRegulation,
  getRegulations,
  getRegulation,
} from "../controllers/regulation.controller.js";

import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/upload", upload.single("pdf"), uploadRegulation);
router.get("/", getRegulations);
router.get("/:id", getRegulation);

export default router;
