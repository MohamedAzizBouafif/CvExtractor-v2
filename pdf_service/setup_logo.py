#!/usr/bin/env python3
"""
Logo Setup Helper for SAPPCON PDF Service

This script helps you add the SAPPCON logo to the PDF service.
Simply place your logo.png file in this directory and run this script to verify it.
"""

import os
from PIL import Image

def check_logo():
    """Check if logo exists and provide information about it"""
    logo_path = "logo.png"
    
    if not os.path.exists(logo_path):
        print("❌ Logo not found: logo.png")
        print("📋 To add the logo:")
        print("   1. Save your SAPPCON logo as 'logo.png' in this directory")
        print("   2. Recommended size: 200x80 pixels")
        print("   3. Format: PNG with transparent background")
        print("   4. Run this script again to verify")
        return False
    
    try:
        with Image.open(logo_path) as img:
            width, height = img.size
            format_info = img.format
            mode = img.mode
            
            print("✅ Logo found and valid!")
            print(f"📐 Dimensions: {width}x{height} pixels")
            print(f"📄 Format: {format_info}")
            print(f"🎨 Mode: {mode}")
            
            # Recommendations
            if width > 300 or height > 120:
                print("⚠️  Logo is quite large - consider resizing for optimal PDF performance")
            elif width < 150 or height < 60:
                print("⚠️  Logo is quite small - may not be very visible in PDF")
            else:
                print("✅ Logo size looks good for PDF use")
                
            if mode == "RGBA":
                print("✅ Logo has transparency support")
            elif mode == "RGB":
                print("ℹ️  Logo is RGB (no transparency)")
            
            return True
            
    except Exception as e:
        print(f"❌ Error reading logo: {e}")
        print("   Make sure the file is a valid image")
        return False

def test_pdf_with_logo():
    """Test PDF generation with the logo"""
    try:
        from pdf_generator import generate_pdf
        
        sample_data = {
            "first_name": "Test",
            "last_name": "User", 
            "email": "test@sappcon.com",
            "summary": "Testing SAPPCON branded CV generation with logo"
        }
        
        output_file = "test_with_logo.pdf"
        generate_pdf(sample_data, output_file)
        
        if os.path.exists(output_file):
            file_size = os.path.getsize(output_file)
            print(f"✅ Test PDF generated: {output_file}")
            print(f"📊 File size: {file_size} bytes")
            return True
        else:
            print("❌ Failed to generate test PDF")
            return False
            
    except ImportError:
        print("⚠️  PDF generator not available - install requirements first")
        return False
    except Exception as e:
        print(f"❌ Error generating test PDF: {e}")
        return False

if __name__ == "__main__":
    print("🎨 SAPPCON Logo Setup Helper")
    print("=" * 40)
    
    logo_ok = check_logo()
    
    if logo_ok:
        print("\n🧪 Testing PDF generation with logo...")
        test_pdf_with_logo()
    
    print("\n📋 Next steps:")
    if not logo_ok:
        print("   1. Add logo.png to this directory") 
        print("   2. Run this script again to verify")
    print("   3. Start the PDF service: python app.py")
    print("   4. Test full integration with the main application")
