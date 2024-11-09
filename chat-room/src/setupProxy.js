const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for API requests
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://192.168.1.11:5000',
      changeOrigin: true,
      secure: false,
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).send('Proxy Error');
      },
      logLevel: 'debug'
    })
  );

  // Separate proxy for Socket.IO
  app.use(
    '/socket.io',
    createProxyMiddleware({
      target: 'http://192.168.1.11:5000',
      changeOrigin: true,
      ws: true,
      secure: false,
      onError: (err, req, res) => {
        console.error('Socket.IO Proxy Error:', err);
        res.status(500).send('Socket.IO Proxy Error');
      },
      logLevel: 'debug'
    })
  );
};