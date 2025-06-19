#!/usr/bin/env python3
"""
Simple script to verify PDF service configuration and dependencies
"""
import sys
import os
import subprocess

def check_python_version():
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")

def check_dependencies():
    required_packages = ['flask', 'werkzeug', 'reportlab', 'gunicorn', 'python-dotenv', 'pillow']
    missing = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} - OK")
        except ImportError:
            print(f"❌ {package} - MISSING")
            missing.append(package)
    
    return missing

def check_environment():
    print(f"Current working directory: {os.getcwd()}")
    print(f"PDF_SERVICE_PORT: {os.environ.get('PDF_SERVICE_PORT', 'Not set')}")
    print(f"PORT: {os.environ.get('PORT', 'Not set')}")
    print(f"NODE_ENV: {os.environ.get('NODE_ENV', 'Not set')}")

def main():
    print("🔍 PDF Service Diagnostic Check")
    print("=" * 40)
    
    check_python_version()
    print()
    
    print("Environment Variables:")
    check_environment()
    print()
    
    print("Package Dependencies:")
    missing = check_dependencies()
    print()
    
    if missing:
        print(f"❌ Missing packages: {', '.join(missing)}")
        print("Run: pip install -r requirements.txt")
        return 1
    else:
        print("✅ All dependencies satisfied")
    
    print("\n🚀 Ready to start PDF service!")
    return 0

if __name__ == "__main__":
    sys.exit(main())
