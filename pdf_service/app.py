from flask import Flask, request, jsonify, send_file, url_for
import os
import uuid
import json
from pdf_generator import generate_pdf
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Enable logging for debugging
import logging
logging.basicConfig(level=logging.INFO)

# Configure upload folder for temporary PDFs
# Use parent directory's temp folder to match the project structure
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'temp'))
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    app.logger.info(f"Created upload folder: {UPLOAD_FOLDER}")

app.logger.info(f"PDF service starting, upload folder: {UPLOAD_FOLDER}")

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "service": "pdf-generator"})

@app.route('/generate-pdf', methods=['POST'])
def create_pdf():
    """Generate PDF from CV data JSON"""
    try:
        # Get JSON data from request
        cv_data = request.json
        
        if not cv_data:
            return jsonify({"error": "No CV data provided"}), 400
        
        # Generate a unique filename
        filename = f"{uuid.uuid4()}.pdf"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
          # Generate the PDF
        app.logger.info(f"Generating PDF: {filepath}")
        generate_pdf(cv_data, filepath)
        
        # Check if file was created successfully
        if os.path.exists(filepath):
            file_size = os.path.getsize(filepath)
            app.logger.info(f"PDF created successfully: {filepath} ({file_size} bytes)")
        else:
            app.logger.error(f"PDF generation failed - file not created: {filepath}")
            return jsonify({"error": "PDF generation failed"}), 500
        
        # Generate download URL
        download_url = url_for('get_pdf', filename=filename, _external=True)
        app.logger.info(f"Download URL: {download_url}")
        
        return jsonify({
            "message": "PDF generated successfully",
            "download_url": download_url
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/pdf/<filename>', methods=['GET'])
def get_pdf(filename):
    """Serve the generated PDF file"""
    try:
        app.logger.info(f"PDF request received for: {filename}")
        
        # Validate filename to prevent directory traversal
        if not filename.endswith('.pdf') or '/' in filename or '\\' in filename:
            app.logger.error(f"Invalid filename: {filename}")
            return jsonify({"error": "Invalid filename"}), 400
            
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        app.logger.info(f"Looking for PDF at: {filepath}")
        
        # Check if file exists
        if not os.path.exists(filepath):
            app.logger.error(f"PDF not found: {filepath}")
            # List files in directory for debugging
            files = os.listdir(UPLOAD_FOLDER) if os.path.exists(UPLOAD_FOLDER) else []
            app.logger.info(f"Files in upload folder: {files}")
            return jsonify({"error": "PDF not found"}), 404
        
        # Extract CV name for download filename
        cv_name = filename.replace('.pdf', '').replace('-', '_')
        download_filename = f"cv-{cv_name}.pdf"
        
        # Use more compatible send_file parameters
        try:
            return send_file(filepath, 
                           mimetype='application/pdf',
                           as_attachment=True,
                           attachment_filename=download_filename)
        except TypeError:
            # Fallback for newer Flask versions
            return send_file(filepath, 
                           mimetype='application/pdf',
                           as_attachment=True)
            
    except Exception as e:
        app.logger.error(f"Error serving PDF {filename}: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Cleanup routine to delete old PDFs (could be improved with a scheduled task)
@app.route('/cleanup', methods=['POST'])
def cleanup_files():
    """Admin endpoint to clean up old PDFs"""
    try:
        # Simple implementation - in production you'd want something more sophisticated
        for file in os.listdir(UPLOAD_FOLDER):
            filepath = os.path.join(UPLOAD_FOLDER, file)
            if os.path.isfile(filepath) and file.endswith('.pdf'):
                os.remove(filepath)
        
        return jsonify({"message": "Cleanup completed successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Use dedicated PDF_SERVICE_PORT or fallback to 5001
    # Don't use PORT env var as it conflicts with main app port
    port = int(os.environ.get('PDF_SERVICE_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('DEBUG', 'False').lower() == 'true')
