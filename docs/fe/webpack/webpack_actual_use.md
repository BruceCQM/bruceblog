# webpack 实战

本文内容是极客时间[《玩转webpack》](https://time.geekbang.org/course/intro/100028901)课程的内容整理笔记。

## 解析 ES6

webpack 不能识别 ES6 语法，因此需要使用 babel-loader 进行转换。

使用 babel-loader，需要增加 `.babelrc` 增加配置。比如：

```json
{
  // 一个preset可以理解为是一系列plugin的集合
  "presets": [
    "@babel/preset-env",
  ],
  // 一个plugin可以理解为一个功能
  "plugins": [
    "@babel/proposal-class-properties",
  ]
}
```

安装依赖：

```bash
npm i @babel/core@7.26.0 @babel/preset-env@7.26.0 babel-loader@8.0.5 -D
```

创建 `.babelrc` 文件，增加 ES6 配置：

```json
{
  "presets": [
    // es6的babel配置
    "@babel/preset-env",
  ]
}
```

修改 webpack 配置：

```js
module.exports = {
  module: {
    rules: [
      test: /.js$/,
      use: 'babel-loader',
    ]
  }
}
```

## 解析 React JSX

所需依赖：react、react-dom、@babel/preset-react。

安装依赖：

```bash
npm i react@16.8.6 react-dom@16.8.6 @babel/preset-react@7.0.0 -D
```

`.babelrc` 文件增加 React 的 babel preset 配置。

```js
{
  "presets": [
    // es6的babel配置
    "@babel/preset-env",
    // react的babel配置
    "@babel/preset-react",
  ]
}
```

## 解析样式文件

### 解析 CSS

解析 CSS 使用到的 loader：css-loader、style-loader。

css-loader 用于加载 .css 文件，并且转换成 commonjs 对象。style-loader 将样式通过 `<style>` 标签插入到 head 中。

安装依赖：

```bash
npm i css-loader@2.1.1 style-loader@0.23.1 -D
```

修改配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
}
```

### 解析 Less

只需要在解析 less 的基础上增加一个 less-loader 即可，它的作用是将 less 转换成 css。

less-loader 是依赖 less 的，因此需要一起安装。

安装依赖：

```bash
npm i less@3.9.0 less-loader@5.0.0 -D
```

修改配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      }
    ]
  }
}
```

## 解析图片和字体

### 方式一：file-loader

解析图片和字体使用到的 loader：file-loader。

安装依赖：

```bash
npm i file-loader@3.0.1 -D
```

修改配置：

```js
module.exports = {
  module: {
    rules: [
      // 解析图片
      {
        test: /.(png|jpg|gif|svg)$/,
        use: 'file-loader',
      },
      // 解析字体
      {
        test: /.(ttf|woff|woff2|eot)$/,
        use: 'file-loader',
      }
    ]
  }
}
```

### 方式二：url-loader

url-loader 也可以处理图片和字体，并且可以设置较小资源转换为 base64，不单独生成文件，直接打入到 bundle 中。

实际上 url-loader 内部是使用了 file-loader。

安装依赖：

```bash
npm i url-loader@1.1.2 -D
```

修改配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            // 设置小于 10KB 的图片为 base64
            options: {
              limit: 10240
            }
          }
        ]
      }
    ]
  }
}
```

## webpack文件监听

文件监听是指在发现源码发生变化时，自动重新构建出新的输出文件。

文件监听的原理：轮询判断文件的最后编辑时间是否变化。如果文件发生变化，不会立刻告诉监听者，而是先缓存起来，等待 aggregateTimeout 时间后，再重新构建。如果等待的时间内有其它文件也被修改了，会一起重新构建。

webpack 开启监听模式的两种方式：

- 启动 webpack 命令时，增加 `--watch` 参数。这种方式的缺陷是，每次重新构建完需要手动刷新浏览器。

```bash
# package.json
{
  "scripts": {
    "watch": "webpack --watch"
  },
}
```

- 在 webpack.config.js 配置文件中，设置 `watch: true`。

```js
module.exports = {
  // 是否开启文件监听
  watch: true,
  // 开启文件监听后，watchOptions才会生效
  watchOptions: {
    // 忽略监听的文件或文件夹，默认为空
    ignored: /node_modules/,
    // 监听到变化后等300ms再重新构建，默认300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化，是通过不停询问系统，指定文件有没有变化实现的，默认每秒询问1000次
    poll: 1000
  }
}
```
 

## 代码压缩

### JS 代码压缩

在 webpack4 中，已经内置了 uglify-webpack-plugin 这个插件，打包出来的 JS 文件默认已经压缩过，无需再手动调用。

当然也可以手动调用，去修改它的配置参数，比如开启并行压缩。

### CSS 代码压缩

所需依赖：optimize-css-assets-webpack-plugin、cssnano 预处理器。

安装依赖：

```bash
npm i optimize-css-assets-webpack-plugin@5.0.1 cssnano@4.1.10 -D
```

修改配置：

```js
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  plugins: [
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    })
  ]
}
```

### HTML 文件压缩

所需插件：html-webpack-plugin，设置压缩参数。

安装依赖：

```bash
npm i html-webpack-plugin@3.2.0 -D
```

修改配置：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/search/index.html"),
      filename: "search.html",
      // 指定生成的html要使用哪些chunk
      chunks: ["search"],
      // css、js自动注入到html中
      inject: true,
      // 设置HTML文件的压缩参数
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false,
      },
    })
  ]
}
```

## 自动清理构建目录产物

不太优雅的做法：通过 npm scripts 清理构建目录，在执行打包命令之前先删除目录。

```bash
rm -rf ./dist && webpack

rimraf ./dist && webpack
```

使用插件：clean-webpack-plugin。

安装依赖：

```bash
npm i clean-webpack-plugin@2.0.2 -D
```

修改配置：

