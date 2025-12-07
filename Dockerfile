FROM node:18-slim

# Install Python and system dependencies for MediaPipe
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    python3.11-venv \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libglib2.0-0 \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY python/requirements.txt ./python/

# Install Node.js dependencies
WORKDIR /app/backend
RUN npm install --production

# Install Python dependencies
WORKDIR /app/python
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
WORKDIR /app
COPY backend ./backend
COPY python ./python

# Set working directory to backend
WORKDIR /app/backend

# Create uploads and backups directories
RUN mkdir -p uploads backups

# Expose port
EXPOSE 10000

# Start the application
CMD ["node", "server.js"]
