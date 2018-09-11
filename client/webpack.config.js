const path = require('path');
const webpack = require('webpack');

module.exports = {
  // 项目的入口文件
  entry: './src/main.js',
  //配置bulid时的输出路径及文件名
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },

  module: {
    //规定不同文件的加载器
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  // 代码的解析规定
  resolve: {
    //别名 : vue$ 代表文件 'vue/dist/vue.esm.js'
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    // require时省略的扩展名，如：require('module') 不需要module.js
    extensions: ['*', '.js', '.vue', '.json']
  },
  //webpack-dev-server 的配置
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    //添加代理,将所有的`/api/xxx`转发到服务器所在的端口,解决跨域问题
    // 将此类请求转发到 8848 端口
    proxy: {
      '/api':{
        target: 'http://localhost:8848',
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'http://localhost:8848'
        }
      }
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};

// 生产环境，运行npm run build则执行这里
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map';
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
      //环境变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    //压缩代码
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
])
}
