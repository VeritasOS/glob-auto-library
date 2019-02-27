const path = require('path');
const nodeExternals = require('webpack-node-externals');
const DtsBundleWebpack = require('dts-bundle-webpack');

module.exports = {
  devtool: 'source-map',
  entry: ['./src/lib/gal'],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  node: {
    console: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  output: {
    path: path.resolve(__dirname, 'built'),
    filename: '../lib/lib.js',
    library: 'glob-auto-library',
    libraryTarget: 'umd'
  },
  plugins: [
    new DtsBundleWebpack(
      {
        name: 'glob-auto-library',
		main:  'built/lib/gal.d.ts',
        baseDir: 'built',
        out: '../lib/lib.d.ts',
        removeSource: false,
        outputAsModuleFolder: true // to use npm in-package typings
      }
    )
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()] // in order to ignore all modules in node_modules folder  
};
