# PDF Service Setup Guide

This guide will help you set up and run the Python PDF generator service alongside your main CV Extractor application.

## Prerequisites

1. **Python 3.8 or higher** installed on your system
2. **pip** package manager
3. Your main CV Extractor application running

## Quick Setup

### Option 1: Using npm scripts (Recommended)

1. **Install Python dependencies:**
   ```bash
   npm run pdf:install
   ```

2. **Start the PDF service:**
   ```bash
   npm run pdf:start
   ```

### Option 2: Manual setup

1. **Navigate to the pdf_service directory:**
   ```bash
   cd pdf_service
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the service:**
   ```bash
   python app.py
   ```

## Service Configuration

The PDF service runs on port **5001** by default. You can configure this and other settings:

### Environment Variables

Create a `.env` file in the `pdf_service` directory:

```env
PORT=5001
UPLOAD_FOLDER=temp
DEBUG=False
```

### For Production Deployment

If deploying the PDF service separately (recommended for production):

1. Set the `PDF_SERVICE_URL` environment variable in your main application:
   ```env
   PDF_SERVICE_URL=http://your-pdf-service-domain:5001
   ```

2. Deploy the PDF service to a platform like Render, Heroku, etc.

## Testing the Setup

### 1. Check if the PDF service is running

Visit: http://localhost:5001/health

You should see:
```json
{
  "status": "healthy",
  "service": "pdf-generator"
}
```

### 2. Test the integration

In your main CV Extractor app:
1. Upload a CV and extract data
2. Click "Export PDF" button
3. A PDF should be generated and downloaded

### 3. Check the backend health

Visit: http://localhost:5000/api/pdf-service/health

This will show if your main backend can communicate with the PDF service.

## Troubleshooting

### Common Issues

1. **"PDF service is not running" error**
   - Make sure the PDF service is started: `npm run pdf:start`
   - Check if port 5001 is available
   - Verify Python and pip are installed

2. **"Import errors" when starting PDF service**
   - Run: `npm run pdf:install` or `pip install -r pdf_service/requirements.txt`
   - Make sure you're using Python 3.8+

3. **"Connection refused" error**
   - The PDF service might not be running
   - Check if there's a firewall blocking port 5001
   - Verify the PDF_SERVICE_URL is correct

4. **PDF generation fails**
   - Check the PDF service logs for errors
   - Ensure the temp directory has write permissions
   - Verify the CV data format is correct

### Logs and Debugging

- **PDF Service logs**: Check the console where you started `python app.py`
- **Main backend logs**: Check your main server console for PDF-related errors
- **Browser console**: Check for any JavaScript errors during PDF export

## Architecture

```
Your CV Extractor App (Port 5000)
         ↓
    POST /api/generate-pdf
         ↓
PDF Service (Port 5001)
         ↓
    Generates PDF file
         ↓
    Returns download URL
         ↓
User downloads PDF
```

## Production Deployment

For production, consider:

1. **Separate hosting**: Deploy the PDF service on a separate server/container
2. **Load balancing**: Use multiple PDF service instances for high traffic
3. **File cleanup**: Implement automatic cleanup of old PDF files
4. **Security**: Add authentication between services if needed
5. **Monitoring**: Set up health checks and monitoring

## Development Tips

- Both services need to be running for PDF export to work
- The main app will fallback gracefully if PDF service is unavailable
- You can develop with just JSON export if PDF service setup is problematic
- Use Docker for consistent development environments across team members

## Need Help?

If you encounter issues:

1. Check that all prerequisites are installed
2. Review the error messages in both service logs
3. Verify network connectivity between services
4. Test each service independently using the health endpoints
