# Production Deployment Guide

This document explains how to deploy the dashboard application in production mode using PM2.

## Prerequisites

- Node.js and npm installed
- Python 3.x with pip
- PM2 installed globally: `npm install -g pm2`
- Backend virtual environment already created and activated

## Setup Production Environment

Before deploying, run the setup script to install dependencies:

```bash
./setup_production.sh
```

## Deploy Application

To deploy the application in production mode:

```bash
./deploy.sh
```

This script will:
1. Build the frontend application
2. Start both frontend and backend services using PM2
3. Save the PM2 process list

## Manual PM2 Commands

If you prefer to manage services manually:

### Start Services
```bash
pm2 start ecosystem.config.js
```

### Stop Services
```bash
pm2 stop ecosystem.config.js
```

### Restart Services
```bash
pm2 restart ecosystem.config.js
```

### View Logs
```bash
pm2 logs
```

### Monitor Status
```bash
pm2 status
```

### Save Current Process List
```bash
pm2 save
```

## Service Configuration

- Frontend: Served on port 5174 (built from `/frontend/dist`)
- Backend: Runs on port 8000 (configured in `start_backend.sh`)

## Auto-start on Boot

To configure PM2 to auto-start on system boot:

```bash
pm2 startup
pm2 save
```

This will create the necessary startup scripts for your OS.