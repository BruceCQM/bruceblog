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

模块联邦（Module Federation）允许不同的独立应用（或微前端）在运行时直接共享代码模块，而无需重复打包或通过 npm 安装依赖。这一设计彻底改变了前端架构的模块化共享方式，尤其适合微前端、多团队协作等场景。

它是为了解决独立应用之间代码共享问题，可以在项目内动态加载其他项目的代码，共享依赖。

- Remote（远程模块）：暴露自身模块供其他应用使用（如 app1 暴露一个 Button 组件）。
- Host（宿主应用）：消费其他应用暴露的模块（如 app2 使用 app1 的 Button）。
- Bi-Directional（双向）：一个应用可同时作为 Host 和 Remote（互相共享模块）。

Remote 暴露模块：
```js
// webpack.config.js (app1)
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1', // 唯一标识
      filename: 'remoteEntry.js', // 入口文件（供其他应用加载）
      exposes: {
        './Button': './src/Button.js', // 暴露模块路径:导出别名
        './utils': './src/utils.js',
      },
      shared: ['react', 'react-dom'], // 共享的库（避免重复加载）
    }),
  ],
}
```

Host 消费模块：
```js
// webpack.config.js (app2)
new ModuleFederationPlugin({
  name: 'app2',
  remotes: {
    app1: 'app1@http://localhost:3001/remoteEntry.js', // 格式: `name@远程入口URL`
  },
  shared: ['react', 'react-dom'], // 声明共享依赖
});
```

Host 中使用 Remote 模块：

```js
// app2 的代码中动态导入 app1 的 Button
import React from 'react';
const RemoteButton = React.lazy(() => import('app1/Button'));

function App() {
  return (
    <div>
      <React.Suspense fallback="Loading Button...">
        <RemoteButton />
      </React.Suspense>
    </div>
  );
}
```

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

Webpack4: 使用递增数字 ID，导致文件哈希随顺序变化而改变。

Webpack5: 改用哈希算法生成稳定 ID，避免因模块增减影响缓存。

### 移除Nodejs的polyfill

Webpack4: 自动注入 Node.js 核心模块（如 crypto）的 polyfill。

Webpack5: 不再自动注入，需显式配置。

```js
module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
    },
  },
};
```

### 更小的运行时代码

Webpack5: 生成的运行时代码体积减少约 20%。

## 像Antd组件库，是如何实现组件的按需加载的

像Antd Mobile、Antd这些组件库，组件的按需加载是怎么实现的？给出一个主要思路。

按需加载：只引入项目中实际使用到的组件，而不是将整个组件库全部打包进去，从而减少最终打包体积。

### 主要思路

- 组件库需要提供 ES Module 格式的模块化代码，每个组件单独导出。
- 使用工具（如 babel-plugin-import）在编译时转换导入语句，将库的整体导入转换为对具体组件文件的导入，并同时引入组件对应的样式文件。或者通过手动引入指定的组件及其样式文件。
- 这样，最终打包时只会包含实际导入的组件代码和样式，达到了按需加载的目的。

### 组件库架构设计

```bash
antd/
  ├── es/
  │   ├── button/
  │   │   ├── index.js      # 组件入口
  │   │    └── style/
  │   │       ├── index.css # 组件样式
  │   │       └── css.js    # 样式导入文件
  ├── lib/                  # CommonJS版本
  └── index.js              # 完整入口
```

### 组件引入1-手动引入

手动引入需要使用到的组件以及其对应的样式文件即可，在 webpack 构件时组件库中其他未被引入的文件不会被打包。

```js
import Button from 'antd/es/button';
import 'antd/es/button/style/css';
```

### 组件引入2-自动加载

使用 babel-plugin-import 插件，可以自动将组件的引入转换为按需加载的写法，避免手动书写的繁琐。

```js
// 源代码
import { Button, Input } from 'antd';

// 转换后
import Button from 'antd/es/button';
import 'antd/es/button/style/css'; // 自动添加样式
import Input from 'antd/es/input';
import 'antd/es/input/style/css';
```

修改配置：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        plugins: [
          ['import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: 'css' // 自动加载CSS
          }]
        ]
      }
    }]
  }
};
```