const path = require('path');
console.log(__dirname)
module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true
            },
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@foci2020/test': path.resolve('src'),
      '@foci2020/shared': path.resolve('../shared/src'),
    }
  },
}
