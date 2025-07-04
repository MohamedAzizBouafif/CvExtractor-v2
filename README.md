# 🚀 CV Extractor Pro - AI-Powered Resume Parser & PDF Generator

<div align="center">

![CV Extractor](https://img.shields.io/badge/CV%20Extractor-Pro-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge)

**🎯 Transform any resume into structured data and generate beautiful PDFs instantly!**

[🔥 Live Demo](#-live-demo) • [⚡ Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🛠️ API Reference](#-api-reference)

</div>

---

## 🌟 What is CV Extractor Pro?

CV Extractor Pro is a **cutting-edge AI-powered application** that revolutionizes how you handle resumes and CVs. Upload any resume format, and watch as our intelligent system extracts, structures, and transforms it into beautiful, professional PDFs.

### ✨ Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🤖 **AI-Powered Extraction** | Uses DeepSeek AI to intelligently parse resume content | ✅ Active |
| 📄 **Multi-Format Support** | Supports PDF, DOC, DOCX, TXT, and image formats | ✅ Active |
| 🎨 **Beautiful PDF Generation** | Creates professional, styled PDF resumes | ✅ Active |
| ⚡ **Real-Time Processing** | Instant extraction and generation | ✅ Active |
| 🔧 **Interactive Editing** | Edit extracted data before PDF generation | ✅ Active |
| 🌐 **Web-Based Interface** | Modern, responsive React frontend | ✅ Active |
| 🚀 **Production Ready** | Containerized and deployment-ready | ✅ Active |

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    A[📱 React Frontend] --> B[🔄 Node.js API Server]
    B --> C[🤖 DeepSeek AI Service]
    B --> D[🐍 Python PDF Service]
    D --> E[📄 PDF Generation]
    F[💾 File Storage] --> B
    G[⚙️ Configuration] --> B
```

### 🧩 System Components

#### 🎨 **Frontend (React + TypeScript)**
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query for server state
- **Features**: 
  - 📤 Drag & drop file upload
  - 📝 Interactive form editing
  - 🎯 Real-time validation
  - 📱 Responsive design

#### 🔧 **Backend API (Node.js + Express)**
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript
- **Features**:
  - 🔐 Secure file handling
  - 🤖 AI integration
  - 📊 Request validation
  - ⚡ Async processing

#### 🐍 **PDF Service (Python + Flask)**
- **Framework**: Flask microservice
- **PDF Engine**: ReportLab
- **Features**:
  - 🎨 Professional PDF styling
  - 📄 Multi-page layouts
  - 🖼️ Logo integration
  - ⚡ Fast generation

#### 🤖 **AI Integration**
- **Provider**: DeepSeek AI
- **Capabilities**: 
  - 📖 Text extraction
  - 🏷️ Content classification  
  - 📊 Data structuring
  - 🔍 Smart parsing

---

## ⚡ Quick Start

### 🔧 Prerequisites

Make sure you have these installed:

- 📦 **Node.js** (v18+)
- 🐍 **Python** (v3.11+)
- 🔑 **DeepSeek AI API Key**

### 🚀 Installation & Setup

#### 1️⃣ **Clone the Repository**
```bash
git clone <your-repo-url>
cd CvExtractor-v2
```

#### 2️⃣ **Install Dependencies**
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd pdf_service
pip install -r requirements.txt
cd ..
```

#### 3️⃣ **Environment Configuration**
```bash
# Create environment file
cp .env.example .env

# Add your API keys
echo "DEEPSEEK_API_KEY=your_deepseek_api_key_here" >> .env
```

#### 4️⃣ **Launch the Application**
```bash
# Start both services in development mode
npm run dev

# Or start individually:
npm run dev:node-only  # Node.js server only
npm run dev:pdf-only   # PDF service only
```

#### 5️⃣ **Access the Application**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **API Server**: http://localhost:3000/api
- 🐍 **PDF Service**: http://localhost:5001

---

## 📖 Documentation

### 🔄 Application Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 🎨 Frontend
    participant A as 🔧 API Server
    participant AI as 🤖 DeepSeek AI
    participant P as 🐍 PDF Service

    U->>F: 📤 Upload Resume File
    F->>A: 📄 Send File
    A->>AI: 🤖 Extract Data
    AI->>A: 📊 Structured Data
    A->>F: ✅ Extraction Results
    F->>U: 📝 Show Editable Form
    U->>F: ✏️ Edit & Submit
    F->>A: 📋 Generate PDF Request
    A->>P: 🐍 PDF Generation
    P->>A: 📄 PDF File
    A->>F: ⬇️ Download Link
    F->>U: 🎉 PDF Ready!
```

### 📁 Project Structure

```
📂 CvExtractor-v2/
├── 📂 client/                    # React frontend
│   ├── 📂 src/
│   │   ├── 📂 components/        # UI components
│   │   ├── 📂 pages/            # Application pages
│   │   ├── 📂 hooks/            # Custom React hooks
│   │   └── 📂 lib/              # Utilities
├── 📂 server/                   # Node.js backend
│   ├── 📄 index.ts              # Main server file
│   ├── 📄 routes.ts             # API routes
│   ├── 📄 ai-extractor.ts       # AI integration
│   └── 📄 storage.ts            # File handling
├── 📂 pdf_service/              # Python PDF service
│   ├── 📄 app.py                # Flask application
│   ├── 📄 pdf_generator.py      # PDF generation logic
│   └── 📄 requirements.txt      # Python dependencies
├── 📂 shared/                   # Shared TypeScript types
└── 📄 package.json              # Node.js configuration
```

### 🎨 UI Components

The application uses a modern component library:

- 🔘 **Buttons**: Primary, secondary, outline variants
- 📝 **Forms**: Input fields, textareas, selects
- 🃏 **Cards**: Information display containers
- ⚠️ **Alerts**: Success, error, warning messages
- 🔄 **Loading**: Skeleton loaders and spinners

---

## 🛠️ API Reference

### 📤 **File Upload Endpoint**
```http
POST /api/upload
Content-Type: multipart/form-data

Parameters:
- file: Resume file (PDF, DOC, DOCX, TXT, images)

Response:
{
  "success": true,
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@email.com",
    // ... extracted CV data
  }
}
```

### 📄 **PDF Generation Endpoint**
```http
POST /api/generate-pdf
Content-Type: application/json

Body:
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@email.com",
  // ... complete CV data
}

