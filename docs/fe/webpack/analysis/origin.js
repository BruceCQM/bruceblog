/* eslint-disable global-require */
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
// eslint-disable-next-line import/no-extraneous-dependencies
const resolve = require('resolve');
// eslint-disable-next-line import/no-extraneous-dependencies
const myPlugin = require('@mu/babel-plugin-transform-madpapi').default;
// eslint-disable-next-line import/no-unresolved
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const PreloadWebpackPlugin = require('preload-webpack-plugin');

// 是否使用本地的基础库内容
const useLocal = process.env.USE_LOCAL === 'true';

// 走线上时，需要对走线上的npm依赖进行配置
let externals = {
  nervjs: '_nervGlobal',
  '@tarojs/taro': '_taroGlobal',
  '@tarojs/taro-h5': '_taroH5Global',
  '@tarojs/router': '_routerGlobal',
};
// 如果走本地，需要将externals设置为空
if (useLocal) {
  externals = {};
}
/**
 * 获取APP类型
 */
function getAPPType() {
  let APP = 'mucfc';
  const argvs = process.argv;
  for (let i = 1; i < argvs.length; i += 1) {
    if (/^(app=)(.*)$/.test(argvs[i])) {
      APP = RegExp.$2;
    }
  }
  return APP;
}

/**
 * 获取业务工程扩展配置
 */
function getExtendConfig() {
  let extendConfig = () => { };
  const appPath = process.cwd();
  const extendPath = path.join(appPath, 'config/extend.js');
  if (fs.existsSync(extendPath)) {
    // eslint-disable-next-line import/no-dynamic-require
    extendConfig = require(extendPath);
  }
  return extendConfig;
}

const extendConfig = getExtendConfig();

/**
 * 在 sass 中通过别名（@ 或 ~）引用需要指定路径
 * @param {*} url
 * @returns
 */
function sassImporter(url) {
  if (url[0] === '~' && url[1] !== '/') {
    return {
      file: path.resolve(__dirname, '..', 'node_modules', url.substr(1)),
    };
  }

  const reg = /^@styles\/(.*)/;
  return {
    file: reg.test(url)
      ? path.resolve(__dirname, '..', 'src/styles', url.match(reg)[1])
      : url,
  };
}

/**
 * 获取配置
 */
