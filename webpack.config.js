const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  mode: "production",
  entry: {
    index: './src/index.js',
    index2: './src/index.js',
  },
  output: {
    filename: '[name].bundle[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
          use: ExtractTextPlugin.extract({
            allChunks: true,
            fallback: "style-loader",
            use: ['css-loader', 'postcss-loader']
          })
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env']],
          }
        }
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[md5:contenthash:hex:8].css',
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    new CopyWebpackPlugin(  // 把demo.html 里面引入的静态资源拷贝到 dist下面去， 解决之前打包之后，index.html里面引入的静态资源找不到的问题
      {
        patterns: [
          {
            from: path.resolve(__dirname, './src/testCopy/test.js'),  // demo.html 里面引入的test.js 的所在文件夹的路径
            to: path.resolve(__dirname, './dist/testCopy'), // 打包在dist后，test.js在dist文件夹下所处的路径 
          }
        ]
      }
    ),
    new HtmlWebpackPlugin({
      title: 'Output Management',
      filename: 'index.html',
      template: path.join(__dirname, './src/index.html')
    })
  ],
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        manifest: {
          minChunks: 1,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};