import { Request, Response } from "express";
import MAP, { MapStatus } from "../models/map.model.js";

export const getComplianceHealth = async (req: Request, res: Response) => {
  try {
    const totalMaps = await MAP.countDocuments();
    const openMaps = await MAP.countDocuments({ status: MapStatus.OPEN });
    const inProgressMaps = await MAP.countDocuments({ status: MapStatus.IN_PROGRESS });
    const closedMaps = await MAP.countDocuments({ status: MapStatus.CLOSED });
    const inReviewMaps = await MAP.countDocuments({ status: MapStatus.IN_REVIEW });

    // Simple Risk Score Calculation: 100 is perfect health.
    // Penalty for OPEN maps (highest risk), smaller penalty for IN_PROGRESS.
    let riskScore = 100;
    if (totalMaps > 0) {
      const penalty = ((openMaps * 2) + inProgressMaps) / (totalMaps * 2);
      riskScore = Math.max(0, Math.round(100 - (penalty * 100)));
    }

    res.json({
      healthScore: riskScore,
      metrics: {
        total: totalMaps,
        open: openMaps,
        inProgress: inProgressMaps,
        inReview: inReviewMaps,
        closed: closedMaps,
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate compliance health." });
  }
};
