# React 路由

## 路由的理解

何为路由？

- 一个路由是一个映射关系
- `key` 为路径，`value` 可能是 `function` 或 组件

后端路由：

- `value` 是 `function` ，用于处理客户端的请求
- 注册路由：`router.get(path, function(req, res))`
- 工作过程：Node 接收到请求，根据路径匹配路由，调用对应函数处理请求，返回响应数据

前端路由：

- `value` 是组件
- 注册路由：`<Route path="/test" component={Test}>`
- 工作过程：浏览器路径变为 `/test` ，展示 `Test` 组件

## 路由基本使用

安装 `react-router-dom` ：

```bash
// 安装 5.X 版本路由
npm install react-router-dom@5.2.0 -S

// 最新已经 6.X 版本，用法和 5.X 有所不同
npm install react-router-dom -S
```

`6.x` 版本的用法参考[文章](https://zhuanlan.zhihu.com/p/191419879)

以 `5.x` 版本为例展示基本使用：

导航区使用 `<Link>`，展示区使用 `<Route>`。

```js
// App.jsx
import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'

export default class App extends Component {
  render() {
    return (
      <div>
        <div className="list-group">
          <Link className="list-group-item" to="/about">
            About
          </Link>
          <Link className="list-group-item" to="/home">
            Home
          </Link>
        </div>
        <div className="panel-body">
          <Route path="/about" component={About} />
          <Route path="/home" component={Home} />
        </div>
      </div>
    )
  }
}
```

`<App>` 的最外侧包裹 `<BrowserRouter>` 或 `<HashRouter>` ：

```js
// index.js
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
```

## 路由组件和一般组件

1. 写法不同：

- 一般组件：`<Demo/>`
- 路由组件：`<Route path="/demo" component={Demo}/>`

2. 存放位置不同：

- 一般组件：`components`
- 路由组件：`pages`

3. 接收到的 `props` 不同：

- 一般组件：标签属性传递
- 路由组件：接收到三个固定的属性

```js
history:
  go: ƒ go(n)
  goBack: ƒ goBack()
  goForward: ƒ goForward()
  push: ƒ push(path, state)
  replace: ƒ replace(path, state)

location:
  pathname: "/home/message/detail/2/hello"
  search: ""
  state: undefined

match:
  params: {}
  path: "/home/message/detail/:id/:title"
  url: "/home/message/detail/2/hello"
```

## NavLink 的使用

`NavLink` 可以实现路由链接的高亮，通过 `activeClassName` 指定样式名，默认追加类名为 `active` 。

```html
<NavLink activeClassName="demo" to="/about">About</NavLink>

<NavLink activeClassName="demo" to="/home">Home</NavLink>
```

封装 `NavLink` 组件：由于 `NavLink` 组件中重复的代码太多，因此进行二次封装。

※ 细节点：组件标签的内容会传递到 `this.props.children` 属性中，反过来通过指定标签的 `children` 属性可以修改组件标签内容

```js
// MyNavLink 组件
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export default class MyNavLink extends Component {
  render() {
    // this.props.children 可以取到标签内容，如 About, Home
    // 反过来通过指定标签的 children 属性可以修改标签内容
    return <NavLink activeClassName="demo" className="list-group-item" {...this.props} />
  }
}
```

```html
<MyNavLink to="/about">About</MyNavLink>

<MyNavLink to="/home">Home</MyNavLink>
```

## Switch 的使用

`Switch` 可以提高路由匹配效率，如果匹配成功，则不再继续匹配后面的路由，即单一匹配。

```html
<!-- 只会展示 Home 组件 -->
<Switch>
  <Route path="/about" component="{About}" />
  <Route path="/home" component="{Home}" />
  <Route path="/home" component="{Test}" />
</Switch>
```

## 解决多级路径刷新页面样式丢失的问题

- `public/index.html` 中 引入样式时不写 `./` 写 `/` （常用）
- `public/index.html` 中 引入样式时不写 `./` 写 `%PUBLIC_URL%` （常用）
- 使用 `HashRouter`

```html
<link rel="stylesheet" href="/css/bootstrap.css" />

<link rel="stylesheet" href="%PUBLIC_URL%/css/bootstrap.css" />
```

## 路由的严格匹配与模糊匹配

- 默认使用模糊匹配（输入的路径必须包含要匹配的路径，且顺序一致）
- 开启严格匹配：`<Route exact path="/about" component={About}/>`
- 严格匹配需要再开，开启可能会导致无法继续匹配二级路由

## Redirect 的使用

- 一般写在所有路由注册的最下方，当所有路由都无法匹配时，跳转到 Redirect 指定的路由

```html
<Switch>
  <Route path="/about" component="{About}" />
  <Route path="/home" component="{Home}" />
  <Redirect to="/about" />
</Switch>
```

## 嵌套路由

- 注册子路由需写上父路由的 `path`
- 路由的匹配是按照注册路由的顺序进行的

```html
<!-- 父组件 -->
<MyNavLink to="/about">About</MyNavLink>
<MyNavLink to="/home">Home</MyNavLink>

<Switch>
  <Route path="/about" component="{About}" />
  <Route path="/home" component="{Home}" />
  <Redirect to="/about" />
</Switch>
```

```html
<!-- 子组件 -->
<ul className="nav nav-tabs">
  <li>
    <MyNavLink to="/home/news">News</MyNavLink>
  </li>
  <li>
    <MyNavLink to="/home/message">Message</MyNavLink>
  </li>
</ul>

<Switch>
  <Route path="/home/news" component="{News}" />
  <Route path="/home/message" component="{Message}" />
  <Redirect to="/home/news" />
</Switch>
```

## 路由传参

三种方式：`params, search, state` 参数

三种方式对比：

- `state` 方式当前页面刷新可保留参数，但在新页面打开不能保留。前两种方式由于参数保存在 URL 地址上，因此都能保留参数。
- `params` 和 `search` 参数都会变成字符串

```html
<!-- 路由链接 -->
<Link to='/home/message/detail/Bruce/21'>params</Link>
<Link to={`/home/message/detail/${item.name}/${item.age}`}>{item.name}</Link>

<Link to='/home/message/detail/?name=Bruce&age=21'>search</Link>
<Link to={`/home/message/detail/?id=${item.name}&title=${item.age}`}>{item.name}</Link>

<Link to={{pathname: '/home/message/detail', state: {name: 'Bruce', age: 21}}}>state</Link>

<!-- 注册路由 -->
<Route path='/home/message/detail/:name/:age' component={Detail} />
<!-- search 和 state 按正常注册即可 -->
<Route path='/home/message/detail' component={Detail} />
```

```js
//接收参数
const { name, age } = this.props.match.params

import qs from 'querystring'
const { search } = this.props.location
const { name, age } = qs.parse(search.slice(1))

const { name, age } = this.props.location.state
```

## 编程式导航

编程式导航是使用路由组件 `this.props.history` 提供的 API 进行路由跳转：

```js
this.props.history.push(path, state)
this.props.history.replace(path, state)
this.props.history.goForward()
this.props.history.goBack()
this.props.history.go(n)
```

```js
// 编程式导航传参
this.props.history.push(`/home/message/detail/${id}/${title}`)
this.props.history.push(`/home/message/detail?id=${id}&title=${title}`)
this.props.history.push(`/home/message/detail`, { id: id, title: title })
```

## withRouter 的使用

`withRouter` 的作用：加工一般组件，让其拥有路由组件的 API ，如 `this.props.history.push` 等。

```js
import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

class Header extends Component {
  ...
}

export default withRouter(Header)
```

## BrowserRouter 和 HashRouter

底层原理不一样：

- `BrowserRouter` 使用的是 H5 的 history API，不兼容 IE9 及以下版本。
- `HashRouter` 使用的是 URL 的哈希值。

路径表现形式不一样

- `BrowserRouter` 的路径中没有 `#` ，如：`localhost:3000/demo/test`
- `HashRouter` 的路径包含#，如：`localhost:3000/#/demo/test`

刷新后对路由 `state` 参数的影响

- `BrowserRouter` 没有影响，因为 `state` 保存在 `history` 对象中。
- `HashRouter` 刷新后会导致路由 `state` 参数的丢失！

备注：`HashRouter` 可以用于解决一些路径错误相关的[问题](#解决多级路径刷新页面样式丢失的问题)。
