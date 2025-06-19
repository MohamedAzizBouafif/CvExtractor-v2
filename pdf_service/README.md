# SAPPCON PDF Generator Microservice

A Flask-based microservice that generates professional, branded PDF CVs from JSON data with SAPPCON styling and branding.

## Features

- **SAPPCON Branding**: Uses official brand colors (#2968CE blue, #B4975F gold)
- **Logo Integration**: Automatically includes SAPPCON logo when available
- **Professional Layout**: Clean, modern design optimized for CVs
- **RESTful API**: Simple JSON-to-PDF conversion endpoints
- **Temporary Storage**: Secure file handling with automatic cleanup
- **Fallback Headers**: Professional text header when logo is unavailable

## Brand Colors

- **Primary**: `#2968CE` (SAPPCON Blue) - Used for headings, names, and accents
- **Secondary**: `#B4975F` (SAPPCON Gold) - Used for company info and highlights
- **Supporting**: Light gray backgrounds and dark gray text for optimal readability

## Prerequisites

- Python 3.8+
- Required libraries (see requirements.txt)
- Optional: SAPPCON logo as `logo.png` (recommended 200x80 pixels)

## Installation

1. Navigate to the pdf_service directory:
```bash
cd pdf_service
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running Locally

```bash
python app.py
```

The service will run on http://localhost:5001

## API Endpoints

### Generate PDF
POST `/generate-pdf`
Accepts CV data in JSON format and returns a download URL.

Example request:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": ["123-456-7890"],
  "summary": "Experienced software developer...",
  "skills": ["JavaScript", "Python", "React"],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University of Technology",
      "location": "City, Country",
      "start_date": "2018",
      "end_date": "2022"
    }
  ],
  "expertise": [
    {
      "company": "Tech Corp",
      "role": "Software Developer",
      "date": "2022-Present",
      "description": "Developed web applications using React and Node.js"
    }
  ]
}
```

### Get PDF
GET `/pdf/<filename>`
Download a generated PDF by filename.

### Health Check
GET `/health`
Simple health check endpoint.

### Cleanup (Admin)
POST `/cleanup`
Deletes all temporary PDF files.

## Environment Variables

- `PORT`: Port to run the service (default: 5001)
- `UPLOAD_FOLDER`: Directory to store temporary PDFs (default: 'temp')
- `DEBUG`: Enable debug mode (default: False)

## Docker Usage

Build and run with Docker:

```bash
docker build -t pdf-generator .
docker run -p 5001:5001 pdf-generator
```

## Integrating with the Main Backend

Send CV data to this service from your main backend:

```javascript
async function generatePDF(cvData) {
  const response = await fetch('http://pdf-service:5001/generate-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cvData),
  });
  
  const data = await response.json();
  return data.download_url;
}
```

## Testing the Service

You can test the service using curl:

```bash
# Health check
curl http://localhost:5001/health

# Generate PDF
curl -X POST http://localhost:5001/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com"}'
```

## Troubleshooting

1. **Import errors**: Make sure all dependencies are installed with `pip install -r requirements.txt`
2. **Permission errors**: Ensure the temp directory has write permissions
3. **Port conflicts**: Change the PORT environment variable if 5001 is already in use

## Logo Setup

### Adding the SAPPCON Logo

1. Save your SAPPCON logo as `logo.png` in this directory
2. **Recommended specifications**:
   - Format: PNG with transparent background
   - Size: 200x80 pixels (or maintain aspect ratio)
   - Resolution: 300 DPI for crisp rendering
   - Background: Transparent or white

3. **Verification**: Run the logo setup helper:
   ```bash
   python setup_logo.py
   ```

### Logo Behavior

- **With Logo**: SAPPCON logo appears in the header with company information
- **Without Logo**: Professional text header with SAPPCON branding
- **Error Handling**: Automatic fallback to text header if logo file is corrupted
