module.exports = {
  // 配置基本路径，使用相对路径定义，让打包输出的文件能够直接在本地运行
  publicPath: './',
  // 配置输出文件目录，使用相对路径输出，让打包输出的文件能够直接在本地运行
  outputDir: './dist',
  // 配置 eslint-loader 是否在保存的时候检查相关语法异常警告提示
  lintOnSave: true,
  // webpack配置 更多相关配置请查阅：https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: () => {},
  configureWebpack: () => {},
  // 生产环境是否生成 sourceMap 文件，在打包后可以直接定位到bug所在的具体位置
  productionSourceMap: true,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin，如果使用的话css将会分离打包，配合按需加载
    extract: true,
    // 是否开启 CSS source maps，在打包后可以直接定位css所在位置
    sourceMap: false,
    // css预设器配置项，所有的 css-loader 选项在这里都是支持的，例如 localIdentName 和 camelCase
    loaderOptions: {
      css: {
        localIdentName: '[name]-[hash]',
        camelCase: 'only',
      },
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
  },
  // 是否为 Babel 或 TypeScript 使用 thread-loader，该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，加快打包效率
  parallel: require ('os').cpus ().length > 1,
  // PWA 插件相关配置，相关细节请参考：https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    //配置自动启动浏览器
    open: true,
    // 配置服务器访问地址，使用以下地址可支持本地局域网内测试，方便移动端链接测试
    host: '0.0.0.0',
    // 端口号
    port: 8080,
    // https:{type:Boolean} 是否启动https
    https: false,
    hotOnly: false,
    // 服务器代理配置，是否启动
    proxy: null,
    /* 如果启动了服务器代理配置，则参考以下进行配置，一般是用来解决跨域问题
        // 配置跨域处理,只有一个代理
        proxy: 'http://localhost:4000'
        // 配置多个代理
        proxy: {
            '/api': {
                target: '<url>',
                ws: true,
                changeOrigin: true
            },
            '/foo': {
                target: '<other_url>'
            }
        },
        before: app => {}, 
    */
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  },
};
