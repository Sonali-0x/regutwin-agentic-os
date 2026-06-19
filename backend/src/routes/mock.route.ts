import { Router, Request, Response } from "express";

const router = Router();

// Mock KYC API that simulates a broken implementation (e.g., timeout not enforced)
router.get("/kyc", (req: Request, res: Response) => {
  res.json({
    session_status: "ACTIVE",
    uptime_seconds: 45,
    message: "KYC Session is still active. Timeout policy not enforced.",
  });
});

export default router;
