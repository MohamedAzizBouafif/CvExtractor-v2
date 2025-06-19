import requests
import json

# Test data
test_data = {
    "personalInfo": {
        "name": "API Test User",
        "email": "test@example.com",
        "phone": "+1234567890",
        "location": "Test City"
    },
    "experience": [
        {
            "title": "Test Engineer",
            "company": "Test Company",
            "duration": "2022-2024",
            "description": "Testing API functionality"
        }
    ],
    "education": [
        {
            "degree": "Test Degree",
            "school": "Test University", 
            "year": "2022"
        }
    ],
    "skills": ["API Testing", "Python", "Flask"]
}

try:
    # Test health check
    print("Testing health check...")
    response = requests.get("http://localhost:5001/health", timeout=5)
    print(f"Health check: {response.status_code} - {response.json()}")
    
    # Test PDF generation
    print("Testing PDF generation...")
    response = requests.post(
        "http://localhost:5001/generate-pdf",
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    print(f"PDF generation: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Result: {result}")
        
        # Extract filename from download URL
        download_url = result.get("download_url", "")
        filename = download_url.split("/")[-1]
        
        # Test PDF download
        print(f"Testing PDF download for: {filename}")
        pdf_response = requests.get(f"http://localhost:5001/pdf/{filename}", timeout=10)
        print(f"PDF download: {pdf_response.status_code}")
        
        if pdf_response.status_code == 200:
            print(f"PDF downloaded successfully ({len(pdf_response.content)} bytes)")
            
            # Save test PDF
            with open(f"api_test_{filename}", "wb") as f:
                f.write(pdf_response.content)
            print(f"Test PDF saved to: api_test_{filename}")
            
        else:
            print(f"PDF download failed: {pdf_response.text}")
            
    else:
        print(f"PDF generation failed: {response.text}")
        
except Exception as e:
    print(f"Test error: {e}")
