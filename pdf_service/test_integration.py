# Test the PDF generation with real CV data
import requests
import json

def test_pdf_generation():
    """Test PDF generation with sample CV data"""
    
    # Sample CV data matching your schema
    cv_data = {
        "first_name": "John",
        "last_name": "Doe",
        "sex": "Male",
        "language": ["English", "Spanish"],
        "email": "john.doe@example.com",
        "phone": ["123-456-7890", "098-765-4321"],
        "location": "New York, NY, USA",
        "linkedin": "https://linkedin.com/in/johndoe",
        "education": [
            {
                "degree": "Bachelor of Computer Science",
                "institution": "University of Technology",
                "location": "New York, NY",
                "start_date": "2016",
                "end_date": "2020"
            },
            {
                "degree": "Master of Software Engineering",
                "institution": "Tech Institute",
                "location": "Boston, MA",
                "start_date": "2020",
                "end_date": "2022"
            }
        ],
        "certificates": ["AWS Certified Developer", "Google Cloud Professional", "Microsoft Azure Fundamentals"],
        "skills": ["JavaScript", "Python", "React", "Node.js", "AWS", "Docker", "MongoDB"],
        "hobbies": ["Photography", "Hiking", "Chess", "Reading"],
        "expertise": [
            {
                "date": "2022-Present",
                "company": "Tech Corp",
                "role": "Senior Software Developer",
                "description": "Lead development of web applications using React and Node.js. Manage a team of 5 developers."
            },
            {
                "date": "2020-2022",
                "company": "StartupXYZ",
                "role": "Full Stack Developer",
                "description": "Developed and maintained multiple web applications. Implemented CI/CD pipelines."
            }
        ],
        "projects": [
            {
                "project_name": "E-commerce Platform",
                "industry": "Retail",
                "country": "USA",
                "role": "Lead Developer",
                "phases": ["Planning", "Development", "Testing", "Deployment"]
            },
            {
                "project_name": "Mobile Banking App",
                "industry": "Finance",
                "country": "Canada",
                "role": "Backend Developer",
                "phases": ["API Development", "Security Implementation"]
            }
        ],
        "summary": "Experienced software developer with 5+ years of experience in full-stack web development. Passionate about creating scalable applications and leading development teams."
    }
    
    try:
        print("🔄 Testing PDF generation...")
        
        # Send request to PDF service
        response = requests.post(
            'http://localhost:5001/generate-pdf',
            json=cv_data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ PDF generation successful!")
            print(f"📄 Download URL: {result.get('download_url')}")
            print(f"📝 Message: {result.get('message')}")
            
            # Test downloading the PDF
            if result.get('download_url'):
                print("\n🔄 Testing PDF download...")
                pdf_response = requests.get(result['download_url'])
                if pdf_response.status_code == 200:
                    print("✅ PDF download successful!")
                    print(f"📊 PDF size: {len(pdf_response.content)} bytes")
                else:
                    print(f"❌ PDF download failed: {pdf_response.status_code}")
            
            return True
        else:
            print(f"❌ PDF generation failed: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to PDF service.")
        print("Make sure the service is running: python app.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("=== PDF Service Integration Test ===")
    test_pdf_generation()
