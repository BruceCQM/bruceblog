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

## 开发一个React组件，怎么做？

构建工具选择：webpack。

### 组件项目结构

首先需要开发 React 组件。组件的项目结构示例如下：

```bash
my-react-component/
├── dist/                    # 构建输出目录
├── src/                     # 源代码
│   ├── components/          # React 组件
│   │   └── MyComponent.jsx  # 示例组件
│   ├── styles/              # 样式文件
│   └── index.js             # 组件入口文件
├── .babelrc                 # Babel 配置
├── webpack.config.js        # Webpack 配置
└── package.json
```

组件入口文件内容示例：

```js
import MyComponent from './components/MyComponent';

// 导出组件
export default MyComponent;

// 可选：导出其他工具函数或子组件
export { default as Button } from './components/Button';
export { default as Input } from './components/Input';
```

### 构建打包

webpack 配置文件示例：

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'my-component': './src/index.js',
    'my-component.min': './src/index.js',
  },
  output: {
    filename: '[name].js',
    // 指定暴露出去的库的名称，也支持以全局变量的方式引用它
    library: 'MyComponent',
    // 支持 AMD/CJS/ESM 模块和 script 引入
    libraryTarget: 'umd',
    // 方便使用，如果不加使用组件的时候需要 MyComponent.default 来用
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

webpack 构建打包完成，发布到 npm 上。

## React fiber是什么？

[React Fiber 简介 —— React 背后的算法](https://juejin.cn/post/7006612306809323533){link=static}

[万字长文介绍React Fiber架构的原理和工作模式](https://segmentfault.com/a/1190000044468085){link=static}

### 概述

React Fiber 是 React 的核心协调算法（Reconciliation Algorithm）的重新实现，是 React 内部用于管理组件更新、渲染和调度的全新架构。

React 16.0（2017年9月发布）是首个基于 Fiber 架构的版本。

- 旧版（Stack Reconciler）： 像一个人一口气读完一本厚厚的书（同步渲染），中途不能被打断，如果电话响了（用户点击），必须读完当前章节才能接听（卡顿）。
- Fiber 架构： 把书分成小段落阅读，每读一段就检查是否有更急的事（如电话），可以随时暂停/继续（可中断渲染），优先处理紧急任务。

### 旧版：同步递归渲染机制

在 React 16（Fiber 架构）之前，React 使用的是同步递归渲染机制（Stack Reconciler），这一架构在复杂应用中暴露了明显的性能瓶颈和用户体验问题。

#### 1. 同步渲染阻塞主线程

旧版 React 通过递归来遍历虚拟 DOM 树，一次性完成整个组件的渲染，即同步更新。

如果组件树很深、计算量很大，JS 就会长时间占用主线程，从而导致页面卡顿（浏览器无法及时处理用户交互，如点击滚动）、丢帧（动画不流畅）。

#### 2. 递归遍历的不可中断性

旧版 React 需要一次性完成整个组件的渲染。如果中途出现更高优先级的任务（比如用户点击），无法中断当前渲染，导致响应延迟。

#### 3. 缺乏任务优先级调度

旧版 React 将所有的更新任务看作一样重要，它无法区分不同优先级的任务。

例如，用户输入和后台数据加载同时触发时，无法优先响应用户输入。

### Fiber 特性

#### 1. 拆分渲染任务

Fiber 将整个渲染拆分成多个增量式可中断任务，利用浏览器空闲时间分片执行（浏览器的 requestIdleCallback，空闲时间执行），从而避免 JS 长时间占用主线程。

#### 2. 可中断性

Fiber 采用链表结构的节点，来记录遍历的上下文（比如当前处理的组件，下一个待处理的节点）。它可以暂停、恢复渲染任务，从而能够及时响应更高优先级的任务。

#### 3. 可根据优先级调度任务

Fiber 引入了优先级标记（如 Immediate、UserBlocking、Normal），它会根据优先级调度任务。

| 场景 | 旧版（Stack Reconciler） | Fiber 架构 |
|------|----------------------|-----------|
| 渲染方式 | 同步递归，不可中断 | 异步分片，可中断/恢复 |
| 主线程占用 | 长时间阻塞 | 空闲时间分片执行 |
| 优先级调度 | 无 | 支持高优先级任务插队 |
| 复杂应用响应 | 易卡顿 | 动画/交互更流畅 |

## 移动端适配方案

[移动端适配的5种方案](https://juejin.cn/post/6953091677838344199){link=static}

### rem 布局

rem 是 CSS3 新增的相对单位，以 HTML 元素的 font-size 为基准值。

优点：rem 布局能很好的实现在不同尺寸的屏幕横向填满屏幕，且在不同屏幕元素大小比例一致

缺点：在大屏设备（Pad）上，元素尺寸会很大，页面显示更少的内容。

针对大屏改进方案：

- 限制 rem 的最大值，
- 通过媒体查询，限制内容最大宽度，如：腾讯网、荔枝FM

在移动端浏览器 rem 方案是解决移动端适配的主流方案，这套方案的另一个名字叫做 flexible 方案，通过动态设置 rem 实现在不同尺寸的设备上界面展示效果一致。

### vm/vh 布局

vm/vh 将页面分为 100 份，1vm = 1/100 屏幕高度，1vh = 1/100 屏幕宽度。

优点：vw、vh布局能良好的实现在不同尺寸的屏幕横向填满屏幕，使用 postcss-px-to-viewport 能很好的帮我们进行单位转换

缺点：

- 无法修改 vw/vh 的值，在大屏设备（Pad）中元素会放大，且无法通过 js 干预
- 兼容性- 大多数浏览器都支持、ie11不支持 少数低版本手机系统 ios8、android4.4以下不支持

### 百分比布局

在 css 中，我们可以使用百分比来实现布局，但是需要特定宽度时，这个百分比的计算对开发者来说并不友好。

且元素百分比参考的对象为父元素，元素嵌套较深时会有问题。

注意：

- 子元素的 width 和 height 百分比参考对象是父元素的 width 和 height。
- margin、padding 的参考对象为父元素的 width。
- border-radius、background-size、transform: translate()、transform-origin 的参考对象为自身宽高。

### 媒体查询

通过媒体查询，可以针对不同的屏幕进行单独设置，但是针对所有的屏幕尺寸做适配显然是不合理的，但是可以用来处理极端情况（例如 IPad 大屏设备）或做简单的适配（隐藏元素或改变元素位置）

```css
body {
  background-color: yellow;
}
/* 针对大屏产品 ipad pro */
@media screen and (min-width: 1024px) {
  body {
    background-color: blue;
  }
}
```