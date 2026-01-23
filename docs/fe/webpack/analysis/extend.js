const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (merge, options) {
  const config = {
    projectName: 'homepage',
    date: '2022-08-01',
    alias: {},
    env: {
      TRACK_MODULE_ID: '"homepage"',
      BUILD_ENV: JSON.stringify(process.env.ENV),
      BUILD_TYPE: JSON.stringify(process.env.BT),
      CHANNEL: JSON.stringify(process.env.CHANNEL),
    },
    weapp: {
      compile: {
        include: [
          'taro-ui',
        ],
      },
    },
    h5: {
      router: {
        customRoutes: {
          '/pages/index/index': '/index',
        },
      },
      esnextModules: [
        'taro-ui',
        '@tarojs\\components',
        '@tarojs/components',
        '@tarojs_components',
        '@tarojs\\\\components',
      ],
    },
  };

  const { optimization, webpackChain } = options || {};
  if (webpackChain && webpackChain.hook) {
    if (process.env.TARO_ENV === 'h5') {
      webpackChain.hook.after = function (chain, webpack) {
        // chain.plugins.delete('htmlWebpackPlugin'); // 删掉taro自动拼接的htmlWebpackPlugin
        chain.merge({
          plugin: {
            htmlWebpackPlugin: {
              plugin: new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'src/index.html',
                minify: {
                  html5: true, // 根据HTML5规范解析输入
                  collapseWhitespace: true, // 折叠空白区域
                  preserveLineBreaks: false,
                  minifyCSS: true, // 压缩文内css
                  minifyJS: true, // 压缩文内js
                  removeComments: false, // 移除注释
                },
              }),
            },
            // 这个插件的key必须是preload，否则无法覆盖index.js里面的配置，此插件只对同步脚本做预加载，并排除runtime和map文件
            preload: {
              plugin: new PreloadWebpackPlugin({
                rel: 'preload',
                include: 'initial',
                fileBlacklist: [/runtime\./, /\.map$/],
              }),
            },
            // 异步脚本预加载规则，从页面chunk中拆分出来的异步脚本都是chunk-开头，此外把白条页面也加上
            preloadAsync: {
              plugin: new PreloadWebpackPlugin({
                rel: 'preload',
                include: 'asyncChunks',
                fileWhitelist: [/chunk-/, /whitebar_index\./, /index_index\./],
              }),
            },
          },
        });
      };
    }
  }
  if (optimization) {
    optimization.splitChunks.cacheGroups.commontemp = false;
    optimization.splitChunks.cacheGroups.ldf = {
      test: /[\\/]node_modules[\\/]@mu[\\/](ldf|lds)/,
      name: 'chunk-ldf',
      chunks: 'all',
      priority: 510,
      reuseExistingChunk: true,
    };
    optimization.splitChunks.cacheGroups.zui = {
      test: /[\\/]node_modules[\\/]@mu[\\/](zui|user-bhvr-detector|wa-richtext|mini-html-parser2)/,
      name: 'chunk-zui',
      chunks: 'all',
      priority: 590,
      reuseExistingChunk: true,
    };
    optimization.splitChunks.cacheGroups.componentsTaro = {
      test: /[\\/]node_modules[\\/]((@tarojs[\\/]components)|(@mu[\\/]swiper-custom)|taro-ui|weui)/,
      name: 'chunk-components-taro',
      chunks: 'all',
      priority: 800,
      reuseExistingChunk: true,
    };
    optimization.splitChunks.cacheGroups.vconsole = {
      test: /[\\/]node_modules[\\/]vconsole[\\/]dist.*/,
      name: 'lazy_vconsole',
      chunks: 'all',
      minChunks: 1,
      priority: 1000,
    };
  }

  return config;
};
