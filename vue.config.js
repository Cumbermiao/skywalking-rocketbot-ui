/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;

const federation = new ModuleFederationPlugin({
  name: 'SkyWalking',
  filename: 'remote-skywalking.js',
  exposes: {
    './SKButton': './src/components/rk-button.vue',
  },
  shared: require('./package.json').dependencies,
});

module.exports = {
  productionSourceMap: process.env.NODE_ENV !== 'production',
  publicPath: 'auto',
  devServer: {
    proxy: {
      '/graphql': {
        target: `${process.env.SW_PROXY_TARGET || 'http://10.3.7.243:12800'}`,
        changeOrigin: true,
      },
    },
    port: 8090,
    hot: true,
    compress: true,
    historyApiFallback: true,
    allowedHosts: 'all',
  },
  chainWebpack: (config) => {
    config.optimization.delete('splitChunks');
    // const svgRule = config.module.rule('svg');
    // svgRule.uses.clear();
    // svgRule
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     symbolId: '[name]',
    //   });
  },
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin(), federation],
    optimization: {
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          echarts: {
            name: 'echarts',
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            priority: 2,
          },
          monacoEditor: {
            name: 'monaco-editor',
            test: /[\\/]node_modules[\\/]monaco-editor[\\/]/,
            priority: 1,
          },
        },
      },
    },
    module: {
      rules: [
        // fix: webpack5默认使用 asset/resource 处理 svg 导致 svg 组件图标不展示问题
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          options: {
            symbolId: '[name]',
          },
          type: 'javascript/auto',
        },
      ],
    },
  },
};
