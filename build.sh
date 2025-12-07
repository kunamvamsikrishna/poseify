#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Node.js dependencies..."
cd backend
npm install

echo "Upgrading pip..."
cd ../python
pip install --upgrade pip

echo "Installing Python dependencies..."
pip install --no-cache-dir -r requirements.txt

echo "Build completed successfully!"
