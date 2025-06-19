# 🚀 CV Extractor Production Deployment Guide

## The Problem
Your application consists of two services:
1. **Node.js server** (main application)
2. **Python Flask service** (PDF generator)

In production, both services need to be running simultaneously.

## 🔧 Deployment Solutions

### Option 1: Render with Process Manager (Recommended)

For **Render** deployment, use the built-in process manager:

1. **Update your build command:**
   ```bash
   npm run deploy:setup
   ```

2. **Update your start command:**
   ```bash
   npm run start:with-pdf
   ```

3. **Add to your dependencies in package.json:**
   ```bash
   npm install concurrently --save
   ```

### Option 2: Docker Deployment

1. **Build the Docker image:**
   ```bash
   docker build -t cv-extractor .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 -p 5001:5001 cv-extractor
   ```

### Option 3: Manual Process Management

If your platform doesn't support process managers:

1. **Start PDF service first:**
   ```bash
   cd pdf_service && python app.py &
   ```

2. **Start main application:**
   ```bash
   npm start
   ```

### Option 4: Platform-Specific Solutions

#### Heroku
Add this to your `Procfile`:
```
web: npm run start:with-pdf
```

#### Railway
Set build command: `npm run deploy:setup`
Set start command: `npm run start:with-pdf`

#### Vercel
Use Vercel Functions - requires restructuring to serverless functions.

## 🔍 Troubleshooting

### Common Issues:

1. **Python not installed:**
   ```
   Error: python command not found
   ```
   **Solution:** Ensure Python 3.8+ is installed on the deployment platform.

2. **PDF dependencies missing:**
   ```
   Error: No module named 'flask'
   ```
   **Solution:** Run `pip install -r pdf_service/requirements.txt`

3. **Port conflicts:**
   ```
   Error: Port 5001 already in use
   ```
   **Solution:** Set environment variable `PDF_SERVICE_PORT=5002`

## 🌐 Environment Variables

Set these in your deployment platform:

```bash
NODE_ENV=production
PDF_SERVICE_URL=http://localhost:5001
DEEPSEEK_API_KEY=your_api_key_here
```

## ✅ Verification

After deployment, check:

1. **Main app health:** `GET /health`
2. **PDF service health:** `GET /api/pdf-health` (if implemented)
3. **Full workflow:** Upload PDF → Extract data → Generate PDF

## 🆘 Need Help?

If you're still having issues, try:

1. **Check logs** for both Node.js and Python processes
2. **Verify Python installation** on deployment platform
3. **Test PDF service independently** by accessing the health endpoint
4. **Contact platform support** for specific deployment issues

---

**Quick Fix for Current Issue:**
Add to your package.json dependencies:
```bash
npm install concurrently
```

Then update your Render start command to:
```bash
npm run start:with-pdf
```
