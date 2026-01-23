#!/bin/bash

set -e  # Exit on any error

echo "Setting up production environment..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd /root/dashboard/frontend
npm ci --production=false  # Install all dependencies including dev dependencies for building

# Install backend dependencies
echo "Installing backend dependencies..."
cd /root/dashboard/backend
source venv/bin/activate
pip install --no-cache-dir -r requirements.txt

echo "Production setup completed!"