function getConfig() {
  // js优化配置
  const optimization = {
    runtimeChunk: 'single',
    moduleIds: 'hashed',
    namedChunks: true, // 避免chunkId自增修改
    splitChunks: {
      chunks: 'initial',
      name: true,
      maxInitialRequests: 12,
      maxAsyncRequests: 12,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-vendor',
          chunks: 'all',
          minChunks: 2,
          priority: 300,
          reuseExistingChunk: true,
        },
        common: {
          test: /[\\/]node_modules[\\/]/,
          name: 'chunk-common',
          chunks: 'all',
          minChunks: 2,
          priority: 350,
          reuseExistingChunk: true,
        },
        commontemp: {
          test: /[\\.]temp/,
          name: 'chunk-common-temp',
          chunks: 'all',
          minChunks: 2,
          priority: 360,
          reuseExistingChunk: true,
        },
        mu: {
          test: /[\\/]node_modules[\\/]@mu/,
          name: 'chunk-mu',
          chunks: 'all',
          minChunks: 2,
          priority: 500,
          reuseExistingChunk: true,
        },
        components: {
          test: /[\\/]node_modules[\\/]@mu[\\/](zui|lui)/,
          name: 'chunk-components',
          chunks: 'all',
          minChunks: 2,
          priority: 550,
          reuseExistingChunk: true,
        },
        madp: {
          test: /[\\/]node_modules[\\/]@mu[\\/]madp.*/,
          name: 'chunk-madp',
          priority: 600,
          reuseExistingChunk: true,
        },
        taro: {
          test: /[\\/]node_modules[\\/](nervjs|@tarojs|@mu[\\/]bl|core-js|weixin-js-sdk|mobx|aes-js|elliptic|crypto-js)[\\/]/,
          name: 'chunk-taro',
          chunks: 'all',
          priority: 700,
          reuseExistingChunk: true,
        },
        componentsTaro: {
          test: /[\\/]node_modules[\\/]@tarojs[\\/]components/,
          name: 'chunk-components-taro',
          chunks: 'all',
          priority: 800,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      // eslint-disable-next-line arrow-parens
      compiler => {
        // eslint-disable-next-line import/no-extraneous-dependencies
        const TerserPlugin = require('terser-webpack-plugin');
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }).apply(compiler);
      },
    ],
  };

  // 暴露webpackChain hook
  const webpackChain = {
    hook: {},
  };

  const config = {
    projectName: 'muwa1-ts-project',
    date: '2025-06-09',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: {
      csso: {
        enable: true,
        config: {
          comments: false,
        },
      },
      babel: {
        sourceMap: true,
        presets: [
          [
            'env',
            {
              useBuiltIns: true,
              modules: false,
              targets: {
                browsers: ['ios >= 7', 'Android >= 4'],
              },
            },
          ],
        ],
        plugins: [
          'transform-decorators-legacy',
          'transform-class-properties',
          'transform-object-rest-spread',
          ['transform-runtime', { helpers: false, polyfill: false, regenerator: true }],
        ],
      },
      sass: {
        importer: sassImporter,
      },
      uglify: {
        enable: true,
        config: {
          // 配置项同 https://github.com/mishoo/UglifyJS2#minify-options
          sourceMap: process.env.NODE_ENV === 'development',
        },
      },
      csso: {
        enable: true,
        config: {
          comments: false,
        },
      },
    },
    alias: {
      '@src': path.resolve(__dirname, '..', 'src'),
      '@api': path.resolve(__dirname, '..', 'src/api'),
      '@comp': path.resolve(__dirname, '..', 'src/components'),
      '@constants': path.resolve(__dirname, '..', 'src/constants'),
      '@utils': path.resolve(__dirname, '..', 'src/utils'),
      '@styles': path.resolve(__dirname, '..', 'src/styles'),
      '@config': path.resolve(__dirname, '..', 'src/config'),
      '@mucfc.com': path.resolve(__dirname, '..', 'node_modules', '@mucfc.com'),
      '@models': path.resolve(__dirname, '..', 'src/domain/models'),
      '@services': path.resolve(__dirname, '..', 'src/domain/services'),
      '@assets': path.resolve(__dirname, '..', 'src/assets'),
      '@store': path.resolve(__dirname, '..', 'src/domain/stores'),
    },
    env: {
      TRACK_MODULE_ID: '""',
      BUILD_ENV: JSON.stringify(process.env.ENV),
      BUILD_TYPE: JSON.stringify(process.env.BT),
      APP: JSON.stringify(getAPPType()),
      USE_LOCAL: JSON.stringify(process.env.USE_LOCAL),
      MODULE_VERSION: JSON.stringify(require('../package.json').version || ''),
    },
    weapp: {
      compile: {
        include: [
          'taro-ui',
          '@mu\\zui',
          '@mu/zui',
          '@tarojs\\components',
          '@tarojs/components',
        ],
      },
      module: {
        postcss: {
          autoprefixer: {
            enable: true,
            config: {
              browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
            },
          },
          pxtransform: {
            enable: true,
            config: {},
          },
          url: {
            enable: true,
            config: {
              limit: 10240, // 设定转换尺寸上限
            },
          },
          cssModules: {
            enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
            config: {
              namingPattern: 'module', // 转换模式，取值为 global/module
              generateScopedName: '[name]__[local]___[hash:base64:5]',
            },
          },
        },
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[contenthash:8].js',
        sourceMapFilename: 'sourcemap/[file].map',
      },
      imageUrlLoaderOption: {
        limit: 1, // 所有image都不转换为base64
        name: 'static/images/[name].[contenthash:8].[ext]',
      },
      miniCssExtractPluginOption: {
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css',
      },
      miniCssExtractLoaderOption: {
        publicPath: '../',
      },
      esnextModules: [
        'taro-ui',
        '@tarojs\\components',
        '@tarojs/components',
        '@tarojs_components',
        '@tarojs\\\\components',
        '@mu\\zui',
        '@mu/zui',
        '@mu\\lui',
        '@mu/lui',
      ],
      module: {
        postcss: {
          autoprefixer: {
            enable: true,
            config: {
              browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8'],
            },
          },
          cssModules: {
            enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
            config: {
              namingPattern: 'module', // 转换模式，取值为 global/module
              generateScopedName: '[name]__[local]___[hash:base64:5]',
            },
          },
        },
      },
      /* eslint-disable-next-line */
      webpackChain(chain, webpack) {
        /* eslint-disable-next-line */
        webpackChain.hook.before && webpackChain.hook.before(chain, webpack);
        if (process.env.TARO_ENV === 'h5') {
          chain.merge({
            plugin: {
              runtimeChunkInline: {
                plugin: new ScriptExtHtmlWebpackPlugin({
                  inline: /runtime.+\.js$/, // 正则匹配runtime文件名
                }),
              },
              preload: {
                plugin: new PreloadWebpackPlugin({
                  rel: 'preload',
                  include: 'allChunks',
                  fileBlacklist: [/runtime\./, /_/, /\.map$/],
                  fileWhiteList: [/chunk-/],
                }),
              },
              vConsole: {
                // eslint-disable-next-line import/no-unresolved
                plugin: require('vconsole-webpack-plugin'),
                args: [
                  {
                    enable: process.argv.indexOf('debug') > -1 || process.env.NODE_ENV !== 'production',
                  },
                ],
              },
              async: {
                // eslint-disable-next-line
                plugin: new webpack.NamedChunksPlugin((chunk) => {
                  if (chunk.name) {
                    return chunk.name;
                  }
                  // eslint-disable-next-line
                  return Array.from(chunk.modulesIterable, (m) => m.id.toString().replace(/(\/|\+)/g, '')).slice(0, 2).join('_');
                }),
              },
            },
          });
        }
        // splitChunks chain
        chain.merge({
          optimization,
          module: {
            rule: {
              imageCompressLoader: {
                test: /\.(png|jpe?g|gif|bpm|svg)(\?.*)?$/,
                use: [
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      disable: process.env.NODE_ENV === 'development', // webpack@2.x and newer
                      bypassOnDebug: true,
                      mozjpeg: {
                        progressive: true,
                      },
                      // optipng.enabled: false will disable optipng
                      optipng: {
                        enabled: false,
                      },
                      pngquant: {
                        quality: [0.65, 0.9],
                        speed: 4,
                      },
                      gifsicle: {
                        optimizationLevel: 3,
                        colors: 32,
                      },
                    },
                  },
                ],
              },
            },
          },
          externals,
        });
        // analyzer only enabled when report argvs passed in
        if (process.argv.indexOf('report') > -1) {
          chain
            .plugin('analyzer')
            // eslint-disable-next-line import/no-unresolved
            .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, []);
        }
        /* eslint-disable-next-line */
        webpackChain.hook.after && webpackChain.hook.after(chain, webpack);
      },
    },
  };

  if (process.env.TARO_ENV === 'h5') {
    config.plugins.babel.plugins.unshift([
      myPlugin,
      {
        // eslint-disable-next-line import/no-dynamic-require
        madpApis: require(resolve.sync('@mu/madp/dist/madpApis', {
          basedir: path.join(__dirname, '..', 'node_modules'),
        })),
        // eslint-disable-next-line import/no-dynamic-require
        taroApis: require(resolve.sync('@tarojs/taro-h5/dist/taroApis', {
          basedir: path.join(__dirname, '..', 'node_modules'),
        })),
        env: 'h5',
      },
    ]);
  }

  return function (merge) {
    if (process.env.NODE_ENV === 'development') {
      return merge(
        {},
        config,
        require('./dev'),
        extendConfig(merge, { optimization, webpackChain }),
      );
    }
    return merge(
      {},
      config,
      require('./prod'),
      extendConfig(merge, { optimization, webpackChain }),
    );
  };
}

module.exports = getConfig();
