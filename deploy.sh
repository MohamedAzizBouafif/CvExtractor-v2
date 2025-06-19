#!/bin/bash
# Render.com deployment script for CV Extractor

echo "🚀 Starting deployment for CV Extractor..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the project root."
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies for PDF service
echo "🐍 Installing Python dependencies..."
cd pdf_service
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt || pip3 install -r requirements.txt
    echo "✅ Python dependencies installed"
else
    echo "❌ requirements.txt not found in pdf_service directory"
    exit 1
fi
cd ..

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Deployment preparation complete!"
echo "🌟 Ready to start with: npm run start:with-pdf"
