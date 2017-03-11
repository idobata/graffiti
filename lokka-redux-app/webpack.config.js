var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, 'src'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, 'src')],
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(['IDOBATA_URL', 'IDOBATA_API_TOKEN', 'IDOBATA_EVENTD_URL']),
    //new webpack.optimize.UglifyJsPlugin()
  ]
};
