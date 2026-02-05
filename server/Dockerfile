# Base Image
FROM node:18-alpine

# Working Directory
WORKDIR /app

# Install LibreOffice for docx-pdf
RUN apk add --no-cache libreoffice util-linux font-noto

# Install Dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy Source Code
COPY . .

# Create temp directory manually to ensure it exists
RUN mkdir -p temp

# Environment Variables
ENV PORT=3000
ENV NODE_ENV=production

# Expose Port
EXPOSE 3000

# Start Command
CMD ["npm", "start"]
