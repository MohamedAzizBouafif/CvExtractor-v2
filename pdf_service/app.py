from flask import Flask, request, jsonify, send_file, url_for
import os
import uuid
import json
from pdf_generator import generate_pdf
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure upload folder for temporary PDFs
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'temp')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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
        generate_pdf(cv_data, filepath)
        
        # Generate download URL
        download_url = url_for('get_pdf', filename=filename, _external=True)
        
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
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Check if file exists
        if not os.path.exists(filepath):
            return jsonify({"error": "PDF not found"}), 404
        
        # Set headers for file download
        return send_file(filepath, 
                         mimetype='application/pdf',
                         as_attachment=True,
                         download_name="CV.pdf")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('DEBUG', 'False').lower() == 'true')
