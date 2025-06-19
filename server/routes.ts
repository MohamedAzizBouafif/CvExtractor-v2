import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { z } from "zod";
import { cvDataSchema } from "@shared/schema";
import { extractCVData } from "./ai-extractor";
import { createRequire } from "module";
import axios from "axios";
import { pdfServiceManager } from "./pdf-service-manager.js";

const require = createRequire(import.meta.url);
// Use pdf-parse instead of pdf-text-extract (no external dependencies)
const pdfParse = require("pdf-parse");

// PDF Service Configuration
const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || "http://localhost:5001";

// Function to generate PDF via Python service
async function generatePDF(cvData: any): Promise<string> {
  try {
    // Ensure PDF service is running
    console.log("Checking PDF service health...");
    const serviceRunning = await pdfServiceManager.ensurePDFServiceRunning();
    
    if (!serviceRunning) {
      throw new Error("PDF service could not be started. Please check if Python and required packages are installed.");
    }
    
    console.log("PDF service is running. Generating PDF...");
    console.log("Sending CV data to PDF service...");

    const response = await axios.post(
      `${PDF_SERVICE_URL}/generate-pdf`,
      cvData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("PDF service response:", response.data);

    if (response.data && response.data.download_url) {
      console.log("PDF generated successfully:", response.data.download_url);
      return response.data.download_url;
    } else {
      throw new Error("PDF service did not return a download URL");
    }  } catch (error: any) {
    console.error("Error generating PDF:", error.message);
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      throw new Error("PDF service could not be started. Please ensure Python is installed and run: npm run pdf:install");
    } else if (error.code === "ETIMEDOUT") {
      throw new Error("PDF generation timed out. The PDF service may be overloaded.");
    }
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

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

  // PDF Generation endpoint
  app.post("/api/generate-pdf", async (req, res) => {
    try {
      const cvData = req.body;
      
      // Validate the CV data
      const validatedData = cvDataSchema.parse(cvData);
      
      // Generate PDF using Python service
      const pdfUrl = await generatePDF(validatedData);
      
      res.json({ 
        success: true, 
        pdfUrl,
        message: "PDF generated successfully"
      });
    } catch (error: any) {
      console.error('Error in PDF generation route:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate PDF', 
        error: error.message 
      });
    }
  });

  // Health check for PDF service
  app.get("/api/pdf-service/health", async (req, res) => {
    try {
      const response = await axios.get(`${PDF_SERVICE_URL}/health`, {
        timeout: 5000
      });
      res.json({
        status: "healthy",
        pdfService: response.data
      });
    } catch (error: any) {
      res.status(503).json({
        status: "unhealthy",
        message: "PDF service is not available",
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
