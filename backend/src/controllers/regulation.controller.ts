import { Request, Response } from "express";

import Regulation from "../models/regulation.model.js";

import { PDFService } from "../services/pdf.service.js";

export const uploadRegulation = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      message: "PDF required",
    });
  }

  const extractedText = await PDFService.extractText(req.file.path);

  // 1. Create the regulation as NEW
  let regulation = await Regulation.create({
    title: req.body.title,
    source: req.body.source,
    filePath: req.file.path,
    extractedText,
  });

  try {
    // 2. Analyze the regulation via AI Layer
    const { AIService } = await import("../services/ai.service.js");
    const analysisResult = await AIService.analyze(regulation.id, extractedText);
    
    // 3. Update the regulation with analysis and set status to ANALYZED
    regulation.analysis = analysisResult;
    regulation.status = "ANALYZED" as any;
    await regulation.save();
  } catch (error) {
    console.error("AI Analysis failed", error);
    // Keep status as NEW if AI fails
  }

  res.status(201).json(regulation);
};

export const getRegulations = async (req: Request, res: Response) => {
  const regulations = await Regulation.find();

  res.json(regulations);
};

export const getRegulation = async (req: Request, res: Response) => {
  const regulation = await Regulation.findById(req.params.id);

  res.json(regulation);
};
