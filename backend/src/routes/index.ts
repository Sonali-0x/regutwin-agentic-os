import { Router } from "express";
import healthRoutes from "./health.route.js";
import authRoutes from "./auth.route.js";
import regulationRoutes from "./regulation.route.js";
import internalRoutes from "./internal.route.js";

import mapRoutes from "./map.route.js";
import auditRoutes from "./audit.route.js";
import mockRoutes from "./mock.route.js";
import analyticsRoutes from "./analytics.route.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/regulations", regulationRoutes);
router.use("/maps", mapRoutes);
router.use("/audits", auditRoutes);
router.use("/internal", internalRoutes);
router.use("/mock", mockRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
