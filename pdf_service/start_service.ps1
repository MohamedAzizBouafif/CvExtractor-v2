# PDF Service Startup Script
# This script sets up and starts the PDF generator service

Write-Host "Starting PDF Generator Service..." -ForegroundColor Green

# Check if Python is installed
python --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "Python is not installed or not in PATH. Please install Python 3.8 or higher." -ForegroundColor Red
    exit 1
}

# Navigate to pdf_service directory
$scriptPath = Split-Path $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Create temp directory if it doesn't exist
if (!(Test-Path "temp")) {
    New-Item -ItemType Directory -Path "temp"
    Write-Host "Created temp directory for PDF storage" -ForegroundColor Yellow
}

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies. See error above." -ForegroundColor Red
    exit 1
}

# Start the Flask service
Write-Host "Starting PDF generator service on http://localhost:5001..." -ForegroundColor Green
python app.py
