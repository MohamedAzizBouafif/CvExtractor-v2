#!/usr/bin/env python3
"""
Test script to diagnose PDF generation and serving flow
"""
import os
import sys
import json
import requests
import uuid
from pdf_service.pdf_generator import generate_pdf

# Add pdf_service to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'pdf_service'))

def test_pdf_generation():
    """Test PDF generation directly"""
    print("=== Testing PDF Generation Directly ===")
    
    # Test CV data
    test_data = {
        "personalInfo": {
            "name": "John Doe",
            "email": "john.doe@email.com",
            "phone": "+1234567890",
            "location": "New York, NY"
        },
        "experience": [
            {
                "title": "Software Engineer",
                "company": "Tech Corp",
                "duration": "2020-2023",
                "description": "Developed web applications using React and Node.js"
            }
        ],
        "education": [
            {
                "degree": "Bachelor of Computer Science",
                "school": "Tech University",
                "year": "2020"
            }
        ],
        "skills": ["JavaScript", "Python", "React", "Node.js"]
    }
    
    # Create temp directory
    temp_dir = os.path.abspath("temp")
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
        print(f"Created temp directory: {temp_dir}")
    
    # Generate PDF
    filename = f"test-{uuid.uuid4()}.pdf"
    filepath = os.path.join(temp_dir, filename)
    
    print(f"Generating PDF at: {filepath}")
    
    try:
        generate_pdf(test_data, filepath)
        
        if os.path.exists(filepath):
            file_size = os.path.getsize(filepath)
            print(f"✅ PDF generated successfully: {filepath} ({file_size} bytes)")
            
            # List all files in temp directory
            files = os.listdir(temp_dir)
            print(f"Files in temp directory: {files}")
            
            return filename
        else:
            print(f"❌ PDF generation failed - file not created")
            return None
            
    except Exception as e:
        print(f"❌ PDF generation error: {e}")
        return None

def test_pdf_service_api():
    """Test PDF service API endpoints"""
    print("\n=== Testing PDF Service API ===")
    
    # Start PDF service manually for testing
    print("Please start the PDF service manually with:")
    print("cd pdf_service && python app.py")
    input("Press Enter when PDF service is running...")
    
    # Test data
    test_data = {
        "personalInfo": {
            "name": "Jane Smith",
            "email": "jane.smith@email.com",
            "phone": "+1234567890",
            "location": "San Francisco, CA"
        },
        "experience": [
            {
                "title": "Senior Developer",
                "company": "Web Solutions",
                "duration": "2021-2024",
                "description": "Led development of microservices architecture"
            }
        ],
        "education": [
            {
                "degree": "Master of Computer Science",
                "school": "Stanford University",
                "year": "2021"
            }
        ],
        "skills": ["React", "Node.js", "Python", "Docker", "Kubernetes"]
    }
    
    base_url = "http://localhost:5001"
    
    try:
        # Test health check
        print("Testing health check...")
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"Health check response: {response.status_code} - {response.json()}")
        
        # Test PDF generation
        print("Testing PDF generation...")
        response = requests.post(
            f"{base_url}/generate-pdf",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"PDF generation response: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ PDF generated: {result}")
            
            # Extract filename from download URL
            download_url = result.get("download_url", "")
            filename = download_url.split("/")[-1]
            
            # Test PDF download
            print(f"Testing PDF download for: {filename}")
            pdf_response = requests.get(f"{base_url}/pdf/{filename}", timeout=10)
            print(f"PDF download response: {pdf_response.status_code}")
            
            if pdf_response.status_code == 200:
                print(f"✅ PDF downloaded successfully ({len(pdf_response.content)} bytes)")
                
                # Save test PDF for verification
                test_pdf_path = f"test_download_{filename}"
                with open(test_pdf_path, "wb") as f:
                    f.write(pdf_response.content)
                print(f"✅ Test PDF saved to: {test_pdf_path}")
                
            else:
                print(f"❌ PDF download failed: {pdf_response.text}")
                
        else:
            print(f"❌ PDF generation failed: {response.text}")
            
    except Exception as e:
        print(f"❌ API test error: {e}")

def test_full_flow():
    """Test the full Node.js -> Python service flow"""
    print("\n=== Testing Full Application Flow ===")
    
    print("Please start the full application with:")
    print("npm start")
    input("Press Enter when both services are running...")
    
    # Test data
    test_data = {
        "personalInfo": {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1234567890",
            "location": "Test City"
        },
        "experience": [
            {
                "title": "Test Engineer",
                "company": "Test Company",
                "duration": "2022-2024",
                "description": "Testing PDF generation functionality"
            }
        ],
        "education": [
            {
                "degree": "Test Degree",
                "school": "Test University",
                "year": "2022"
            }
        ],
        "skills": ["Testing", "Debugging", "Problem Solving"]
    }
    
    try:
        # Test through main app API
        print("Testing through main app...")
        response = requests.post(
            "http://localhost:3000/api/cv/generate-pdf",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"Main app response: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ PDF generation through main app: {result}")
            
            # Test public PDF download
            download_url = result.get("download_url", "")
            if download_url.startswith("/api/pdf/"):
                print(f"Testing public PDF download: {download_url}")
                pdf_response = requests.get(f"http://localhost:3000{download_url}", timeout=10)
                print(f"Public PDF download response: {pdf_response.status_code}")
                
                if pdf_response.status_code == 200:
                    print(f"✅ Public PDF download successful ({len(pdf_response.content)} bytes)")
                    
                    # Save final test PDF
                    final_pdf_path = f"final_test_{download_url.split('/')[-1]}"
                    with open(final_pdf_path, "wb") as f:
                        f.write(pdf_response.content)
                    print(f"✅ Final test PDF saved to: {final_pdf_path}")
                    
                else:
                    print(f"❌ Public PDF download failed: {pdf_response.text}")
            else:
                print(f"❌ Invalid download URL format: {download_url}")
                
        else:
            print(f"❌ Main app PDF generation failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Full flow test error: {e}")

if __name__ == "__main__":
    print("PDF Generation Test Suite")
    print("=" * 40)
    
    # Test 1: Direct PDF generation
    test_pdf_generation()
    
    # Test 2: PDF service API (manual)
    test_pdf_service_api()
    
    # Test 3: Full application flow (manual)
    test_full_flow()
    
    print("\nTest suite completed!")
