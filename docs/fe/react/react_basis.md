# React 入门

[官网传送门](https://reactjs.org/)

## React 简介

### React 为何物

React：用于构建用户界面的 JavaScript 库。由 `Facebook` 开发且开源。

### 为何学习 React

原生 JavaScript 的痛点：

- 操作 DOM 繁琐、效率低
- 使用 JavaScript 直接操作 DOM，浏览器进行大量重绘重排
- 原生 JavaScript 没有组件化编码方案，代码复用率低

React 的特点：

- 采用组件化模式、声明式编码，提高开发效率和组件复用率
- 在 `React Native` 中可用 React 语法进行移动端开发
- 使用虚拟 DOM 和 Diffing 算法，减少与真实 DOM 的交互

## React 初体验

### 来一发 Hello React

相关 JS 库：

- `react.development.js` ：React 核心库
- `react-dom.development.js` ：提供 DOM 操作的 React 扩展库
- `babel.min.js` ：解析 JSX 语法，转换为 JS 代码

```html
<!-- 准备好一个“容器” -->
<div id="test"></div>

<!-- 引入react核心库 -->
<script type="text/javascript" src="../js/react.development.js"></script>
<!-- 引入react-dom，用于支持react操作DOM -->
<script type="text/javascript" src="../js/react-dom.development.js"></script>
<!-- 引入babel，用于将jsx转为js -->
<script type="text/javascript" src="../js/babel.min.js"></script>

<!-- 此处一定要写babel，表示写的不是 JS，而是 JSX，并且靠 babel 翻译 -->
<script type="text/babel">
  //1.创建虚拟DOM
  // 不要写引号，因为不是字符串
  const VDOM = <h1>Hello,React</h1>

  //2.渲染虚拟DOM到页面
  // 导入核心库和扩展库后，会有 React 和 ReactDOM 两个对象
  ReactDOM.render(VDOM, document.getElementById('test'))
</script>
```

### 创建虚拟 DOM 的两种方式：JS 和 JSX

- 使用 JS 创建虚拟 DOM 比 JSX 繁琐
- JSX 可以让程序员更加简单地创建虚拟 DOM，相当于语法糖
- 最终 babel 会把 JSX 语法转换为 JS

```html
<script type="text/javascript">
  //1.使用 React 提供的 API 创建虚拟DOM
  const VDOM = React.createElement('h1', { id: 'title' }, React.createElement('span', {}, 'Hello,React'))
  //2.渲染虚拟DOM到页面
  ReactDOM.render(VDOM, document.getElementById('test'))
</script>
```

```html
<script type="text/babel">
  //1.创建虚拟DOM
  const VDOM = (
    <h1 id="title">
      <span>Hello,React</span>
    </h1>
  )
  //2.渲染虚拟DOM到页面
  ReactDOM.render(VDOM, document.getElementById('test'))
</script>
```

### 虚拟 DOM && 真实 DOM

关于虚拟 DOM：

1. 本质是 Object 类型的对象（一般对象）
2. 虚拟 DOM 比较“轻”，真实 DOM 比较“重”，因为虚拟 DOM 是 React 内部在用，无需真实 DOM 上那么多的属性。
3. 虚拟 DOM 最终会被 React 转化为真实 DOM，呈现在页面上。

```html
<script type="text/babel">
  const VDOM = (
    <h1 id="title">
      <span>Hello,React</span>
    </h1>
  )
  ReactDOM.render(VDOM, document.getElementById('test'))

  const TDOM = document.getElementById('demo')
  console.log('虚拟DOM', VDOM)
  console.log('真实DOM', TDOM)
</script>
```

## JSX

### JSX 简介

- 全称：JavaScript XML
- React 定义的类似于 XML 的 JS 扩展语法；本质是 `React.createElement()` 方法的语法糖
- 作用：简化创建虚拟 DOM

### JSX 语法规则

- 定义虚拟 DOM 时，不要写引号
- 标签中混入 JS 表达式需要使用 `{}`
- 指定类名不用 `class`，使用 `className`
- 内联样式，使用 `style={ { key: value } }` 的形式
- 只能有一个根标签
- 标签必须闭合，单标签结尾必须添加 `/`：`<input type="text" />`
- 标签首字母小写，则把标签转换为 HTML 对应的标签，若没有，则报错
- 标签首字母大写，则渲染对应组件，若没有定义组件，则报错

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>jsx语法规则</title>
    <style>
      .title {
        background-color: orange;
        width: 200px;
      }
    </style>
  </head>
  <body>
    <div id="test"></div>
    ...
    <script type="text/babel">
      const myId = 'aTgUiGu'
      const myData = 'HeLlo,rEaCt'

      const VDOM = (
        <div>
          <h2 className="title" id={myId.toLowerCase()}>
            <span style={{ color: 'white', fontSize: '19px' }}>{myData.toLowerCase()}</span>
          </h2>
          <input type="text" />
          // <good>very good</good>
          // <Child></Child>
        </div>
      )

      ReactDOM.render(VDOM, document.getElementById('test'))
    </script>
  </body>
</html>
```

### JSX 例子

注意区分：**JS 语句(代码)** 与 **JS 表达式**：

1. 表达式：一个表达式会产生一个值，可以放在任何一个需要值的地方

```js
a
a + b
demo(1)
arr.map()
function test() {}
```

2. 语句(代码)：

```js
if(){}
for(){}
switch(){case:xxxx}
```

```html
<script type="text/babel">
  let list = ['Angular', 'React', 'Vue'] const VDOM = (
  <div>
    <h1>前端js框架列表</h1>
    <ul>
      // React 会自动遍历数组
      {list.map((item, index) => {
        // Each child in a list should have a unique "key" prop.
        return <li key={index}>{item}</li>
      })}
    </ul>
  </div>
  ) ReactDOM.render(VDOM, document.getElementById('test'))
</script>
```
