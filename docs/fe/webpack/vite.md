# vite

## vite 原理

**webpack 通过分析 js 中的 require 语句，得出当前 js 文件所有的依赖文件，通过递归的方式层层分析后，得到整个项目的依赖关系图。对图中不同的文件执行不同的 loader，比如使用 css-loader 解析 css 代码，最后基于这个依赖关系图读取到整个项目中的所有文件代码，进行打包处理后交给浏览器执行**。

这样的构建过程，导致在调试代码之前，需要等待 webpack 的依赖收集过程，而当项目代码体量很大的时候，这个依赖收集的过程往往需要等待几十秒甚至几分钟，开发体验很差。

如果有办法做到更少的代码打包就好了！于是 bundless 的打包思路就诞生了，vite 便是这种思路。

## webpack 核心：script 模块化

我们需要打包工具的核心原因，就是浏览器在执行代码的时候，本身没有一个很好的方式去读懂我们项目中各个文件的引用关系。

因此 webpack 把所有文件的引用关系都梳理好，并且将项目中所有文件的代码打包到一起，交给浏览器。浏览器找到入口文件执行即可。

但随着浏览器的进步，它开始能够读懂一些模块化的引入语法了。

```js
// index.js
import { add } from './index2.js';

console.log('add：', add(1, 2));

// index2.js
export const add = (a, b) => {
  return a + b;
};
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script type="module" src="./index.js"></script>
</body>
</html>
```

如今，浏览器是可以正常运行这份代码的。那么浏览器是怎么处理这些文件的引用关系的？

![浏览器运行 import 语句的 js 文件](./images/browser-run-import.png)

浏览器会将 import 语句处理成一个个 http 网络请求，去获取 import 引入的各个模块。

因为浏览器现在可以通过 `type="module"` 的方式读懂项目中文件的模块化引入，因此，bundless 的思想得以发展。