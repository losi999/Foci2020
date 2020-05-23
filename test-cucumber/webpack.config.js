const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.features?$/,
        use: [
          {
            loader: 'cypress-cucumber-preprocessor/loader'
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'api': path.resolve('../api/src'),
    }
  },
}
