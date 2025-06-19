import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PDFServiceManager {
  private pdfProcess: any = null;
  private isStarting = false;
  private maxRetries = 3;
  private retryCount = 0;

  async startPDFService(): Promise<boolean> {
    if (this.isStarting) {
      console.log("PDF service is already starting...");
      return false;
    }

    if (await this.isPDFServiceRunning()) {
      console.log("PDF service is already running");
      return true;
    }

    this.isStarting = true;
    console.log("🔧 Starting PDF service...");

    try {
      const pdfServicePath = join(__dirname, '..', 'pdf_service');
      
      // Start the PDF service as a child process
      this.pdfProcess = spawn('python', ['app.py'], {
        cwd: pdfServicePath,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      });

      this.pdfProcess.stdout.on('data', (data: Buffer) => {
        console.log(`[PDF Service] ${data.toString()}`);
      });

      this.pdfProcess.stderr.on('data', (data: Buffer) => {
        console.error(`[PDF Service Error] ${data.toString()}`);
      });

      this.pdfProcess.on('close', (code: number) => {
        console.log(`PDF service exited with code ${code}`);
        this.pdfProcess = null;
        this.isStarting = false;
      });

      // Wait for service to be ready
      await this.waitForService();
      this.isStarting = false;
      return true;

    } catch (error) {
      console.error("Failed to start PDF service:", error);
      this.isStarting = false;
      return false;
    }
  }

  async waitForService(timeout: number = 15000): Promise<void> {
    const startTime = Date.now();
    const interval = 500;

    while (Date.now() - startTime < timeout) {
      if (await this.isPDFServiceRunning()) {
        console.log("✅ PDF service is ready");
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error("PDF service failed to start within timeout");
  }

  async isPDFServiceRunning(): Promise<boolean> {
    try {
      const response = await axios.get('http://localhost:5001/health', {
        timeout: 2000
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async ensurePDFServiceRunning(): Promise<boolean> {
    if (await this.isPDFServiceRunning()) {
      return true;
    }

    if (this.retryCount >= this.maxRetries) {
      console.error("Max retries reached for starting PDF service");
      return false;
    }

    this.retryCount++;
    console.log(`Attempting to start PDF service (attempt ${this.retryCount}/${this.maxRetries})`);
    
    return await this.startPDFService();
  }

  stopPDFService(): void {
    if (this.pdfProcess) {
      console.log("🛑 Stopping PDF service...");
      this.pdfProcess.kill();
      this.pdfProcess = null;
    }
  }
}

export const pdfServiceManager = new PDFServiceManager();

// Graceful shutdown
process.on('SIGINT', () => {
  pdfServiceManager.stopPDFService();
  process.exit(0);
});

process.on('SIGTERM', () => {
  pdfServiceManager.stopPDFService();
  process.exit(0);
});
