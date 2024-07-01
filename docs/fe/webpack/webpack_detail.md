# webpack 深入学习

## webpack 是什么

webpack 是一个强大的模块打包工具，用于处理和打包 JavaScript 应用程序的依赖关系。它能够把许多分散的模块按照依赖关系打包成一个或多个捆绑包（bundle），这些 bundle 可以直接在浏览器中运行。

:::tip [webpack](https://www.webpackjs.com/concepts/)
本质上，webpack 是一个用于现代 JavaScript 应用程序的静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个依赖图，然后将项目中所需的每个模块组合成一个或多个 bundles。它们都是静态资源，用于展示你的内容。
:::

从而减少页面的请求次数和加载时间，提高网页的性能和用户体验。

它的主要功能如下：

1. 模块化管理。webpack 支持多种模块化方案，包括 CommonJS、AMD、ES6 模块等。可以将多个模块打包成一个或多个文件，使代码更加清晰、易于维护和重用。

2. 自动化构建。webpack 提供了丰富的插件和工具，可以自动化完成**编译、打包、压缩、混淆**等一系列操作，大大提高了前端开发的效率和质量。

3. 资源优化。webpack 可以对不同类型的资源进行优化，如脚本、样式、图片、字体等，可以**自动压缩、合并、缓存**等，从而减少页面的请求次数和加载时间，提高网页的性能和用户体验。

4. 插件机制。webpack 提供了强大的插件机制，可以通过插件扩展，定制自己的构建流程和功能，满足不同项目的需求。

5. 社区支持。webpack 有庞大的社区支持，提供了丰富的文档、教程和示例，可帮助开发者快速入门和解决问题。

## 入口(entry)

### 单入口

用法：`entry: string | [string]`。

```js
// 简写形式
module.exports = {
  entry: './src/index.js',
}

// 完整形式
module.exports = {
  entry: {
    main: './src/index.js',
  },
}
```

可将一个文件路径的数组作为 entry 的属性值，此时创建了 `multi-main entry`。

这样可以一次性注入多个依赖文件，并将他们的依赖关系绘制在一个 chunk 中。

```js
// 简写形式
module.exports = {
  entry: ['./src/index.js', './src/index2.js'],
}

// 完整形式
module.exports = {
  entry: {
    main: ['./src/index.js', './src/index2.js'],
  },
}
```

可以看到，这两个文件被打包在同一个 chunk 中。

![multi-main-entry](./images/multi-main-entry.png)

### 对象语法

#### 基本使用

用法：`entry: { <entryChunkName> string | [string] } | {}`。

对象语法指定**将哪些文件打包在同一个 chunk 中**，生成多个 chunk。

注意，使用多个入口的对象语法，必须对应地使用输出(output)多个出口的写法。

否则报错，`Error: Conflict: Multiple chunks emit assets to the same filename dist.js (chunks index and index2)`。

```js
module.exports = {
  entry: {
    index: './src/index.js',
    index23: ['./src/index2.js', './src/index3.js'],
  },
  output: {
    filename: '[name].js', // 指定打包后的文件名
    path: path.resolve(__dirname, 'dist'),
  },
}
```

打包后，生成了2个chunk。

![entry对象语法](./images/entry-obj.png)

:::danger TIP
“webpack 配置的可扩展” 是指，这些配置可以重复使用，并且可以与其他配置组合使用。这是一种流行的技术，用于将关注点从环境(environment)、构建目标(build target)、运行时(runtime)中分离。然后使用专门的工具（如 webpack-merge）将它们合并起来。

当你通过插件生成入口时，你可以传递空对象 {} 给 entry。
:::

### 描述入口的对象

入口的对象语法有如下的属性。

- `dependOn`：当前入口所依赖的入口。它们必须在该入口加载前被加载。
- `filename`：指定要输出的文件名称。
- `import`：启动时需加载的模块。
- `library`：指定 library 选项，为当前 entry 构建一个 library。
- `runtime`：运行时 chunk 的名字。如果设置了，会创建一个新的运行时 chunk。在 webpack 5.43.0 后可将其设为 false，以避免一个新的运行时 chunk。
- `publicPath`：当该入口的输出文件在浏览器被引用时，为它们指定一个公共 URL 地址。详见 [ouput.publicPath](https://www.webpackjs.com/configuration/output/#outputpublicpath)。

```js
module.exports = {
  entry: {
    index: './src/index.js',
    index2: {
      // dependOn: 'index',
      import: './src/index2.js',
    },
  },
}
```

上述配置，设置了 `dependOn` 前后的区别如下。

![dependOn之前](./images/dependOn-before.png)

![dependOn之后](./images/dependOn-after.png)
