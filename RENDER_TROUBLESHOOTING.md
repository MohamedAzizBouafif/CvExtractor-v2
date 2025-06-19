# 🚨 RENDER DEPLOYMENT TROUBLESHOOTING

## Current Issue
PDF service is still not starting in production, even with dependency installation during build.

## Diagnostic Steps

### 1. Check Build Logs
Look for these in Render build logs:
```
==> Running build command 'cd pdf_service && pip install -r requirements.txt && cd .. && npm install && npm run build'...
Collecting flask==3.0.3
Successfully installed flask-3.0.3 werkzeug-3.0.3...
```

### 2. Check Runtime Logs
Look for these in Render runtime logs:
```
🔧 Starting PDF service on port 5001...
* Serving Flask app 'app'
* Running on http://0.0.0.0:5001
🌐 Starting Node.js application...
Server running on http://0.0.0.0:3000
```

## Multiple Start Commands Available

### Option 1: Concurrently (Current)
```yaml
startCommand: npm run start:with-pdf
```

### Option 2: Shell Script
```yaml
startCommand: npm run start:shell
```

### Option 3: Manual Commands (For Testing)
```bash
# In Render console:
cd pdf_service && python check_setup.py
cd pdf_service && python app.py &
cd .. && node dist/index.js
```

## Environment Variables to Verify

In Render dashboard, ensure these are set:
```
NODE_ENV=production
PDF_SERVICE_PORT=5001
PDF_SERVICE_URL=http://localhost:5001
PORT=3000
PYTHON_VERSION=3.11.9
```

## Possible Issues & Solutions

### Issue 1: Dependencies Not Found
**Solution**: Check if pip install succeeded in build logs

### Issue 2: Port Conflicts
**Solution**: Verify PDF_SERVICE_PORT=5001 is set

### Issue 3: Python Path Issues
**Solution**: Use absolute paths in startup commands

### Issue 4: Concurrent Process Limits
**Solution**: Use shell script instead of concurrently

## Quick Test Commands

Add these to your Render dashboard for debugging:

**Build Command (Debug):**
```bash
cd pdf_service && pip install -r requirements.txt && python check_setup.py && cd .. && npm install && npm run build
```

**Start Command (Shell):**
```bash
npm run start:shell
```

**Start Command (Simple):**
```bash
cd pdf_service && PDF_SERVICE_PORT=5001 python app.py & cd .. && node dist/index.js
```

## Manual Verification

After deployment, test these endpoints:
```
GET /api/pdf-service/health
POST /api/generate-pdf
```

Expected responses:
```json
// Health check
{"status": "healthy", "pdfService": {...}}

// PDF generation
{"success": true, "pdfUrl": "..."}
```

## Next Steps

1. **Update render.yaml** with shell script approach
2. **Check build logs** for dependency installation
3. **Monitor runtime logs** for service startup
4. **Test health endpoint** after deployment

🎯 **The shell script approach should be the most reliable for cloud deployment!**
