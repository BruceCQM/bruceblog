# webpack 构建速度和体积优化

## 使用webpack内置的stats分析体积

webpack 的内置对象 stats 存储着构建的统计信息，包括构建花费的总时间、每个模块的大小等。

webpack 每次构建完成打印出来的内容就是 stats 的统计信息，需要删掉 `stats: "errors-only"` 等精简 stats 输出的配置。

![webpack stats](./images/webpack_stats.png)

也可以把 stats 以 JSON 文件的形式输出到磁盘，在 package.json 文件中增加 scripts 配置项：

```json
"scripts": {
  "build:stats": "webpack --config webpack.prod.js --json > stats.json"
}
```

![webpack stats json](./images/webpack_stats_json.png)

stats 分析构建包体积的缺陷是，只能看到最终的构建包体积大小，分析的颗粒度太大，看不出问题所在，不知道是什么原因导致构建包体积大，看不出哪个模块比较大，哪一个组件比较大，也看不出哪一个 loader 执行比较耗时。

## 构建速度分析: speed-measure-webpack-plugin

speed-measure-webpack-plugin 是一个 webpack 插件，可以分析打包总耗时，以及每个插件以及 loader 的耗时情况。

安装依赖：

```bash
npm install speed-measure-webpack-plugin@1.3.1 -D
```

修改 webpack 配置，使用 speed-measure-webpack-plugin 对象的 `wrap()` 方法将 webpack 配置对象包裹起来即可。

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasureWebpackPlugin();
module.exports = smp.wrap({
  plugins: [],
});
```

结果示例：

![速度分析结果](./images/speed_measure_res.png)

我们需要重点关注红色部分，这些是比较耗时的插件和 loader，接着针对性进行优化。

- UglifyJSPlugin 插件比较耗时，耗费了1分56秒。可以思考有没有更加高效的压缩 JS 的方法，例如可以开启并行压缩。

- sass-loader 耗费了24秒，可以考虑采用 less 会不会更加合理？可以对比两者的耗时。

- ExtractTextPlugin 插件也耗费了1分56秒，可以深入阅读插件的源码，看是否有可以优化的地方，根据团队实际的情况，将插件 fork 过来进行优化。

## 体积分析：webpack-bundle-analyzer

可以分析第三方模块、业务组件代码大小。

安装依赖：

```bash
npm install webpack-bundle-analyzer@3.3.2 -D
```

修改 webpack 配置：

```js
// require('webpack-bundle-analyzer') 导入的是一个对象
// require('webpack-bundle-analyzer').BundleAnalyzerPlugin 才是构造函数
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin(),
  ]
}
```

![优化之前](./images/bundle_analyser_1.png)

可以看到，React 相关内容和 babel-polyfill 占了很大的体积，可以针对性进行优化。例如通过 CDN 引入，就不用打到 bundle 中了。

![优化之后](./images/bundle_analyser_2.png)

除了公共包，如果有某些组件体积很大，可以使用懒加载的方式引入，就不用打到主包中。

## 速度优化：使用高版本的webpack和Node.js

要提升构建速度，推荐使用高版本的 webpack 和 Node.js。

webpack4 的构建时间会比 webpack3 降低 60%~98%。

高版本的 webpack 推荐使用高版本的 Node.js，高版本的 V8 引擎做了更多优化。

- V8带来的优化：for of 替代 forEach、Map 和 Set 替代 Object、includes 替代 indexOf。

- 使用更快的 md4 hash 算法。

- webpack AST 可以直接从 loader 传递给 AST，减少解析时间。

- 使用字符串方法替代正则表达式。

## 多进程多实例构建

多进程多实例并行解析资源，对于复杂的项目，可以显著提高构建速度。

可选方案：

- HappyPack：为 webpack3 编写的多进程构建插件，后续已经没有维护，webpack4 不推荐使用。

- thread-loader：webpack4 官方推出的多进程构建 loader，推荐使用。

- parallel-webpack

### HappyPack

原理：每次 webapck 解析一个模块，HappyPack 会将它及它的依赖分配给 worker 线程中。

安装依赖，在 webpack4 中要使用 5.x 版本。

```bash
npm install happypack@5.0.1 -D
```

修改 webpack 配置：

```js
const HappyPack = require('happypack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'happypack/loader',
      },
    ],
  },
  plugins: [
    new HappyPack({
      loaders: ['babel-loader'],
    })
  ]
}
```

### thread-loader

原理：每次 webpack 解析一个模块，threadloader 会将它及它的依赖分配给 worker 线程中。

安装依赖：

```bash
npm install thread-loader@2.1.2 -D
```

修改 webpack 配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: { 
              workers: 3,
              workerParallelJobs: 50,
              poolTimeout: 2000,
            },
          },
          'babel-loader',
        ]
      }
    ]
  }
}
```

参数说明：

- workers: 并行工作的线程数。通常设置为 CPU 核心数减一。

- workerParallelJobs: 每个线程可以并行处理的任务数。

- poolTimeout: 当一个工作线程空闲超过这个时间（以毫秒为单位）时，它会被终止。设置为 2000 毫秒是一个合理的默认值。

只有支持多线程处理的 loader 才能使用 thread-loader，比如 `babel-loader`、`css-loader`、`ts-loader`。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'thread-loader',
            options: [
              workers: 3,
            ],
          },
          'style-loader',
          'css-loader',
        ]
      }
    ]
  }
}
```

:::danger 注意事项
- 启动开销: 启动线程是有开销的，因此对于非常小的任务，使用 thread-loader 可能会增加构建时间。确保你的任务足够耗时，才能从多线程中获益。

- 内存使用: 每个线程都会占用一定的内存，因此在配置 workers 时要考虑到你的系统内存限制。

- 兼容性: 确保你使用的**加载器**支持多线程处理。大多数现代加载器都支持，但最好检查一下文档。
:::

## 多进程并行压缩代码

并行压缩代码，也可以提高构建速度。

### parallel-uglify-plugin 插件

```js
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  plugins: [
    new ParallelUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false,
          comments: false,
        },
        compress: {
          warnings: false,
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true,
        }
      }
    })
  ]
}
```

### uglify-webpack-plugin 插件

开启 parallel 参数。

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
      },
      parallel: true
    })
  ]
}
```

### terser-webpack-plugin 插件※

terser-webpack-plugin 开启 parallel 参数。推荐使用该方法。

安装依赖：

```bash
npm install terser-webpack-plugin@1.3.0 -D
```

修改配置：

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  }
}
```

## 预编译资源模块

之前提过2种分离基础包的方式，一种是使用 html-webpack-externals-plugin 插件，通过 CDN 引入；一种是通过 splitChunks 进行分包。