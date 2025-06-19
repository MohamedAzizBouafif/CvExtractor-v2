#!/bin/sh
# Simple production startup script for Render deployment

echo "🚀 Starting CV Extractor Production Services..."
echo "Render will bind main app to port: ${PORT:-10000}"

# Set environment variables for PDF service
export PDF_SERVICE_PORT=5001

# Start PDF service in background
echo "🔧 Starting PDF service on port $PDF_SERVICE_PORT..."
cd pdf_service
python app.py &
PDF_PID=$!
echo "✅ PDF service started (PID: $PDF_PID)"

# Wait a moment for PDF service to initialize
sleep 5

# Go back to root and start Node.js app
cd ..
echo "🌐 Starting Node.js application on port ${PORT:-10000}..."
exec node dist/index.js
