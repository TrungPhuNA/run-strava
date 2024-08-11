const { createProxyMiddleware } = require('http-proxy-middleware');
const URL_API = process.env.REACT_APP_URL_API;
module.exports = function(app) {
    app.use(
        '/auth',
        createProxyMiddleware({
            target: `${URL_API}`,
            changeOrigin: true,
        })
    );
    app.use(
        '/profile',
        createProxyMiddleware({
            target: `${URL_API}`,
            changeOrigin: true,
        })
    );
};