Response:
{
  "success": true,
  "download_url": "http://localhost:5001/pdf/generated-cv.pdf"
}
```

### 🩺 **Health Check Endpoints**
```http
GET /api/health           # API server health
GET /pdf-service/health   # PDF service health
```

---

## 🚀 Deployment

### 🐳 **Docker Deployment**

```bash
# Build the application
docker build -t cv-extractor .

# Run with environment variables
docker run -p 3000:3000 -e DEEPSEEK_API_KEY=your_key cv-extractor
```

### ☁️ **Cloud Deployment (Render)**

The application is configured for one-click deployment on Render:

```yaml
# render.yaml configuration included
services:
  - type: web
    name: cv-extractor
    env: node
    buildCommand: npm run build
    startCommand: npm start
```

### 🔧 **Production Scripts**

```bash
npm run build              # Build for production
npm run start:production   # Start production server
npm run start:simple       # Simple production start
```

---

## ⚙️ Configuration

### 🌍 **Environment Variables**

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DEEPSEEK_API_KEY` | DeepSeek AI API key | ✅ Yes | - |
| `NODE_ENV` | Environment mode | ❌ No | `development` |
| `PORT` | Server port | ❌ No | `3000` |
| `PDF_SERVICE_PORT` | PDF service port | ❌ No | `5001` |
| `PDF_SERVICE_URL` | PDF service URL | ❌ No | `http://localhost:5001` |

### 🎛️ **Application Settings**

```typescript
// Configuration options
const config = {
  upload: {
    maxFileSize: '10MB',
    allowedTypes: ['pdf', 'doc', 'docx', 'txt', 'jpg', 'png'],
    tempDirectory: './temp'
  },
  ai: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    timeout: 30000
  },
  pdf: {
    format: 'A4',
    margins: { top: 20, bottom: 20, left: 20, right: 20 },
    fonts: ['Helvetica', 'Times-Roman']
  }
}
```

