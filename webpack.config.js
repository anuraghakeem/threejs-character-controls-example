const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const public = path.resolve(__dirname, 'public');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: src,
        exclude: /node_modules/,
      },
      // {
      // test: /\. (png|svg|jpg|jpeg|gif|ico)$/,
      //  use: ['file-loader']
      // }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'index.js',
    path: public
    // path: src
  },
  // output: {
  //   filename: 'index.js',
  //   path: src
  // },
  devServer: {
    contentBase: src,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      // inject: 'body',
    }),
  ],
}