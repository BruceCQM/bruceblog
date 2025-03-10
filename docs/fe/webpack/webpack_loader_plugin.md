# 编写loader和插件

## loader 的链式调用和执行顺序

loader 的定义：loader 是一个导出为函数的 JavaScript 模块。

```js
module.exports = function(source) {
  return source;
}
```

多 loader 的执行顺序：多个 loader 是串行执行的，前一个 loader 执行完成的结果传递给后一个 loader，并且顺序从后到前。

为什么 loader 的执行顺序是从后到前的？

函数组合的两种做法：

- Unix 中的 pipline

- Compose（webpack采取的是这种），`compose = (f, g) => (...args) => f(g(...args))`。g() 的执行结果传递给 f()。

## 使用 loader-runner 进行 loader 调试

loader-runner 允许在不安装 webpack 的情况下运行 loaders。

作用：

- 作为 webpack 的依赖，webpack 内部也是使用它来执行 loader。

- 进行 loader 的开发的调试。

loader-runner 的使用：

```js
import { runLoaders } from 'loader-runner';

runLoaders({
  resource: '/abs/path/to/file.txt?query', // String: 资源的绝对路径(可以增加查询字符串)
  loaders: ['/abs/path/to/loader.js?query'], // String[]: loader 的绝对路径(可以增加查询字符串)
  context: { minimize: true }, // 基础上下文之外的额外 loader 上下文
  readResource: fs.readFile.bind(fs), // 读取资源的函数
}, function(err, result) {
  // err: Error?
  // result.result: Buffer | String
};)
```

开发一个 raw-loader。

安装 loader-runner：`npm install loader-runner@3.0.0 -S`。

```js
// src/raw-loader.js
module.exports = function (source) {
  const json = JSON.stringify(source)
    .replace('foo', '')
    .replace(/\u2028/g, '\\u2028') // 为了安全起见，ES6模板字符串的问题
    .replace(/\u2029/g, '\\u2029');

  return `export default ${json}`;
};
```

```js
// src/demo.txt
foobar
```

使用 loader-runner 调试 loader：

```js
// run-loader.js
const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders({
  resource: path.join(__dirname, './src/demo.txt'),
  loaders: [
    path.join(__dirname, './src/raw-loader.js'),
  ],
  context: {
    minimize: true,
  },
  readResource: fs.readFile.bind(fs),
}, (err, result) => {
  err ? console.log(err) : console.log(result);
});
```

运行查看结果：`node run-loader.js`。

![loader-runner运行结果](./images/webpack_loader_plugin/loader-runner.png)