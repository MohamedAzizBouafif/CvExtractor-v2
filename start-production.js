#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting CV Extractor in production...');

// Set environment variables
process.env.PDF_SERVICE_PORT = '5001';
process.env.PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:5001';

// Check if Python is available
function getPythonCommand() {
  return new Promise((resolve, reject) => {
    const python3 = spawn('python3', ['--version'], { stdio: 'pipe' });
    python3.on('close', (code) => {
      if (code === 0) {
        resolve('python3');
      } else {
        const python = spawn('python', ['--version'], { stdio: 'pipe' });
        python.on('close', (code) => {
          if (code === 0) {
            resolve('python');
          } else {
            reject(new Error('Python not found'));
          }
        });
      }
    });
  });
}

// Install dependencies and start PDF service
async function startPDFService() {
  try {
    const pythonCmd = await getPythonCommand();
    console.log(`✅ Using Python: ${pythonCmd}`);

    const pdfServicePath = path.join(__dirname, 'pdf_service');
    
    // Install dependencies
    console.log('📦 Installing PDF service dependencies...');
    const pipInstall = spawn('pip', ['install', '-r', 'requirements.txt'], {
      cwd: pdfServicePath,
      stdio: 'inherit'
    });

    pipInstall.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ Failed to install PDF dependencies');
        process.exit(1);
      }

      // Start PDF service
      console.log('🔧 Starting PDF service...');
      const pdfService = spawn(pythonCmd, ['app.py'], {
        cwd: pdfServicePath,
        stdio: 'inherit',
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      });

      pdfService.on('error', (err) => {
        console.error('❌ Failed to start PDF service:', err.message);
        process.exit(1);
      });

      console.log('✅ PDF service started on port 5001');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Start Node.js application
function startNodeApp() {
  console.log('🌐 Starting Node.js application...');
  const nodeApp = spawn('node', ['dist/index.js'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  nodeApp.on('error', (err) => {
    console.error('❌ Failed to start Node.js app:', err.message);
    process.exit(1);
  });

  console.log('✅ Node.js app started on port 3000');
}

// Start both services
startPDFService();
setTimeout(startNodeApp, 3000); // Wait 3 seconds for PDF service to start
