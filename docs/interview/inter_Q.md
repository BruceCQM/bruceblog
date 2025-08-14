# 麵筋一块一串

## webpack5和4的区别

[大厂面试--webpack新特性详解](https://blog.csdn.net/qq_34738754/article/details/136856591){link=static}

[webpack5新特性](https://juejin.cn/post/6983985071699001357){link=static}

[Webpack](https://juejin.cn/post/7506338106435338255){link=static}

### 持久化缓存

[Cache](https://webpack.docschina.org/configuration/cache/){link=static}

Webpack4 每次构建都需要处理全部模块，要使用缓存需要手动配置 hard-source-webpack-plugin、cache-loader 等内容。

Webpack5 内部内置了 cache 缓存机制，开发模式下默认启用内存缓存，生产模式需手动配置持久化策略。 缓存分为内存缓存和磁盘持久化缓存，默认方式为内存缓存，磁盘持久化缓存需要手动配置。

```js
// Webpack 4 通过插件实现缓存机制
const HardSourcePlugin = require('hard-source-webpack-plugin');
module.exports = {
  plugins: [
    new HardSourcePlugin()  // 默认缓存路径：node_modules/.cache/hard-source
  ]
};

// Webpack 5 默认的内存缓存
module.exports = {
  cache: { type: 'memory' }  
};

// Webpack 5 手动配置的持久化磁盘缓存
module.exports = {
  cache: {
    type: 'filesystem',
    // 自定义缓存路径，cache.cacheDirectory 选项仅当 cache.type 被设置成 filesystem 才可用
    cacheDirectory: 'node_modules/.cache/webpack', // 默认路径
    buildDependencies: { config: [__filename] }    // 配置更改时缓存失效
  }
};
```

### 更好的tree-shaking

Webpack5 支持**嵌套的 tree-shaking**，能够更深度地识别和删除未被使用的 嵌套导出属性（如对象属性、类方法等）。

相比 Webpack4 仅能标记顶层未使用的导出，Webpack5 可以深入到模块内部的嵌套结构，实现更精细的 Dead Code Elimination（死代码删除）。

```js
// utils.js
export const tools = {
  used: () => console.log("I'm used"),
  unused: () => console.log("I'm unused"), // 期望被删除，但 Webpack 4 无法做到
};
```

Webpack4 中：即使只导入 tools.used，整个 tools 对象会被保留（包括 unused 方法）。因为 Webpack4 只能标记整个 tools 是否被使用，无法分析其内部属性。

在 Webpack5 中：如果代码仅使用 tools.used，tools.unused 会被安全删除。

最终产出的代码可能直接优化为：

```js
// 编译后（经过压缩）
console.log("I'm used");
```

### 模块联邦

### 资源模块

[资源模块](https://webpack.docschina.org/guides/asset-modules/){link=static}

Webpack4 中，加载图片、字体这些资源需要使用不同的 loader。

在 Webpack5 中，内置了静态资源构建能力，从而让 Webpack 不用使用额外的 loader 就能加载这些资源。

在 webpack 5 之前，通常使用：

- raw-loader 将文件导入为字符串
- url-loader 将文件作为 data URI 内联到 bundle 中
- file-loader 将文件发送到输出目录

资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：

- asset/resource：发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。(即输出为一个文件，并且其路径将被注入到 bundle 中)
- asset/inline：导出一个资源的 data URI。之前通过使用 url-loader 实现。（比如图片使用base64格式内联进包里）
- asset/source：导出资源的源代码。之前通过使用 raw-loader 实现。（返回文件的原始内容）
- asset：在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。

```js
module: {
  rules: [
    {
      test: /\.(png|jpg|jpeg|gif)$/,
      type: 'asset/resource'
    },
    {
      test: /\.svg/,
      type: 'asset/inline'
    },
    {
      test: /\.txt/,
      type: 'asset/source' // 原样将txt文件中的文本内容注入到打包文件中
    }
  ]
}
```

### modulesId/chunksId的优化

### 移除Nodejs的polyfill