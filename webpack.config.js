const path = require('path');
var entry = require('webpack-glob-entry')
const entries = entry((filePath) => {
  const parts = filePath.split(/[\/\.]/)
  return parts[parts.length - 3];
}, './api/src/functions/*/*.index.ts');

module.exports = {
  entry: entries,
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/
        ]
      }
    ]
  },
  target: 'node',
  externals: [
    {
      // These modules are already installed on the Lambda instance.
      'awslambda': 'awslambda',
      'dynamodb-doc': 'dynamodb-doc'
    },
    /^aws-sdk.*/
  ],
  node: {
    // Allow these globals.
    __filename: false,
    __dirname: false
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@foci2020/api': path.resolve('api/src'),
      '@foci2020/shared': path.resolve('shared/src'),
    }
  },
  optimization: {
    minimize: false,
    chunkIds: 'named',
  },
  output: {
    filename: '[name]/index.js',
    path: path.join(__dirname, 'dist', 'api'),
    libraryTarget: 'commonjs2'
  }
};
