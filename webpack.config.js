var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/javascripts');
var APP_DIR = path.resolve(__dirname, 'src/');

var config = {
  entry: APP_DIR + '/components/app.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  plugins: [],
  module : {
    loaders : [
      {
        test : /\.js$/,
        include : APP_DIR,
        loader : 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
};

module.exports = config;
