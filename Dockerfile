# Multi-stage Dockerfile for CV Extractor with PDF service
FROM node:18-slim as builder

# Install Python and system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Install Python dependencies
WORKDIR /app/pdf_service
RUN pip3 install -r requirements.txt

# Production stage
FROM node:18-slim

# Install Python runtime
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/pdf_service ./pdf_service
COPY --from=builder /app/package.json ./
COPY --from=builder /app/start-production.sh ./

# Install Python dependencies in production
WORKDIR /app/pdf_service
RUN pip3 install -r requirements.txt

WORKDIR /app

# Make scripts executable
RUN chmod +x start-production.sh

# Expose ports
EXPOSE 3000 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start both services
CMD ["bash", "start-production.sh"]
