# Webpack 极速入门

## Webpack 初体验

### 初始化项目

```bash
npm init -y
```

项目结构如下。

```shell
.
├── node_modules
├── src
│ │── index.js
│ │── data.js
├── index.html
├── package.json
├── package-lock.json
```

### 安装 webpack

`-D` 是 `--save-dev` 的缩写，表示开发时依赖，只在项目开发阶段用到。
`-S` 是 `--save` 的缩写，表示运行时依赖，即项目打包发布运行时要用到。

Webpack 只在项目开发阶段用到，因此使用 `-D` 参数。

```bash
npm install webpack webpack-cli -D
```

### 书写代码

```js
// index.js
import { getList } from './data'

console.log(getList())
```

```js
// data.js
export function getList() {
  return ['111', '222', '333']
}
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>hello webpack</h1>
    <script src="./dist/main.js"></script>
  </body>
</html>
```

### 运行打包命令

```bash
npx webpack
```

打包完成后，就会生成 dist 文件夹，入口文件默认是 main.js。

打包生成的内容如下。

```bash
# main.js
(() => {'use strict';console.log(['111', '222', '333'])})();
```

运行 index.html 文件即可看到页面效果以及控制台打印的文字。

## Webpack 基本配置

Webpack 相关配置写在 `webpack.config.js` 文件中。

```js
const path = require('path')

module.exports = {
  mode: 'development', // 打包模式，取值有development、production
  entry: './src/index.js', // 指定打包的入口文件
  output: {
    filename: 'dist.js', // 指定打包后的文件名
    path: path.resolve(__dirname, 'dist'), // 指定打包文件生成的目录
  },
}
```

## Webpack 常用 loader

Webpack 默认只能打包 js、JSON 文件，对于其它类型的文件，如 CSS、图片、字体等，Webpack 不支持直接处理，需通过使用 loader 来扩展它的处理能力。

### CSS 文件

要打包处理 CSS 文件，需要安装 `style-loader`、`css-loader` 两个 loader。

Webpack 的 loader 基本都只有开发时才用得到，因此使用 `-D` 参数。

安装 loader。

```bash
npm install style-loader css-loader -D
```

配置 loader。

```js
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // 匹配 css 文件
        test: /\.css$/i,
        // 对于 css 文件，使用 style-loader、css-loader
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

### 图片

对于图片，Webpack 已经有内置的 loader，可以直接使用，无需安装。

```js
module.exports = {
  module: {
    rules: [
      {
        // 匹配图片后缀名
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        // 内置的loader的写法
        type: 'asset/resource',
        // 定义输出文件的名称和路径
        // 表示生成的图片放在dist/images目录下，文件名和扩展名保持原样
        // 如果没有这段配置，则图片放在dist目录下，文件名随机生成
        generator: {
          filename: 'images/[name][ext]',
        },
      },
    ],
  },
}
```

### babel-loader

将 ES6 语法转换为 ES5 语法，以便兼容旧浏览器。

安装 loader。

```bash
npm i babel-loader @babel/core @babel/preset-env -D
```

配置 loader。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // 不处理node_modules下的文件
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // 给loader传递配置
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}
```

## Webpack 插件

### html-webpack-plugin

使用 html-webpack-plugin，可自动生成 HTML 文件，并自动引入打包后的 JS 文件。

安装插件。

```bash
npm install html-webpack-plugin -D
```

配置插件。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // 修改html文件标题
      title: '这是标题',
    }),
  ],
}
```
