#!/bin/bash

# Change to backend directory
cd /root/dashboard/backend || { echo "Error: Could not change to backend directory"; exit 1; }

# Activate virtual environment
source /root/dashboard/backend/venv/bin/activate || { echo "Error: Could not activate virtual environment"; exit 1; }

# Set Python path and CORS environment variable
export PYTHONPATH="/root/dashboard/backend:$PYTHONPATH"
export BACKEND_CORS_ORIGINS="*"

# Start the backend server with logging
echo "Starting backend server..."
exec /root/dashboard/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4 --proxy-headers --forwarded-allow-ips '*' --log-level info