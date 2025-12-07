FROM node:18-slim

# Install Python and system dependencies for MediaPipe
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    wget \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip3 install --upgrade pip setuptools wheel

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY python/requirements.txt ./python/

# Install Node.js dependencies
WORKDIR /app/backend
RUN npm install --production

# Install Python dependencies one by one to identify issues
WORKDIR /app/python
RUN pip3 install --no-cache-dir numpy==1.26.4
RUN pip3 install --no-cache-dir opencv-python-headless==4.10.0.84
RUN pip3 install --no-cache-dir protobuf==3.20.3
RUN pip3 install --no-cache-dir mediapipe==0.10.14

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
