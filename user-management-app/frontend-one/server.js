const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = 8080;

// Proxy all requests starting with /api to the backend Kubernetes service
// This is the key to avoiding CORS issues.
app.use('/api', createProxyMiddleware({
  target: 'http://backend:5000',
  changeOrigin: true,
}));

// For any other request, always serve the main index.html file
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Frontend Node.js server listening on port ${port}`);
});