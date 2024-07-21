const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();

app.use('/user-service', createProxyMiddleware({
    target: 'http://user-service:8001',
    changeOrigin: true,
    pathRewrite: {
        '^/user-service': '', // Opcionalno, uklanja '/user-service' iz putanje
    },
}));

app.use('/blog-service', createProxyMiddleware({
    target: 'http://blog-service:8002',
    changeOrigin: true,
    pathRewrite: {
        '^/blog-service': '', // Opcionalno, uklanja '/user-service' iz putanje
    },
}));

app.use('/tour-service', createProxyMiddleware({
    target: 'http://tour-service:8003',
    changeOrigin: true,
    pathRewrite: {
        '^/tour-service': '', // Opcionalno, uklanja '/user-service' iz putanje
    },
}));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