```js
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
  ]
}
```

## postcss插件autoprefixer自动补齐css属性前缀

根据 Can I Use 规则（ https://caniuse.com/ ），决定是否增加css属性前缀。

所需依赖：postcss-loader autoprefixer。

安装依赖：

```bash
npm i postcss-loader@3.0.0 autoprefixer@9.5.1 -D
```

增加配置：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.less$/,
        use: [
          'style-loader',
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("autoprefixer")({
                  browsers: ["last 6 version", ">1%", "ios 4"],
                }),
              ],
            },
          },
        ],
      },
    ]
  }
}
```

## 静态资源内联

所谓静态资源内联，就是在 HTML 文件中引入静态资源，比如图片、js、css等。

资源内联的意义：

1、代码层面

- 页面框架的初始化脚本

- 上报相关打点

- css 内联可避免页面闪动

2、请求层面

- 减少 HTTP 请求次数。小图片或者字体可以内联到 HTML 中，使用 url-loader。

### HTML、js内联

所需依赖：raw-loader。

HTML 内联：`${require('raw-loader!./meta.html')}`。

JS 内联：`<script>${require('raw-loader!babel-loader!../../node_modules/lib-flexible/flexible.js')}</script>`。

安装依赖，raw-loader 选择安装 0.5.x 的版本，高版本有问题。

```bash
npm i raw-loader@0.5.1 -D
```

HTML 文件使用 raw-loader：

```shell
.
├── src
│   ├── index
│   │   ├── index.html
│   │   └── index.js
|   |
│   ├── search
│       ├── index.html
|       ├── index.js
|       ├── search.less
│       └── meta.html
├── .gitignore
├── package.json
├── webpack.prod.js
...
```

```html
<!-- src/search/meta.html -->
<meta charset="UTF-8">
<meta name="viewport" content="viewport-fit=cover,width=device-width,initial-scale=1,user-scalable=no">
<meta name="format-detection" content="telephone=no">
<meta name="keywords" content="now,now直播,直播,腾讯直播,QQ直播,美女直播,附近直播,才艺直播,小视频,个人直播,美女视频,在线直播,手机直播">
<meta name="name" itemprop="name" content="NOW直播—腾讯旗下全民视频社交直播平台"><meta name="description" itemprop="description" content="NOW直播，腾讯旗下全民高清视频直播平台，汇集中外大咖，最in网红，草根偶像，明星艺人，校花，小鲜肉，逗逼段子手，各类美食、音乐、旅游、时尚、健身达人与你24小时不间断互动直播，各种奇葩刺激的直播玩法，让你跃跃欲试，你会发现，原来人人都可以当主播赚钱！">
<meta name="image" itemprop="image" content="https://pub.idqqimg.com/pc/misc/files/20170831/60b60446e34b40b98fa26afcc62a5f74.jpg"><meta name="baidu-site-verification" content="G4ovcyX25V">
<meta name="apple-mobile-web-app-capable" content="no">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<link rel="dns-prefetch" href="//11.url.cn/">
<link rel="dns-prefetch" href="//open.mobile.qq.com/">

<!-- src/search/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- 引入meta.html文件的内容 -->
  ${require('raw-loader!./meta.html')}
  <title>Document</title>
  <!-- 引入lib-flexible的flexible.js文件，babel-loader转化ES6语法 -->
  <script>${require('raw-loader!babel-loader!../../node_modules/lib-flexible/flexible.js')}</script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### css内联

#### 方案一：使用 style-loader。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              // 样式插入到head标签顶部，bottom就是head的底部
              insertAt: 'top',
              // 将所有的style标签合并成一个
              singleton: true,
            }
          },
          'css-loader',
          'scss-loader',
        ]
      }
    ]
  }
}
```

样式插入到head标签顶部，所有style标签合并成一个：

![style-loader-top-singleton](./images/style_loader_top_singleton.png)

样式插入到head标签底部，style标签不合并：

![style-loader-bottom-not-singleton](./images/style_loader_bottom_not_singleton.png)

#### 方案二：使用 html-inline-css-webpack-plugin。

核心思路是：将页面打包过程的产生的所有 CSS 提取成一个独立的文件，然后将这个 CSS 文件内联进 HTML head 里面。这里需要借助 mini-css-extract-plugin 和 html-inline-css-webpack-plugin 来实现 CSS 的内联功能。

安装依赖：

```bash
npm i html-inline-css-webpack-plugin@1.2.1 mini-css-extract-plugin@0.6.0 -D
```

修改配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
        ],
      },
    ]
  }
  plugins: [
    new MiniCssExtractPlugin({
        filename: '[name]_[contenthash:8].css'
    }),
    new HtmlWebpackPlugin(),
    new HTMLInlineCSSWebpackPlugin()
  ]
};
```

注：html-inline-css-webpack-plugin 需要放在 html-webpack-plugin 后面。

![html-inline-css-webpack-plugin](./images/html_inline_css_webpack_plugin.png)

#### 两种方式区别

使用 html-inline-css-webpack-plugin，生成的 html 静态文件中已经引入了样式。

而 style-loader 生成的 html 文件本身是没有引入样式的，是在运行 html 文件的时候动态引入，因此查看网页源代码可以看到样式引入。

:::warning
style-loader 插入样式是一个动态的过程，你可以直接查看打包后的 html 源码，并不会看到 html 有 style 样式的。

css-loader 的作用是将 css 转换成 commonjs 对象，也就是样式代码会被放到 js 里面去了。style-loader 是代码运行时动态的创建 style 标签，然后将 css style 插入到 style 标签里面去，对应的源码：https://github.com/webpack-contrib/style-loader/blob/master/src/runtime/injectStylesIntoStyleTag.js#L260

html-inline-css-webpack-plugin CSS 内联的思路是：先将 css 提取打包成一个独立的 css 文件（使用MiniCssExtractPlugin.loader），然后读取提取出的 css 内容注入到页面的 style 里面去。这个过程在构建阶段完成。
:::