---

## 🧪 Testing

### 🔍 **Manual Testing**

1. **Upload Test**: Try different file formats
2. **Extraction Test**: Verify AI data extraction accuracy
3. **Editing Test**: Modify extracted data
4. **PDF Test**: Generate and download PDF
5. **Error Test**: Test error handling scenarios

### 🤖 **Automated Tests**

```bash
# Test API endpoints
npm run test-api

# Test PDF generation
python pdf_service/test_generator.py

# Test full application flow
python test_full_flow.py
```

---

## 🛠️ Development

### 🔄 **Development Workflow**

```bash
# Start development servers
npm run dev

# Run in separate terminals:
npm run dev:node-only    # Backend only  
npm run dev:pdf-only     # PDF service only
```

### 🐛 **Debugging**

- **Backend Logs**: Check server console for API errors
- **PDF Service Logs**: Monitor Python service output  
- **Frontend DevTools**: Use browser developer tools
- **Network Tab**: Monitor API request/response

### 🧹 **Code Quality**

```bash
# TypeScript type checking
npm run check

# Clean temporary files  
npm run clean

# Format code (if configured)
npm run format
```

---

## 🚨 Troubleshooting

### ❗ **Common Issues**

#### 🔴 **PDF Service Not Starting**
```bash
# Check Python installation
python --version

# Install dependencies
cd pdf_service && pip install -r requirements.txt

# Start manually
python pdf_service/app.py
```

#### 🔴 **AI Extraction Failing**
```bash
# Verify API key
echo $DEEPSEEK_API_KEY

# Test API connection
curl -H "Authorization: Bearer $DEEPSEEK_API_KEY" https://api.deepseek.com/v1/models
```

#### 🔴 **File Upload Issues**
- Check file size (max 10MB)
- Verify file format support
- Ensure temp directory exists
- Check disk space

#### 🔴 **Port Conflicts**
```bash
# Check what's using port 3000
netstat -tulpn | grep :3000

# Use different port
PORT=3001 npm start
```

### 📞 **Getting Help**

1. **Check Logs**: Always check console output first
2. **Environment**: Verify all environment variables are set
3. **Dependencies**: Ensure all packages are installed
4. **Services**: Confirm all services are running
5. **Network**: Check firewall and port accessibility

---

## 🎯 Roadmap

### 🔄 **Current Version (v1.0)**
- ✅ Basic file upload and extraction
- ✅ PDF generation
- ✅ Web interface
- ✅ Production deployment

### 🚀 **Upcoming Features (v1.1)**
- 🔄 **In Progress**: Batch processing
- 📋 **Planned**: Template selection
- 🎨 **Planned**: Custom PDF styling
- 👥 **Planned**: User accounts
- 📊 **Planned**: Analytics dashboard

### 🌟 **Future Enhancements (v2.0)**
- 🤖 **AI Models**: Multiple AI provider support
- 🌍 **Languages**: Multi-language support  
- 📱 **Mobile**: Mobile app development
- ⚡ **Performance**: Redis caching
- 🔐 **Security**: Advanced authentication

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🛠️ **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### 🐛 **Bug Reports**
- Use the issue tracker
- Include system information
- Provide reproduction steps
- Add relevant logs

### 💡 **Feature Requests**
- Describe the use case
- Explain the expected behavior
- Consider implementation complexity

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- 🤖 **DeepSeek AI** for powerful text extraction
- 📄 **ReportLab** for PDF generation capabilities
- ⚛️ **React** and **shadcn/ui** for the beautiful interface
- 🐍 **Flask** for the lightweight PDF service
- 🌟 **Open Source Community** for amazing tools and libraries

---

<div align="center">

### 🚀 **Ready to extract and generate amazing CVs?**

**[⬆️ Back to Top](#-cv-extractor-pro---ai-powered-resume-parser--pdf-generator)** • **[🔥 Get Started](#-quick-start)** • **[📖 Documentation](#-documentation)**

---

**Made with ❤️ by the CV Extractor Team**

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=cv-extractor-pro)
![GitHub Stars](https://img.shields.io/github/stars/your-repo/cv-extractor?style=social)

</div>
