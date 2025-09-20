const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true, // 保留原有配置，不改动
  devServer: {
    proxy: {
      // 匹配规则设为 "/"：拦截前端所有请求（因后端无统一前缀，需全量转发）
      '/api': {
        target: 'http://localhost:8081', // 后端服务的真实地址（端口8081）
        changeOrigin: true, // 核心：开启跨域伪装，绕过浏览器同源策略
        ws: true, // 可选：支持WebSocket（如后续有实时通信需求，无则不影响）
        pathRewrite: {
          // 关键：后端无统一前缀时，无需重写路径，保持请求原路径
          '^/api': '/' // 表示“请求路径不变”，前端发什么路径，后端就接收什么路径
        },
        // 可选：排除前端自身的静态资源（如/js、/css），避免不必要的转发（优化）
        bypass: function (req, res, proxyOptions) {
          // 如果请求是访问前端静态资源（以 /js、/css、/img 开头，或后缀是 .html），则不转发到后端
          if (req.path.startsWith('/js/') || req.path.startsWith('/css/') || 
              req.path.startsWith('/img/') || req.path.endsWith('.html')) {
            return req.path; // 直接返回前端自身的静态资源
          }
        }
      }
    }
  }
})