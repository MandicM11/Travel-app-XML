// api_gateway/index.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Konfiguracija za proxy middleware
app.use('/user-service', createProxyMiddleware({ target: 'http://user-service:8001', changeOrigin: true }));
app.use('/blog-service', createProxyMiddleware({ target: 'http://blog-service:8002', changeOrigin: true }));
app.use('/tour-service', createProxyMiddleware({ target: 'http://tour-service:8003', changeOrigin: true }));
app.get('/', (req, res) => {
    res.send('api gateway Service');
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
