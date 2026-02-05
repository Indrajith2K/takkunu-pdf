# Dockerfile for takkunu pdf Backend
# Optimized for Render Free Tier

FROM node:20-slim

# Install system dependencies for PDF/Document tools
# This is the CRITICAL part - all open-source tools needed
RUN apt-get update && apt-get install -y \
    # LibreOffice for PDF/Word conversion
    libreoffice \
    libreoffice-writer \
    # Poppler utils (pdfunite, pdfseparate, pdftoppm)
    poppler-utils \
    # qpdf for PDF manipulation
    qpdf \
    # ImageMagick for image conversion
    imagemagick \
    # Clean up to reduce image size
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create temp directory for file processing
RUN mkdir -p temp && chmod 777 temp

# Create a .gitkeep in temp directory
RUN touch temp/.gitkeep

# Expose port (Render will set PORT env variable)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "src/index.js"]
