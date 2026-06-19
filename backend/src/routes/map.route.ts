import { Router } from "express";

import {
  createMap,
  getMaps,
  getMap,
  updateMapStatus,
  updateMap,
  deleteMap,
  validateMap,
} from "../controllers/map.controller.js";

const router = Router();

router.post("/", createMap);
router.get("/", getMaps);
router.get("/:id", getMap);
router.patch("/:id/status", updateMapStatus);
router.post("/:id/validate", validateMap);
router.put("/:id", updateMap);
router.delete("/:id", deleteMap);

export default router;
