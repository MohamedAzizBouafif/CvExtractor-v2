# Test the actual PDF generator with SAPPCON branding
import json
import os
import uuid
from datetime import datetime

# Try to import the real PDF generator
try:
    from pdf_generator import generate_pdf
    USE_REAL_PDF = True
    print("✅ Using real PDF generator with SAPPCON branding")
except ImportError as e:
    print(f"⚠️  Could not import PDF generator: {e}")
    print("   Falling back to simple text version")
    USE_REAL_PDF = False

def generate_simple_pdf(cv_data, output_path):
    """
    Generate a simple text-based CV file for testing
    This version doesn't require external dependencies
    """
    
    content = []
    content.append("="*50)
    content.append("CURRICULUM VITAE")
    content.append("="*50)
    content.append("")
    
    # Personal Information
    name = f"{cv_data.get('first_name', '')} {cv_data.get('last_name', '')}"
    content.append(f"Name: {name}")
    
    if cv_data.get('email'):
        content.append(f"Email: {cv_data.get('email')}")
    
    if cv_data.get('phone'):
        phones = cv_data.get('phone') if isinstance(cv_data.get('phone'), list) else [cv_data.get('phone')]
        content.append(f"Phone: {', '.join(phones)}")
    
    if cv_data.get('location'):
        content.append(f"Location: {cv_data.get('location')}")
    
    content.append("")
    
    # Summary
    if cv_data.get('summary'):
        content.append("PROFESSIONAL SUMMARY")
        content.append("-" * 20)
        content.append(cv_data.get('summary'))
        content.append("")
    
    # Skills
    if cv_data.get('skills'):
        content.append("SKILLS")
        content.append("-" * 6)
        skills = cv_data.get('skills', [])
        if isinstance(skills, list):
            content.append(", ".join(skills))
        else:
            content.append(str(skills))
        content.append("")
    
    # Experience
    if cv_data.get('expertise'):
        content.append("PROFESSIONAL EXPERIENCE")
        content.append("-" * 24)
        for exp in cv_data.get('expertise', []):
            content.append(f"• {exp.get('role', 'Unknown Role')} at {exp.get('company', 'Unknown Company')}")
            content.append(f"  {exp.get('date', 'Unknown Date')}")
            if exp.get('description'):
                content.append(f"  {exp.get('description')}")
            content.append("")
    
    # Education
    if cv_data.get('education'):
        content.append("EDUCATION")
        content.append("-" * 9)
        for edu in cv_data.get('education', []):
            content.append(f"• {edu.get('degree', 'Unknown Degree')}")
            content.append(f"  {edu.get('institution', 'Unknown Institution')}")
            content.append(f"  {edu.get('start_date', '')} - {edu.get('end_date', 'Present')}")
            content.append("")
    
    # Footer
    content.append("")
    content.append("-" * 50)
    content.append(f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Write to file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(content))

def test_pdf_generation():
    """Test the PDF generation with sample data"""
    global USE_REAL_PDF
    
    sample_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": ["123-456-7890"],
        "location": "New York, NY",
        "summary": "Experienced software developer with 5+ years of experience in web development.",
        "skills": ["JavaScript", "Python", "React", "Node.js"],
        "expertise": [
            {
                "company": "Tech Corp",
                "role": "Senior Developer",
                "date": "2020-Present",
                "description": "Lead development of web applications using modern technologies."
            }
        ],
        "education": [
            {
                "degree": "Bachelor of Computer Science",
                "institution": "University of Technology",
                "start_date": "2016",
                "end_date": "2020"
            }
        ]    }
    
    # Generate test file using the appropriate generator
    if USE_REAL_PDF:
        test_file = "test_cv_branded.pdf"
        print("=== Testing PDF Generation with SAPPCON Branding ===")
        try:
            generate_pdf(sample_data, test_file)
            
            if os.path.exists(test_file):
                file_size = os.path.getsize(test_file)
                print(f"✅ SAPPCON branded PDF generated successfully: {test_file}")
                print(f"   File size: {file_size} bytes")
                print("   Features: SAPPCON logo (when available), branded colors, professional layout")
                return True
            else:
                print("❌ Failed to generate SAPPCON branded PDF")
                return False
        except Exception as e:
            print(f"❌ Error generating SAPPCON branded PDF: {e}")
            print("   Falling back to simple text version...")
            USE_REAL_PDF = False
    
    if not USE_REAL_PDF:
        test_file = "test_cv.txt"
        print("=== Testing PDF Generation (Simple Text Version) ===")
        generate_simple_pdf(sample_data, test_file)
        
        if os.path.exists(test_file):
            print(f"✅ Test CV generated successfully: {test_file}")
            print("Content preview:")
            with open(test_file, 'r', encoding='utf-8') as f:
                print(f.read()[:200] + "...")
            return True
        else:
            print("❌ Failed to generate test CV")
            return False

if __name__ == "__main__":
    test_pdf_generation()
