#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Node.js dependencies..."
cd backend
npm install

echo "Installing Python dependencies..."
cd ../python
pip install -r requirements.txt

echo "Build completed successfully!"
