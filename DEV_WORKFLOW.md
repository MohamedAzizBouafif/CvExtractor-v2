# 🚀 Updated Development Workflow

## ✅ **New Command Structure**

### **Development (Both Servers)**
```bash
npm run dev
```
- ✅ Starts **PDF Service** on http://localhost:5001
- ✅ Starts **Node.js Dev Server** on http://localhost:3000
- ✅ Hot reload for frontend changes
- ✅ Auto-restart for backend changes

### **Individual Services (Optional)**
```bash
npm run dev:node-only    # Just Node.js server
npm run dev:pdf-only     # Just PDF service
```

### **Production**
```bash
npm run start:with-pdf   # Both servers (production build)
npm start                # Just Node.js (production build)
```

## 🎯 **What Changed**

**Before:**
- `npm run dev` → Only Node.js server
- Need separate terminal for PDF service

**After:**
- `npm run dev` → Both servers automatically
- Single command for complete development environment

## 🧪 **Development Workflow**

1. **Start development:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   - Frontend: http://localhost:3000
   - PDF Service: http://localhost:5001 (for testing)

3. **Develop normally:**
   - Frontend changes auto-reload
   - Backend changes auto-restart
   - PDF service runs continuously

4. **Test PDF generation:**
   - Upload CV → Extract data → Generate PDF
   - Everything works seamlessly

## 🌐 **Production Deployment**

**For cloud platforms (Render, Railway, etc.):**

**Build Command:**
```bash
npm run deploy:setup
```

**Start Command:**
```bash
npm run start:with-pdf
```

## 📋 **Available Commands Summary**

| Command | Purpose | Services Started |
|---------|---------|------------------|
| `npm run dev` | **Development** | Node.js + PDF Service |
| `npm run dev:node-only` | Node.js only | Node.js server |
| `npm run dev:pdf-only` | PDF service only | PDF service |
| `npm run start:with-pdf` | **Production** | Node.js + PDF Service |
| `npm start` | Production (Node.js only) | Node.js server |
| `npm run build` | Build for production | - |

**Now you can just use `npm run dev` for everything! 🎉**
