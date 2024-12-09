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