# Simple test to check if Python environment is working
import sys
import json

def test_basic_functionality():
    """Test basic Python functionality without external dependencies"""
    print("Python version:", sys.version)
    
    # Test JSON handling
    test_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
    }
    
    json_str = json.dumps(test_data, indent=2)
    print("JSON handling works:", json_str)
    
    return True

if __name__ == "__main__":
    print("=== Python Environment Test ===")
    try:
        test_basic_functionality()
        print("✅ Basic Python functionality works!")
        print("\nNext steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Run the PDF service: python app.py")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Make sure Python is properly installed.")
