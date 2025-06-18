import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { z } from "zod";
import { cvDataSchema } from "@shared/schema";
import { extractCVData } from "./ai-extractor";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// Use pdf-parse instead of pdf-text-extract (no external dependencies)
const pdfParse = require("pdf-parse");

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      const error = new Error("Only PDF files are allowed") as any;
      cb(error, false);
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // PDF upload endpoint
  app.post("/api/upload", upload.single("cv"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file provided" });
      } // Check if DeepSeek API key is available
      if (!process.env.DEEPSEEK_API_KEY) {
        return res.status(500).json({
          message:
            "DeepSeek API key not configured. Please add DEEPSEEK_API_KEY to environment variables.",
        });
      }

      // Extract text from PDF
      const pdfBuffer = req.file.buffer;

      // Using pdf-parse to extract text directly from buffer (no need for temp file)
      let pdfText = "";
      try {
        const data = await pdfParse(pdfBuffer);
        pdfText = data.text || "";
      } catch (err) {
        console.error("PDF parsing error:", err);
        return res.status(400).json({
          message:
            "Failed to extract text from PDF. Please ensure the PDF contains readable text.",
        });
      }

      if (!pdfText || pdfText.trim().length === 0) {
        return res.status(400).json({
          message:
            "Could not extract text from PDF. Please ensure the PDF contains readable text.",
        });
      } // Use AI to extract structured data from PDF text
      const extractedData = await extractCVData(pdfText);

      // Explicitly validate the data against our schema
      try {
        const validatedData = cvDataSchema.parse(extractedData);
        res.json(validatedData);
      } catch (validationError) {
        console.error("Schema validation error:", validationError);
        return res.status(400).json({
          message:
            "AI extraction returned data in an unexpected format. Please try again.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid extracted data format from AI response" });
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes("API key")) {
        return res.status(500).json({
          message:
            "DeepSeek API authentication failed. Please check your API key.",
        });
      }
      res
        .status(500)
        .json({ message: "Failed to process CV: " + errorMessage });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
