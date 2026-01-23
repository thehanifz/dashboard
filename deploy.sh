#!/bin/bash

set -e  # Exit on any error

echo "Starting deployment process..."

# Stop existing services if running
pm2 stop ecosystem.config.js || true

# Delete existing processes to refresh
pm2 delete ecosystem.config.js || true

# Build the frontend
echo "Building frontend..."
cd /root/dashboard/frontend
npm run build

# Go back to root
cd /root/dashboard

# Start PM2 with production configuration
echo "Starting services with PM2..."
pm2 start ecosystem.config.js

# Save the PM2 process list
pm2 save

echo "Deployment completed!"
echo "Services running:"
pm2 status