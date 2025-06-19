# Python PDF Service Setup Guide

## Step-by-Step Installation

### 1. Check Python Installation

First, make sure Python is installed on your system:

```bash
python --version
```

If you don't have Python, download it from https://python.org (version 3.8 or higher)

### 2. Navigate to PDF Service Directory

```bash
cd pdf_service
```

### 3. Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv pdf_env

# Activate virtual environment
# On Windows:
pdf_env\Scripts\activate
# On Mac/Linux:
source pdf_env/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Test the Setup

```bash
# Test basic Python functionality
python test_python.py

# Test PDF generation (simple version)
python test_generator.py

# Test the full service
python app.py
```

### 6. Verify Service is Running

Open a new terminal and test:

```bash
curl http://localhost:5001/health
```

You should see:
```json
{"status": "healthy", "service": "pdf-generator"}
```

## Troubleshooting

### Common Issues:

1. **Python not found**: Install Python from python.org
2. **pip not found**: Python installation might be incomplete
3. **Permission errors**: Try running as administrator or use virtual environment
4. **Port 5001 in use**: Change PORT in .env or stop other services

### Error Messages:

- **"No module named 'flask'"**: Run `pip install -r requirements.txt`
- **"No module named 'reportlab'"**: ReportLab installation failed, try `pip install reportlab` separately
- **Import errors in VS Code**: This is normal - VS Code doesn't know about your Python environment

### VS Code Python Setup:

1. Install Python extension for VS Code
2. Press Ctrl+Shift+P
3. Type "Python: Select Interpreter"
4. Choose the Python from your virtual environment

## Environment Variables

Create a `.env` file in the pdf_service directory:

```
PORT=5001
UPLOAD_FOLDER=temp
DEBUG=True
```

## Testing the Integration

1. Start the PDF service: `python app.py`
2. Start your main app: `npm run dev`
3. Upload a CV and try the "Export PDF" button

The red underlines in VS Code are just linting errors - they don't affect functionality once the packages are installed!
