const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy API requests to the backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding to backend
  },
}));

// Serve static files from the frontend build
app.use(express.static('/root/dashboard/frontend/dist'));

// Handle SPA routing - serve index.html for all non-API routes
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile('/root/dashboard/frontend/dist/index.html');
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
});