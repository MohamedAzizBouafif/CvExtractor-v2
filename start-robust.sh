#!/bin/bash
# Robust startup script for production deployment

echo "🚀 Starting CV Extractor in production..."

# Ensure we're in the project root
cd "$(dirname "$0")"

# Check Python availability
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python not found. Please install Python 3.8+"
    exit 1
fi
echo "✅ Using Python: $PYTHON_CMD"

# Check pip availability
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
elif command -v pip &> /dev/null; then
    PIP_CMD="pip"
else
    echo "❌ pip not found. Please install pip"
    exit 1
fi
echo "✅ Using pip: $PIP_CMD"

# Install PDF service dependencies
echo "📦 Installing PDF service dependencies..."
cd pdf_service || exit 1

# Try to upgrade pip first
echo "🔄 Upgrading pip..."
$PIP_CMD install --upgrade pip

# Install requirements with fallback
if ! $PIP_CMD install -r requirements.txt; then
    echo "⚠️  Main requirements failed, trying fallback..."
    if [ -f "requirements-fallback.txt" ]; then
        $PIP_CMD install -r requirements-fallback.txt
    else
        echo "❌ No fallback requirements found"
        exit 1
    fi
fi
echo "✅ PDF dependencies installed"

# Start PDF service in background
echo "🔧 Starting PDF service..."
$PYTHON_CMD app.py &
PDF_PID=$!
echo "✅ PDF service started with PID: $PDF_PID"

# Go back to project root
cd ..

# Start Node.js application
echo "🌐 Starting Node.js application..."
NODE_ENV=production node dist/index.js &
NODE_PID=$!
echo "✅ Node.js app started with PID: $NODE_PID"

# Keep the script running
wait $NODE_PID
