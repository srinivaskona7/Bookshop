const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// The port the container will listen on. Use 8080 for non-root users.
const port = 8080;

// Proxy /api requests to the backend service
app.use('/api', createProxyMiddleware({
  target: 'http://backend:5000', // The internal address of your backend service
  changeOrigin: true,
}));

// Serve the static files from the current directory
app.use(express.static(__dirname));

// For any other request, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Frontend server listening on port ${port}`);
});