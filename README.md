# Dashboard Application - Production Setup with PM2

This document provides instructions for setting up and running the dashboard application in production using PM2.

## Overview

The dashboard consists of:
- **Backend**: FastAPI application running on port 8000
- **Frontend**: React application served via a proxy server on port 5174
- **Proxy Server**: Express server that serves frontend files and proxies API requests to the backend

## Prerequisites

- Node.js and npm installed
- Python 3.x with pip
- PM2 installed globally: `npm install -g pm2`
- Backend virtual environment already created and activated
- Google Sheets credentials configured

## Initial Setup

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd /root/dashboard/backend
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables in `/root/dashboard/backend/.env`:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
   SPREADSHEET_ID=your_spreadsheet_id
   SHEET_NAME=your_sheet_name
   STATUS_SHEET_NAME=your_status_sheet_name
   STATUS_COL_PRIMARY=Status Pekerjaan
   STATUS_COL_DETAIL=Detail Progres
   BACKEND_CORS_ORIGINS=*
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd /root/dashboard/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

### 3. Install Dependencies for Proxy Server

1. Navigate to the root directory:
   ```bash
   cd /root/dashboard
   ```

2. Install proxy server dependencies:
   ```bash
   npm install express http-proxy-middleware
   ```

## Running with PM2

### 1. Start All Services

```bash
pm2 start ecosystem.config.js
```

### 2. Check Status

```bash
pm2 status
```

You should see:
- `backend_dashboard` - Running on port 8000
- `frontend_dashboard_proxy` - Running on port 5174

### 3. View Logs

```bash
# View all logs
pm2 logs

# View specific service logs
pm2 logs backend_dashboard
pm2 logs frontend_dashboard_proxy
```

### 4. Save PM2 Configuration

```bash
pm2 save
```

This saves the current process list so services start automatically after reboot.

### 5. Set Up Auto-Startup

```bash
pm2 startup
```

This generates the startup script for your OS. Follow the instructions PM2 provides.

## Managing Services

### Restart Services

```bash
# Restart all services
pm2 restart ecosystem.config.js

# Restart specific service
pm2 restart backend_dashboard
pm2 restart frontend_dashboard_proxy
```

### Stop Services

```bash
# Stop all services
pm2 stop ecosystem.config.js

# Stop specific service
pm2 stop backend_dashboard
pm2 stop frontend_dashboard_proxy
```

### Delete Services

```bash
# Delete all services
pm2 delete ecosystem.config.js

# Delete specific service
pm2 delete backend_dashboard
pm2 delete frontend_dashboard_proxy
```

## Configuration Files

### ecosystem.config.js

This file contains the PM2 configuration for both services:

```javascript
module.exports = {
  apps: [
    {
      name: 'backend_dashboard',
      script: './start_backend.sh',
      cwd: '/root/dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      }
    },
    {
      name: 'frontend_dashboard_proxy',
      script: 'node',
      args: 'proxy-server.js',
      cwd: '/root/dashboard',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5174
      }
    }
  ]
};
```

### start_backend.sh

Shell script that starts the backend server with proper environment setup.

### proxy-server.js

Express server that serves the frontend build files and proxies API requests to the backend.

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Make sure ports 8000 and 5174 are not used by other applications.

2. **Permission Issues**: Ensure the user running PM2 has proper permissions to access all files.

3. **Environment Variables**: Verify all required environment variables are set in the backend `.env` file.

4. **CORS Issues**: If experiencing CORS issues, check the `BACKEND_CORS_ORIGINS` setting in the backend config.

### Checking Service Health

```bash
# Check if backend is responding
curl http://localhost:8000/health

# Check if frontend proxy is responding
curl http://localhost:5174
```

## Backup and Restore

### To Backup

Simply copy the entire `/root/dashboard` directory to your backup location.

### To Restore

1. Copy the dashboard directory to the target server
2. Install dependencies as described in the setup section
3. Update paths in configuration files if necessary
4. Start services with PM2

## Updating the Application

### Update Backend

1. Pull latest changes
2. Update dependencies if needed: `pip install -r requirements.txt`
3. Restart backend: `pm2 restart backend_dashboard`

### Update Frontend

1. Pull latest changes
2. Build frontend: `cd frontend && npm run build`
3. Restart proxy: `pm2 restart frontend_dashboard_proxy`

## Ports Used

- Port 8000: Backend API server
- Port 5174: Frontend proxy server

Make sure these ports are accessible from your domain/reverse proxy (e.g., Cloudflare).