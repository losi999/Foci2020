const path = require('path');
var entry = require('webpack-glob-entry')
const entries = entry((filePath) => {
  const parts = filePath.split(/[\/\.]/)
  return parts[parts.length - 3];
}, './src/*/*/*.index.ts');

module.exports = {
  entry: entries,
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader?configFile=tsconfig.webpack.json',
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
      '@': path.resolve('src')
    }
  },
  optimization: {
    minimize: false,
    namedModules: true
  },
  output: {
    filename: '[name]/index.js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  }
};
