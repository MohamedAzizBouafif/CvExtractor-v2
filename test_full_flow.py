import requests

# Test data for the full application flow (matching CVData schema)
test_data = {
    "first_name": "John",
    "last_name": "Doe",
    "sex": "Male",
    "language": ["English", "Spanish"],
    "email": "john.doe@example.com",
    "phone": ["+1234567890"],
    "location": "New York, NY",
    "linkedin": "https://linkedin.com/in/johndoe",
    "education": [
        {
            "degree": "Bachelor of Computer Science",
            "institution": "Tech University",
            "location": "New York, NY",
            "start_date": "2018",
            "end_date": "2022"
        }
    ],
    "certificates": ["AWS Certified Developer"],
    "skills": ["React", "Node.js", "Python", "JavaScript"],
    "hobbies": ["Programming", "Reading"],
    "expertise": [
        {
            "date": "2022-2024",
            "company": "Full Stack Inc",
            "role": "Senior Developer",
            "description": "Led development of web applications using React and Node.js"
        }
    ],
    "projects": [
        {
            "project_name": "CV Extractor",
            "industry": "Technology",
            "country": "USA",
            "role": "Lead Developer",
            "phases": ["Planning", "Development", "Testing", "Deployment"]
        }
    ],
    "summary": "Experienced full-stack developer with expertise in React, Node.js, and Python. Passionate about creating innovative web applications and solving complex problems."
}

try:    # Test PDF generation through main app
    print("Testing PDF generation through main app...")
    response = requests.post(
        "http://localhost:3000/api/generate-pdf",
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    print(f"Main app PDF generation: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Result: {result}")
          # Test public PDF download through proxy
        download_url = result.get("pdfUrl", "")
        if download_url and download_url.startswith("/api/pdf/"):
            print(f"Testing public PDF download: {download_url}")
            pdf_response = requests.get(f"http://localhost:3000{download_url}", timeout=10)
            print(f"Public PDF download: {pdf_response.status_code}")
            
            if pdf_response.status_code == 200:
                print(f"✅ Full flow successful! PDF downloaded ({len(pdf_response.content)} bytes)")
                
                # Save final test PDF
                filename = download_url.split("/")[-1]
                with open(f"full_flow_test_{filename}", "wb") as f:
                    f.write(pdf_response.content)
                print(f"✅ Full flow test PDF saved to: full_flow_test_{filename}")
                
            else:
                print(f"❌ Public PDF download failed: {pdf_response.text}")
        else:
            print(f"❌ Invalid download URL format: {download_url}")
            
    else:
        print(f"❌ Main app PDF generation failed: {response.text}")
        
except Exception as e:
    print(f"❌ Full flow test error: {e}")
