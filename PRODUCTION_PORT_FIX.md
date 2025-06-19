# 🚨 PRODUCTION PORT CONFLICT FIX

## Issue Identified
```
[PDF Service Error] Address already in use
Port 10000 is in use by another program
```

## Root Cause
1. **Port Conflict**: PDF service was using `PORT` env var (same as main app)
2. **Service Management**: Node.js trying to start PDF service that's already running
3. **Environment Confusion**: Production vs development service management

## ✅ Complete Fix Applied

### 1. **Fixed PDF Service Port Configuration**
```python
# pdf_service/app.py - OLD
port = int(os.environ.get('PORT', 5001))  # ❌ Conflicts with main app

# pdf_service/app.py - NEW
port = int(os.environ.get('PDF_SERVICE_PORT', 5001))  # ✅ Dedicated port
```

### 2. **Updated PDF Service Manager**
```typescript
// server/pdf-service-manager.ts
class PDFServiceManager {
  private readonly isProduction = process.env.NODE_ENV === 'production';

  async startPDFService(): Promise<boolean> {
    // In production, don't start the service - it should already be running
    if (this.isProduction) {
      console.log("Production mode: PDF service should be managed externally");
      return await this.isPDFServiceRunning();
    }
    // ... development logic
  }
}
```

### 3. **Enhanced Startup Script**
```bash
# start-robust.sh
export PDF_SERVICE_PORT=5001  # ✅ Explicit port setting
$PYTHON_CMD app.py &
```

### 4. **Updated Environment Variables**
```yaml
# render.yaml
envVars:
  - key: NODE_ENV
    value: production
  - key: PDF_SERVICE_URL
    value: http://localhost:5001
  - key: PDF_SERVICE_PORT  # ✅ NEW - Dedicated PDF port
    value: 5001
  - key: PORT              # ✅ Main app port
    value: 3000
```

## Expected Results

**Before Fix:**
```
[PDF Service Error] Address already in use
Port 10000 is in use by another program
PDF service exited with code 1
```

**After Fix:**
```
✅ PDF service started with PID: 12345 on port 5001
🌐 Starting Node.js application...
✅ Node.js app started with PID: 12346
Server running on http://0.0.0.0:3000
```

## Deployment Commands

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start:robust
```

**Environment Variables:**
```
NODE_ENV=production
PDF_SERVICE_URL=http://localhost:5001
PDF_SERVICE_PORT=5001
PORT=3000
DEEPSEEK_API_KEY=your_key_here
```

🎯 **This should completely resolve the port conflict and service management issues!**
