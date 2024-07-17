# Babel

思考：babel-loader 和 corejs 的区别。

## Babel 基础

看这一篇文章足矣。

[Babel & AST（抽象语法树）](https://juejin.cn/post/7045496002614132766){link=static}

## Babel 和 Polyfill 

### 关系和区别

Babel：Babel 是一个广泛使用的 ES6 转码器，可以将 ES6 代码转换为 ES5 代码。它默认只转换新的 JavaScript 语法（syntax），不转换新的 API。

Polyfill：Polyfill 用于实现浏览器不支持的原生 API。

```js
// Babel 转码前的代码
require('babel-polyfill');
(x => x * 2)(1);
var b = Array.of(1,2,4);

// Babel 转码后的代码
'use strict';

require('babel-polyfill');
(function (x) {
  return x * 2;
})(1)
var b = Array.of(1, 2, 4);
```

可以看到，Babel 只转换了 ES6 的箭头函数语法，但没有转换 `Array.of()`，因为这是 ES6 的 API。

Array 是 ES5 就存在的对象，但是这个对象没有 of 方法，这个方法直到 ES6 才出现。

对于不支持 ES6 的浏览器，我们通过引入 bebel-polyfill 使其支持 ES6 的 API。如上述代码所示。

### 使用

阅读这一篇文章。

[babel polyfill 到底怎么用？](https://juejin.cn/post/6844904063402770439){link=static}