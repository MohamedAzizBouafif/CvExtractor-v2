FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for ReportLab
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directory for temporary files
RUN mkdir -p temp
RUN chmod 777 temp

# Environment variables
ENV PORT=5001
ENV UPLOAD_FOLDER=temp
ENV DEBUG=False

# Expose the port
EXPOSE 5001

# Run the application with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]
