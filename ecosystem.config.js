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