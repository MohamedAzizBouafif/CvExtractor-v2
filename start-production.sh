#!/bin/bash
# Production startup script for CV Extractor with PDF service

echo "🚀 Starting CV Extractor Application..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8+ to run the PDF service."
    exit 1
fi

# Install Python dependencies for PDF service
echo "📦 Installing PDF service dependencies..."
cd pdf_service
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
else
    echo "❌ requirements.txt not found in pdf_service directory"
    exit 1
fi
cd ..

# Set environment variables
export NODE_ENV=production
export PDF_SERVICE_URL=${PDF_SERVICE_URL:-"http://localhost:5001"}

echo "🔧 Starting PDF service..."
# Start PDF service in background
cd pdf_service
python3 app.py &
PDF_SERVICE_PID=$!
cd ..

# Give PDF service time to start
sleep 5

# Check if PDF service started successfully
if ps -p $PDF_SERVICE_PID > /dev/null; then
    echo "✅ PDF service started successfully (PID: $PDF_SERVICE_PID)"
else
    echo "❌ Failed to start PDF service"
    exit 1
fi

echo "🔧 Starting Node.js application..."
# Start the main Node.js application
npm start

# Cleanup function
cleanup() {
    echo "🛑 Shutting down services..."
    kill $PDF_SERVICE_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for the main process
wait