### 更多文章

[webpack4如何实现资源内联](https://github.com/cpselvis/blog/issues/5){link=static}

## 多页面应用打包通用方案

多页面应用（MPA）概念：每⼀次⻚⾯跳转的时候，后台服务器都会给返回⼀个新的 html ⽂档，这种类型的⽹站也就是多⻚⽹站，也叫做多⻚应⽤。

现状：每多一个页面，都需要修改 webpack 配置，在 entry 中增加一个入口，同时要增加一个 html-webpack-plugin 配置，删除一个页面也是同理，非常麻烦。

多页面打包期望效果：增加或删除页面，不需要手动修改 webpack 配置，可以自动生成配置。

主要思路：读取指定目录下的文件（这个目录路径是需要提前约定好的，比如都是按照 `src/search/index.js` 这样的方式组织文件目录，入口文件名都约定为 `index.js`），在打包的时候动态设置 entry 和 html-webpack-plugin 配置。

需要使用到的依赖：[glob](https://www.npmjs.com/package/glob/v/7.2.3)。使用 `glob.sync()` 方法匹配所有满足条件的文件路径。

安装依赖：

```bash
npm i glob@7.1.4 -D
```

修改 webpack 配置，动态匹配 src 目录下每个页面的 index 文件路径，然后设置 entry 和 html-webpack-plugin 配置。

```js
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  // ['C:/Users/xxx/src/index/index.js','C:/Users/xxx/src/search/index.js']
  const entryFile = glob.sync(path.join(__dirname, './src/*/index.js'));
  Object.keys(entryFile).map(value => {
    // 'C:/Users/xxx/src/search/index.js'
    const entryFile = entryFile[value];
    // [
    //   'src/search/index.js',
    //   'search',
    //   index: 81,
    //   input: 'C:/Users/xxx/src/search/index.js',
    //   groups: undefined
    // ]
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: path.join(__dirname, `src/${pageName}/index.html`),
      filename: `${pageName}.html`,
      // 指定生成的html要使用哪些chunk
      chunks: [pageName],
      // css、js自动注入到html中
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false,
      },
    }))
  })

  return {
    entry,
    htmlWebpackPlugins,
  }
}

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  plugins: [
    ...htmlWebpackPlugins,
    new HTMLInlineCSSWebpackPlugin(),
    new CleanWebpackPlugin(),
  ]
}
```

## 使用 source map

什么是 source map：source map 是一个信息文件，记录这转换后的代码与转换前的代码的位置对应关系。有了它，代码报错的时候，浏览器就可以直接显示原始代码，而不是转换后的代码。为开发者调试提供了很大方便。

[JavaScript Source Map 详解](https://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html){link=static}

一般在开发环境开启 source map，在生产环境关闭，避免泄露源代码。

线上排查问题可以将 source map 上传到错误监控系统。

source map 关键字：

- eval：使用 eval 包裹模块代码。

- source map：产生 `.map` 文件。

- cheap：不包含列信息。

- inline：将 `.map` 作为 DataURI 嵌入，不单独生成 `.map` 文件。

- module：包含 loader 的 source map。

![source map类型](./images/source_map_type.png)

在 webpack 配置中，通过设置 `devtool` 参数来开启 source map。

```js
module.exports = {
  devtool: 'source-map',
}
```

不同类型的 source map 的区别：

### `devtool: 'eval'`

每个模块的代码用 `eval()` 包裹，不会生成 source map 文件。这种方式可以加快构建速度，但调试时只能看到编译后的代码，无法看到原始代码。

![eval 生成的chunk](./images/eval_chunk.png)

![eval 类型的报错](./images/eval_error.png)

![eval 类型源码](./images/eval_sources_code.png)

### `devtool: 'source-map'`

会生成一个单独的 source map 文件，包含完整的信息，体积较大。调试的时候可以看到原始代码。

![source-map 生成的chunk](./images/source_map_chunk.png)

![source-map 类型的报错](./images/source_map_error.png)

![source-map 类型源码](./images/source_map_sources_code.png)

### `devtool: 'cheap-source-map'`

生成不包含列信息，只包含行信息的 source map 文件，体积会小一些。调试时只能看到编译后的代码，无法看到原始代码。

![cheap-source-map 生成的chunk](./images/cheap_source_map_chunk.png)

![cheap-source-map 类型的报错](./images/cheap_source_map_error.png)

![cheap-source-map 类型源码](./images/cheap_source_map_sources_code.png)

### `devtool: 'inline-source-map'`

不单独生成 source map 文件，将 source map 作为 DataURI 嵌入到 bundle 中，会大大增加 bundle 的体积，调试时可以看到原始代码。

![inline-source-map 生成的chunk](./images/inline_source_map_chunk.png)

![inline-source-map 类型的报错](./images/inline_source_map_error.png)

![inline-source-map 类型源码](./images/inline_source_map_sources_code.png)

## 提取页面公共资源

### html-webpack-externals-plugin

思路：将 React、react-dom 等基础库通过 cdn 引入，不打入 bundle 中。

所需插件：html-webpack-externals-plugin。用于将外部资源（如 CDN 上的库）引入到项目中，而不需要将这些库打包进最终的输出文件中。

安装插件：

```bash
npm i html-webpack-externals-plugin@3.8.0 -D
```

修改 webpack 配置：

```js
module.exports = {
  plugins: [
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          // 指定要引入的模块名称，和 import ... from "xxx" 中的 xxx 对应
          module: "react",
          // 模块的加载地址
          entry: "https://unpkg.com/react@16/umd/react.development.js",
          // 指定模块在全局作用域中的变量名
          global: "React",
        },
        {
          module: "react-dom",
          entry: "https://unpkg.com/react-dom@16/umd/react-dom.development.js",
          global: "ReactDOM",
        }
      ]
    })
  ]
}
```

生成的 html 中会自动通过 script 标签引入基础包。

![html-webpack-externals-plugin](./images/html_webpack_externals_plugin.png)

### SplitChunksPlugin

SplitChunksPlugin 是 webpack 内置的一个插件，用于分离代码块，无需另外安装。

使用 SplitChunksPlugin 分离基础库和公共业务模块。

修改配置：

```js
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;

    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: path.join(__dirname, `src/${pageName}/index.html`),
      filename: `${pageName}.html`,
      // 指定生成的html要使用哪些chunk
      // 要使用分包的chunk，需要额外指定
      // 顺序一般是基础库、公共业务、页面对应chunk
      chunks: ['vendors', 'commons', pageName],
      inject: true,
    }));
  })

  return {
    entry,
    htmlWebpackPlugins,
  }
}

module.exports = {
  optimization: {
    splitChunks: {
      // 最小体积，包大小大于minSize才会提取出来，单位是Bytes字节
      minSize: 0,
      cacheGroups: {
        // 如果设置了name，打包的chunk会命名为name，否则使用键名作为chunk名称
        vendors: {
          test: /(react|react-dom)/,
          // test: /[\\/]node_modules[\\/](react|react-dom)/,
          // 如果要使用，需要把name对应的属性添加到htmlWebpackPlugin的chunk参数数组里
          name: 'vendors',
          chunks: 'all',
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          // 至少引用2次才提取
          minChunks: 2,
        }
      },
    }
  }
}
```

两段正则的区别：

- `/(react|react-dom)/`：匹配路径中包含 `react` 或 `react-dom` 的模块，匹配规则更加宽松，一般 react 和 react-dom 都在 node_modules 目录下。

- `/[\\/]node_modules[\\/](react|react-dom)/`：匹配 node_modules 目录下的 react 和 react-dom 模块，匹配规则更加严格。一般建议使用匹配更严格的写法，避免匹配到其它路径的模块。

## 代码分割与动态import

对于⼤的 Web 应⽤来讲，将所有的代码都放在⼀个⽂件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被使⽤到。

webpack 有⼀个功能就是将你的代码库分割成 chunks（语块），当代码运⾏到需要它们的时候再进⾏加载。

代码分割的场景：

- 抽离公共代码，比如基础包、公共业务模块等。

- 脚本懒加载，使得初始下载的代码体积更小。

懒加载 JS 脚本的方式：

- CommonJS：require 语句。require 语句本身就支持动态引入模块的。

- ES6：动态 import。目前没有原生支持，需要 babel 转换。

#### 动态 import 的使用

安装插件：

```bash
npm i @babel/plugin-syntax-dynamic-import@7.2.0 -D
```

增加 `.babelrc` 文件配置：

```js
{
  "presets": [
    // es6的babel配置
    "@babel/preset-env",
    // react的babel配置
    "@babel/preset-react",
  ],
  "plugins": [
    // 动态 import 配置
    "@babel/plugin-syntax-dynamic-import"
  ]
}
```

增加 Text 组件：

```jsx
// text.js
import React from 'react';

export default () => <div>动态 import</div>
```

点击动态引入 Text 组件：

```js
class Search extends React.Component {
  state = {
    Text: null,
  }

  loadComponent = () => {
    // 动态加载Text组件
    import('./text.js').then((Text) => {
      this.setState({ Text: Text.default });
    })
  }

  render() {
    const { Text } = this.state;
    return <div className='search-text'>
      Search Text
      { Text ?  <Text /> : null }
      <img src={logo} onClick={this.loadComponent} />
    </div>
  }
}
```

运行效果：点击图片后会使用 jsonp 方式请求 JS 文件。

![动态import请求](./images/dynamic_import_request.png)

![动态import的script语句](./images/dynamic_import_script.png)

## Tree-shaking 的使用和原理分析

### 概念

什么是 Tree-shaking 摇树优化？

Tree-shaking 是指对没有使用的代码进行删除，减小打包体积。

在 Webpack 打包时，1个模块可能会有多个方法，只要其中某个方法被使用到了，整个文件都会被打到 bundle 里面去。这些没用的冗余方法实际上没必要打包进去。Tree-shaking 就是只把使用到的方法打入 bundle，没有使用的方法会在 uglify 阶段被删除掉。

webpack 默认支持 Tree-shaking，在生产模式下自动开启 Tree-shaking。把 mode 设置为 none，就会关闭 tree-shaking。

要求：必须使用 ES6 语法，CJS 的方式不支持。

### 原理

DCE（Dead Code Elimination，死代码消除）：

- 代码不会执行，不可到达。

```js
if (false) {
  console.log('不会执行');
}
```

- 代码执行的结果不会被用到。例如函数的执行返回结果，没有赋值给一个变量。

- 代码只会影响死变量。例如有一段代码修改了某个变量，但是这个变量没有被用到。

Tree-shaking 通过 DCE 分析哪些代码是没用的，然后删除。

Tree-shaking 原理利用了 ES6 模块的特点：

- `import` 语句只能在模块的顶层出现。

- `import` 的模块名称只能是字符串常量。不能动态设置 import 的内容。

- `import` 一个模块之后，不能对它进行修改。

CJS 可以根据不同的条件去 require 不同的模块，因此不能进行 Tree-shaking。

Tree-shaking 其实是对代码进行静态分析，在编译的过程中，哪些模块的代码会使用到，是需要确定下来的。不能在运行时才去分析哪些代码使用到。接着对没有使用到的代码在 uglify 阶段进行擦除。

### 注意点

Tree-shaking 对代码有要求：里面的函数不能有副作用，否则 Tree-shaking 会失效。

:::warning 什么是副作用？
副作用这个概念来源于函数式编程(FP)，纯函数是没有副作用的，也不依赖外界环境或者改变外界环境。纯函数的概念是：接受相同的输入，任何情况下输出都是一样的。

非纯函数存在副作用，副作用就是：相同的输入，输出不一定相同。或者这个函数会影响到外部变量、外部环境。

函数如果调用了全局对象或者改变函数外部变量，则说明这个函数有副作用。
:::

```js
export function pureFunction(a, b) {
    return a + b;
}

export function impureFunction(data) {
    console.log('Logging data:', data);
    return data.length;
}
```

- pureFunction: 这是一个纯函数，因为它只根据输入参数计算结果，并且没有其他副作用。这种函数适合 Tree-shaking。

- impureFunction: 这是一个有副作用的函数，因为它调用了 console.log，这会导致外部状态的变化，并且返回的结果也可能不相同。这种函数不适合 Tree-shaking。

#### 为什么有副作用的函数会影响 Tree-shaking？

Tree-shaking 是一种优化技术，它通过静态分析代码来移除未使用的代码。如果一个函数有副作用，编译器无法确定这个函数是否会被执行，因此会保留这个函数以确保程序的正确性。

例如，如果我们只导入并使用 pureFunction，但不使用 impureFunction，Tree-shaking 会尝试移除 impureFunction 以减少最终打包的文件大小。但由于 impureFunction 有副作用，编译器会保留它，以防止潜在的副作用影响程序的行为。

为了使 Tree-shaking 更有效，尽量编写无副作用的纯函数。如果有副作用的函数，确保它们被显式地调用，而不是依赖于静态分析来决定是否保留。

[谈谈tree-shaking](https://juejin.cn/post/6956522989810614308){link=static}

## Scope Hoisting

Webpack 的 Scope Hoisting 是一种优化技术，旨在减少打包后的代码体积并提高执行效率。具体来说，它有以下几个特点：

- 作用域提升：将多个模块的代码合并成一个大的函数，从而减少函数调用的开销。
- 减少模块包装：通常每个模块会被包裹在一个函数中，Scope Hoisting 可以去掉这些多余的函数包装，直接将模块代码串联起来。
- 依赖分析：Webpack 会分析模块之间的依赖关系，确保合并后的代码仍然能够正确执行。

注意事项：

- 兼容性：某些动态导入（如 import()）可能不支持 Scope Hoisting。
- 副作用：确保模块没有副作用，否则可能会导致意外的行为。可以通过 sideEffects 字段在 package.json 中声明模块是否有副作用。

举个例子，假设有三个模块：

```js
// a.js
export function add(a, b) {
  return a + b;
}

// b.js
import { add } from './a';

export function multiply(a, b) {
  return add(a, b) * 2;
}

// c.js
import { multiply } from './b';

console.log(multiply(1, 2));
```

没有启用 Scope Hoisting 时，webpack 会给每个模块生成一个独立的函数包装，如下所示：

```js
// 生成的打包文件
(function(modules) {
  function require(id) {
    const module = { exports: {} };
    modules[id](module, module.exports, require);
    return module.exports;
  }

  require(0);
})({
  0: function(module, exports, require) {
    const { multiply } = require(1);
    console.log(multiply(1, 2));
  },
  1: function(module, exports, require) {
    const { add } = require(2);
    function multiply(a, b) {
      return add(a, b) * 2;
    }
    module.exports = { multiply };
  },
  2: function(module, exports, require) {
    function add(a, b) {
      return a + b;
    }
    module.exports = { add };
  }
});
```

当我们启用 Scope Hoisting 时，Webpack 会尝试将这些模块的代码合并成一个大的函数，减少函数调用的开销。生成的结果可能如下：

```js
(function() {
  function add(a, b) {
    return a + b;
  }

  function multiply(a, b) {
    return add(a, b) * 2;
  }

  console.log(multiply(1, 2));
})();
```

传统打包：

- 每个模块都有一个独立的函数包装。
- 模块之间通过 require 函数进行依赖管理。
- 代码体积较大，执行时有额外的函数调用开销。

Scope Hoisting：

- 模块代码被合并成一个大的函数。
- 模块之间的依赖关系通过直接调用实现。
- 代码体积更小，执行效率更高。

## Webpack 中使用 ESlint

案例重现：

某⼯程师⼩明在做充值业务时，修改了苹果⽀付配置，将 JSON 配置增加了重复的 key 。代码发布后，有⼩部分使⽤了 vivo ⼿机的⽤户反馈充值⻚⾯⽩屏，⽆法在 app 内进⾏充值。最后问题定位是：vivo ⼿机使⽤了系统⾃带的 webview ⽽没有使⽤ X5 内核，解析 JSON 时遇到重复 key 报错，导致⻚⾯⽩屏。

这种语法错误其实可以通过 ESlint 捕获。

行业优秀的额 ESlint 规范：

Airbnb: [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb)、 [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base)。

eslint-config-airbnb 包含了 React 的 ESlint 规范，如果不需要 React，可以使用 eslint-config-airbnb-base。

ESlint 的两种落地方式：

- 和 CI/CD 集成：在构建部署之前进行 ESlint 检查。

- webpack 与 ESlint 集成：webpack 打包之前进行 ESlint 检查，有语法错误则报错，停止打包。

所需插件：eslint、eslint-loader、eslint-plugin-import、eslint-plugin-jsx-a11y、eslint-plugin-react。

规则集：eslint-config-airbnb。

安装依赖：

```bash
npm i eslint@5.16.0、eslint-loader@2.1.2、eslint-plugin-import@2.17.3、eslint-plugin-jsx-a11y@6.2.1、eslint-plugin-react@7.13.0 -D

npm i eslint-config-airbnb@17.1.0 -D
```

增加 `.eslintrc.js` 配置文件：

```js
module.exports = {
  // 指定ESlint解析器
  parser: 'babel-eslint',
  // 继承的规则
  extends: 'airbnb',
  // 指定想要启用的环境。开启后ESlint会自动识别这些环境提供的全局变量，如node的require
  env: {
    browser: true,
    node: true,
  },
  // 更多规则：https://eslint.nodejs.cn/docs/latest/rules/
  rules: {
    "indent": ['error', 2],
    "import/no-extraneous-dependencies": 'off',
    // jsx、js文件都可以包含JSX语法
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "global-require": "warn",
    "array-callback-return": "off",
    "eol-last": "warn",
  }
}
```

修改 webpack 配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
    ]
  }
}
```

即可看到文件一堆报错了。

## webpack 打包库和组件

### 开发与发布

使用 webpack 打包 js 库，并发布到 npm 上。

实现一个大整数加法库的打包，要求：

- 需要打包压缩版和非压缩版

- 支持 AMD/CJS/ESM 模块和 script 引入

库目录结构：

```shell
.
├── dist
│   ├── large-number.js
│   └── large-number.min.js
├── src
│   └── index.js # 库源代码
├── index.js # 入口文件
├── webpack.config.js
└── package.json
```

实现库函数：

```js
// src/index.js
export default function add(a, b) {}
```

安装依赖：

```bash
npm i webpack@4.31.0 webpack-cli@3.3.2 terser-webpack-plugin@1.3.0 -D
```

修改 webpack 配置：

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'large-number': './src/index.js',
    'large-number.min': './src/index.js',
  },
  output: {
    filename: '[name].js',
    // 指定暴露出去的库的名称，也支持以全局变量的方式引用它
    library: 'largeNumber',
    // 支持 AMD/CJS/ESM 模块和 script 引入
    libraryTarget: 'umd',
    // 方便使用，如果不加使用组件的时候需要 largeNumber.default 来用
    libraryExport: 'default',
  },
  mode: 'none',
  // 只针对 .min.js 结尾的文件进行压缩
  optimization: {
    minimize: true,
    minimizer: [
      // uglifyJsPlugin不能压缩ES6语法，会报错，推荐使用TerserPlugin
      new TerserPlugin({
        include: /\.min\.js$/,
      }),
    ],
  },
};
```

[output.libraryTarget](https://webpack.docschina.org/configuration/output/#outputlibrarytarget)

设置入口文件：

```js
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/large-number.min.js');
} else {
  module.exports = require('./dist/large-number.js');
}
```

package.json 文件增加 scripts 命令，每次执行 `npm publish` 发布之前都会执行 `prepublish` 钩子进行打包。

```json
{
  "scripts": {
    "prepublish": "webpack"
  }
}
```

将库发布到 npm 上，首先执行 `npm login` 命令，输入用户名、密码、邮箱登录 npm，接着将 npm 源设置为默认的值 `npm config set registry https://registry.npmjs.org/`，最后执行 `npm publish` 命令发布。

:::danger 发布问题
执行 `npm publish` 发布时，出现错误：403 Forbidden - PUT https://registry.npmjs.org/large-number - You do not have permission to publish "large-number". Are you logged in as the correct user?

查了资料，可能是因为以下的原因导致：

- 包名已被占用：你尝试发布的包名已经被其他用户注册。

- 登录用户错误：你当前登录的 npm 用户没有权限发布该包。

在这里是第一种情况造成的，包名称被占用。将 package.json 的 name 属性修改一下，再重新发布就成功了。
:::

### 使用发布的库

```js
// ESM 方式
import largeNumber from 'large-number-kimmy';
const addRes = largeNumber('999', '123');

// CJS 方式
const largeNumber = require('large-number-kimmy');
const addRes = largeNumber('999', '123');
```

script 引入，试了下，只能够直接引入打包出来的文件，不能直接引入入口文件，否则浏览器报错：process is not defined。

这种方式 window 对象挂载了 largeNumber 方法。

```html
<!-- 如果直接引入入口文件，浏览器报process is not defined的错误 -->
<!-- <script src="https://unpkg.com/large-number-kimmy"></script> -->
<script src="https://unpkg.com/large-number-kimmy@1.0.0/dist/large-number.min.js"></script>
<script>
  console.log(largeNumber);
  console.log(window.largeNumber);
  console.log(largeNumber('999', '100'));
</script>
```

npm 的包都会自动生成一个对应的 unpkg.com 链接，它是一个全球性的 CDN，可以让开发者直接通过 script 标签引入。https://unpkg.com/large-number-kimmy@1.0.0/dist/large-number.min.js。

在请求 https://unpkg.com/large-number-kimmy 的时候，遇到了 302临时重定向 的响应，记录一下：

![302_found_1](./images/302_found_1.png)

![302_found_2](./images/302_found_2.png)

![302_found_3](./images/302_found_3.png)

## webpack实现SSR打包

### SSR 概述

服务端渲染SSR（Server Side Rendering），是指在服务器上完成页面的渲染工作，将渲染后的 HTML 结果发送给客户端浏览器。与之相对的是 CSR（Client-Side Rendering），即客户端渲染，所有的渲染逻辑都在浏览器端执行。

SSR 的优势：

- 首屏加载速度更快：对于依赖大量数据展示的应用，SSR 可以提前在服务器端获取数据并生成完整的 HTML，减少首次内容绘制时间（FCP），提升用户体验。

- SEO 友好：搜索引擎爬虫可以直接抓取到完整的 HTML 内容，无需等待 JavaScript 执行完毕，有利于提高搜索引擎排名。

- 更好的用户体验：用户打开网页时可以立即看到内容，而不是先看到空白页再加载内容，提升了用户的满意度。

- 降低客户端压力：部分计算任务可以在服务器端完成，减轻了浏览器端的压力，特别是对于性能较弱的移动设备来说更为明显。

但需要注意的事，SSR 会增加服务器的负担，因此是否采用 SSR 需要根据实际情况决定。不过服务器的性能只要砸钱够多就不是问题。

服务端：所有模板等资源都存储在服务端；内网机器拉取数据更快；一个 HTML 返回所有数据。

SSR 中浏览器和服务器交互流程：

![SSR 中浏览器和服务器交互流程](./images/SSR_interaction.png)

SSR 和 CSR 的区别：

![SSR 和 CSR 的区别](./images/SSR_CSR.png)

SSR 的核心是减少请求数量。

### webpack实现基本SSR

安装 express：

```bash
npm i express@4.17.1 -D
```

新增 scripts 命令：

```json
{
  "scripts": {
    "build:ssr": "webpack --config webpack.ssr.js"
  },
}
```

新增 webpack.ssr.js 配置文件，注意点见代码注释：

```js
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  // SSR匹配的入口文件多一个server后缀
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];

    // SSR匹配的入口文件多一个server后缀
    const match = entryFile.match(/src\/(.*)\/index-server\.js/);
    const pageName = match && match[1];

    if (pageName) {
      entry[pageName] = entryFile;
      htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['vendors', 'commons', pageName],
        inject: true,
      }));
    }
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    // 输出文件名修改
    filename: '[name]-server.js',
    // libraryTarget设置为umd
    libraryTarget: 'umd',
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    ...htmlWebpackPlugins,
  ],
  // 不能设置提取基础库，否则服务端无法引入React，导致展示不出来
  // optimization: {
  //   splitChunks: {
  //     minSize: 0,
  //     cacheGroups: {
  //       vendors: {
  //         test: /(react|react-dom)/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // },
};
```

search 文件夹下新增 index-server.js 文件，编写组件。

两个注意点：

- 引入模块需要使用 CJS，如 `const React = require('react');`。

- 最后要以组件形式导出，打包出针对服务端的组件：`module.exports = <Search />`。

```js
const React = require('react');
const logo = require('./images/avatar.png');

// eslint-disable-next-line no-unused-vars
class Search extends React.Component {
  state = {
    Text: null,
  }

  loadComponent = () => {
    // 动态加载Text组件
    import('./text.js').then((Text) => {
      this.setState({ Text: Text.default });
    });
  }

  render() {
    const { Text } = this.state;
    return (
      <div className="search-text">
        Search Text Love you
        <br />
        加法结果：
        <div className="second-text">This is second title</div>
        { Text ? <Text /> : null }
        <img src={logo} onClick={this.loadComponent} alt="" />
      </div>
    );
  }
}

module.exports = <Search />;
```

根目录新建 server 文件夹，新建 index.js 文件，编写服务端代码。

服务端的注意点：

- 使用 react-dom/server 的 renderToString 方法将 React 组件渲染成字符串。

- 将组件拼成完整的HTML字符串模板。

- 一些浏览器特有的对象，如 window，需要进行 hack 处理。

```js
if (typeof window === 'undefined') {
  global.window = {};
}

const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server.js');

// eslint-disable-next-line arrow-parens, arrow-body-style
const renderMarkup = str => {
  // 将组件拼成完整的HTML字符串模板
  return (`
    <!DOCTYPE html>
    <html>
      <head>
        <title>react ssr</title>
      </head>
      <body>
        <div id="root">${str}</div>
      </body>
    </html>
  `);
};

const server = (port) => {
  const app = express();
  app.use(express.static('dist'));

  app.get('/search', (req, res) => {
    const html = renderMarkup(renderToString(SSR));
    res.status(200).send(html);
  });

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
};

server(process.env.PORT || 3000);
```

最后运行 `node xxx/index.js` 命令启动服务，访问 http://127.0.0.1:3000/search 即可。

:::danger ssr 打包的问题
浏览器的全局变量 (Node.js 中没有 document, window)

- 组件适配：将不兼容的组件根据打包环境进⾏适配

- 请求适配：将 fetch 或者 ajax 发送请求的写法改成 isomorphic-fetch 或者 axios

样式问题 (Node.js ⽆法解析 css)

- ⽅案⼀：服务端打包通过 ignore-loader 忽略掉 CSS 的解析

- ⽅案⼆：将 style-loader 替换成 isomorphic-style-loader
:::

### SSR 让样式生效

在上面实现基本 SSR 之中，最终打开的页面是没有 css 样式的，因为没有引入样式，组件外面包裹的 html 内容是自己手写上去的。

要想引入样式，要使用客户端打包出来的 html 文件，在其中设置占位符，动态插入组件。

HTML 模板中设置占位符，要将组件插入到这里。

```html
<!-- src/search/index.html -->
 <!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
</head>
<body>
  <!-- 以注释的形式设置占位符，也不影响正常展示 -->
  <div id="root"><!--HTML_PLACEHOLDER--></div>
</body>
</html>
```

webpack 打包生成的 html 文件长这样，会在 `<head>` 中插入了样式，也留下了占位符。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
<style>.search-text{font-size:.26666667rem;color:red;display:-webkit-box;display:-ms-flexbox;display:flex}</style></head>
<body>
  <!-- 以注释的形式设置占位符，也不影响正常展示 -->
  <div id="root"><!--HTML_PLACEHOLDER--></div>
<script type="text/javascript" src="search-server.js"></script></body>
</html>
```

在服务端中，读取这个文件，将占位符替换成组件，再返回给客户端。

```js
if (typeof window === 'undefined') {
  global.window = {};
}

const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server.js');

// 默认读取的是二进制的buffer数据，所以要加上 utf-8
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8');

const renderMarkup = str => {
  // 将占位符替换成组件
  return template.replace('<!--HTML_PLACEHOLDER-->', str);
};

const server = (port) => {
  const app = express();
  app.use(express.static('dist'));

  app.get('/search', (req, res) => {
    const html = renderMarkup(renderToString(SSR));
    res.status(200).send(html);
  });

  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
};

server(process.env.PORT || 3000);
```

![SSR样式生效](./images/webpack_ssr_css.png)

### 首屏数据处理

思路和让样式生效类似，服务端获取数据，替换占位符。

mock 数据：

```json
{
	"error": [],
	"extra": [],
	"data": {
		"list": [
			[{
				"sub_count": 5556,
				"column_type": 1,
				"id": 192,
				"column_price_market": 9900,
				"column_bgcolor": "#F6F7FB",
				"column_title": "SQL必知必会",
				"column_cover_small": "https:\/\/static001.geekbang.org\/resource\/image\/1c\/38\/1c5a5b154b543af952312eef33217438.jpg",
				"column_cover": "https:\/\/static001.geekbang.org\/resource\/image\/c7\/0d\/c7ee0aabbcb6d2da09a1b4a56c1a730d.jpg",
				"had_sub": false,
				"price_type": 2,
				"column_unit": "45讲",
				"is_experience": false,
				"column_ctime": 1559640855,
				"update_frequency": "每周一 \/ 三 \/ 五更新",
				"is_onboard": true,
				"author_intro": "清华大学计算机博士",
				"column_sku": 100029501,
				"column_cover_wxlite": "https:\/\/static001.geekbang.org\/resource\/image\/cd\/f0\/cd26b744d388dbd4387dcfaa66dd8bf0.jpg",
				"column_price": 6800,
				"column_price_sale": 6800,
				"author_name": "陈旸",
				"column_subtitle": "从入门到数据实战"
			}]
		],
		"nav": [{
			"id": 1,
			"name": "专栏",
			"color": "#5ba6ff",
			"icon": "https:\/\/static001.geekbang.org\/resource\/image\/dd\/9e\/dd8cbc79f017d1b01f643c7ea929d79e.png"
		}, {
			"id": 3,
			"name": "视频课程",
			"color": "#79c109",
			"icon": "https:\/\/static001.geekbang.org\/resource\/image\/4a\/c3\/4aebe8fb752fa21a0fd989a45d9847c3.png"
		}, {
			"id": 2,
			"name": "微课",
			"color": "#5ba6ff",
			"icon": "https:\/\/static001.geekbang.org\/resource\/image\/9c\/f1\/9c223ccae33c5245a3009857582f1df1.png"
		}]
	},
	"code": 0
}
```

HTML 模板中设置占位符，`<!--INITIAL_DATA_PLACEHOLDER-->` 用来替换首屏数据。

```html
<!-- src/search/index.html -->
 <!DOCTYPE html>
<html lang="en">
<head>
  <title>Document</title>
</head>
<body>
  <!-- 以注释的形式设置占位符，也不影响正常展示 -->
  <div id="root"><!--HTML_PLACEHOLDER--></div>
  <!--INITIAL_DATA_PLACEHOLDER-->
</body>
</html>
```

服务端获取数据，并将数据设置到 window 对象之下。

```js
const data = require('./data.json');

const renderMarkup = str => {
  const dataStr = JSON.stringify(data);
  // 将数据占位符替换成一个script语句，将数据挂载到window对象下，这样即可全局访问首屏数据
  return template.replace('<!--HTML_PLACEHOLDER-->', str)
    .replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>window.__initial_data=${dataStr}</script>`);
};
```

## 优化构建时命令行的显示日志

现状：构建的时候展示了一大堆日志信息，很多并不需要开发者关注。

`stats` 参数可以控制日志的显示。

|参数值|描述|
|---|---|
|"errors-only"|只在发生错误时输出|
|"minimal"|只在发生错误或有新的编译时输出|
|"none"|没有输出|
|"normal"|标准输出|
|"verbose"|全部输出|

对于生产的 webpack 配置：

```js
// webpack.prod.js
module.exports = {
  stats: 'errors-only',
}
```

对于开发的 webpack 配置：

```js
// webpack.dev.js
module.exports = {
  devServer: {
    stats: 'minimal',
  }
}
```

`stats` 参数配置的位置不相同。

使用 webpack 内置的 `stats` 参数，命令行的输出还是不够直观优美，可以使用 friendly-errors-webpack-plugin 插件优化日志提示。

安装插件：

```bash
npm i friendly-errors-webpack-plugin@1.7.0 -D
```

修改配置：

```js
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
  ]
}
```

![friendly-errors-webpack-plugin](./images/friendly_error_plugin.png)

:::warning 注意事项
friendly-errors-webpack-plugin 插件只是增加一句有颜色标识的提示，例如成功绿色、失败红色。还是需要搭配 `stats` 参数使用的，`stats` 参数负责精简日志输出。
:::

## 构建异常和中断处理

在 CI/CD 的 pipline 或者发布系统需要知道当前构建状态。

每次构建完成后输⼊ `echo $?` 可以获取错误码。

webpack4 之前的版本构建失败不会抛出错误码 (error code)，从 webpack4 开始构建失败默认抛出 `0` 的错误码。

Node.js 中的 `process.exit()` 规范：

- 0 表示成功完成，回调函数中，err 为 null。

- ⾮ 0 表示执⾏失败，回调函数中，err 不为 null，err.code 就是传给 exit 的数字。

我们如何主动捕获并处理构建错误？

通过增加一个自定义 plugin 来捕获处理构建错误。compiler 在每次构建结束后会触发 done 这个 hook，process.exit 主动处理构建报错。

webpack4 的写法：

```js
module.exports = {
  plugins: [
    function () {
      // this 就是 compiler 对象
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          // 在这里可以做一些自定义的错误上报工作，如错误日志、错误量
          console.log('build error');
          // 自定义错误码为1
          process.exit(1);
        }
      })
    }
  ]
}
```

webpack3 的写法：

```js
module.exports = {
  plugins: [
    function () {
      this.plugin('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          console.log('build error');
          process.exit(1);
        }
      })
    }
  ]
}
```