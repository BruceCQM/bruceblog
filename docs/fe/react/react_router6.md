# React Router 6 <img src="./images/react-router.png" style="width:30px;" />

[官方文档](https://reactrouter.com/)

## 概述

React Router 发布了三个不同的包：

- `react-router`：路由核心库，提供许多组件、钩子
- `react-router-dom`：包括了 `react-router` 所有内容，同时添加了用于 DOM 的组件，如 `<BrowserRouter>`
- `react-router-native`：包括了 `react-router` 所有内容，同时添加了用于 ReactNative 的 API，如 `<NativeRouter>`

与 React Router 5.x 版本的区别：

- 内置组件的变化：移除 `<Switch/>`，新增 `<Routes/>`……
- 语法变化：`component={About}` 变成 `element={<About/>}`……
- 新增 hook：`useParams`、`useNavigate`、`useMatch`……
- 官方明确表示推荐使用函数式组件

## 基本使用

安装 6 版本的 React Router。

```shell
npm install react-router-dom
```

`index.js` 文件引入 `<BrowserRouter>`。

```jsx
// 从 react-dom/client 引入 ReactDOM
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// React 18 的语法发生改变了
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

`App.js` 设置路由链接和注册路由。`<Route caseSensitive>` 属性用于指定匹配时是否区分大小写（默认为 false）。

```jsx
import { NavLink, Routes, Route } from 'react-router-dom'
import About from './components/About/About'
import Hello from './components/Hello/Hello'

// React 18 默认使用函数式组件了
export default function App() {
  return (
    <div>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/hello">Hello</NavLink>
      <hr />
      <Routes>
        <Route path="/about" element={<About />}></Route>
        <Route path="/hello" element={<Hello />}></Route>
      </Routes>
    </div>
  )
}
```

## `<BrowserRouter>`

`<BrowserRouter> ` 用于包裹整个应用。

```jsx
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

## `<HashRouter>`

作用与 `<BrowserRouter>` 一样，但 `<HashRouter>` 修改的是地址栏的 hash 值。

6.x 版本中 `<HashRouter>`、`<BrowserRouter>` 的用法与 5.x 相同。

## `<Routes/>`

6 版本中移出了 `<Switch>`，引入了新的替代者：`<Routes>`。

`<Routes>` 和 `<Route>` 要配合使用，且必须要用 `<Routes>` 包裹 `<Route>`。

## `<Navigate>` 重定向

只要 `<Navigate>` 组件被渲染，就会修改路径，切换视图。可用于路由重定向。

`replace` 属性用于控制跳转模式（push 或 replace，默认是 push）。

```jsx
import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import About from './components/About/About'
import Hello from './components/Hello/Hello'

export default function App() {
  return (
    <div>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/hello">Hello</NavLink>
      <hr />
      <Routes>
        <Route path="/about" element={<About />}></Route>
        <Route path="/hello" element={<Hello />}></Route>
        <Route path="/" element={<Navigate to="/about" />}></Route>
      </Routes>
    </div>
  )
}
```

```jsx
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

export default function Home() {
  const [sum, setSum] = useState(1)
  return (
    <div>
      <h1>Home</h1>
      {/* 根据sum的值决定是否切换视图 */}
      {sum === 1 ? <h4>sum的值为{sum}</h4> : <Navigate to="/about" replace={true} />}
      <button onClick={() => setSum(2)}>将sum变为 2</button>
    </div>
  )
}
```

## `useRoutes()` 路由表

路由规则可以单独抽出一个模块。

```jsx
// 路由表
// routes/index.js
import { Navigate } from 'react-router-dom'
import About from '../components/About/About'
import Hello from '../components/Hello/Hello'

const routes = [
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/hello',
    element: <Hello />,
  },
  {
    path: '/',
    element: <Navigate to="/about" />,
  },
]

export default routes
```

```jsx
// 引入路由表
// App.js
import { NavLink, useRoutes } from 'react-router-dom'
import routes from './routes'

export default function App() {
  // 生成路由规则
  const element = useRoutes(routes)

  return (
    <div>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/hello">Hello</NavLink>
      <hr />
      {element}
    </div>
  )
}
```

## `<Outlet>` 嵌套路由

- 嵌套路由中，需要使用 `<Outlet>` 设置子路由的路由出口，即在何处渲染子路由。
- 设置二级路由链接时，可以是 `to="news"`、`to="./news"`，但不能是 `to="/news"`。

不使用路由表的嵌套路由：

```jsx
// App.js
export default function App() {
  return (
    <div>
      <NavLink to="about">About</NavLink>
      <NavLink to="hello">Hello</NavLink>
      <hr />
      <Routes>
        <Route path="about" element={<About />} />
        <Route path="hello" element={<Hello />}>
          <Route path="news" element={<News />} />
          <Route path="message" element={<Message />} />
        </Route>
        <Route path="/" element={<Navigate to="about" />} />
      </Routes>
    </div>
  )
}
```

使用路由表的嵌套路由：

```jsx
// 路由表
const routes = [
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/hello',
    element: <Hello />,
    // 定义二级路由，注意不要加 /
    children: [
      {
        path: 'news',
        element: <News />,
      },
      {
        path: 'message',
        element: <Message />,
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/about" />,
  },
]
```

```jsx
// Hello 子组件
import React, { Fragment } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function Hello() {
  return (
    <Fragment>
      <h2>I am Hello!</h2>
      {/* 子路由链接 */}
      <NavLink to="news">News</NavLink>
      <NavLink to="message">Message</NavLink>
      <hr />
      {/* 子路由出口 */}
      <Outlet></Outlet>
    </Fragment>
  )
}
```

## `<NavLink>` 路由高亮

实现导航的 “高亮” 效果，6 版本不能直接指定高亮类名，需要通过函数返回。该函数传入一个对象，类似于 `{isActive: true}` 标识路由是否被激活。

默认情况下，当 `Home` 的子组件匹配成功，`Home` 的导航也会高亮，`end` 属性可移除该效果。

```jsx
// NavLink 默认类名是 active，下面是指定自定义类名

//自定义样式
<NavLink
    to="login"
    className={({ isActive }) => {
        console.log('home', isActive)
        return isActive ? 'base MyClass' : 'base'
    }}
>about</NavLink>

// 默认情况下，当 Home 的子组件匹配成功，Home 的导航也会高亮
// 当 NavLink 上添加了 end 属性后，若 Home 的子组件匹配成功，则 Home 的导航没有高亮效果。
<NavLink to="home" end >home</NavLink>
```

## 路由传参

> 以不使用路由表为例

### 传递 `params`参数

注册路由时声明 `params` 参数，和 React Router 5 一样。

```jsx
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="hello" element={<Hello />}>
          <Route path="message" element={<Message />}>
            <Route path="detail/:id/:name/:age" element={<Detail />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}
```

传递参数。

```jsx
<Link to={`detail/${item.id}/${item.name}/${item.age}`}>{item.name}</Link>
```

使用 `useParams()` 接收 `params` 参数。`useParams()` 返回一个参数对象。

```jsx
import React from 'react'
import { useParams, useMatch } from 'react-router-dom'

export default function Detail() {
  // 解构赋值
  const { id, name, age } = useParams()
  return (
    <div>
      <li>id:{id}</li>
      <li>name:{name}</li>
      <li>age:{age}</li>
    </div>
  )
}
```

### 传递 `search` 参数

和 5 版本一样，正常注册路由即可。

```jsx
<Route path="detail" element={<Detail />} />
```

传递参数。

```jsx
<Link to={`detail?id=${item.id}&name=${item.name}&age=${item.age}`}>{item.name}</Link>
```

使用 `useSearchParams()` 接收参数。该方法返回一个包含两个元素的数组：`search` 参数和修改 `search` 参数的方法。

```jsx
import React from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Detail() {
  // 数组的解构赋值
  const [searchParams, setSearchParams] = useSearchParams()
  // 需要调用 get() 方法获取对应的参数值
  const id = searchParams.get('id')
  const name = searchParams.get('name')
  const age = searchParams.get('age')

  function change() {
    setSearchParams('id=666&name=Lily&age=888')
  }

  return (
    <div>
      <li>id:{id}</li>
      <li>name:{name}</li>
      <li>age:{age}</li>
      <button onClick={change}>Change search params</button>
    </div>
  )
}
```

### 传递 `state` 参数

和 5 版本一样，正常注册路由即可。

```jsx
<Route path="detail" element={<Detail />} />
```

传递参数，这里相较于 5 版本有所不同，不必写到一个对象里面。

```jsx
<Link to="detail" state={{ id: item.id, name: item.name, age: item.age }}>
  {item.name}
</Link>
```

使用 `useLocation()` 接收参数。该方法返回路由组件的 `location` 对象，就是 5 版本路由组件的 `location` 属性，其中包含 `state` 参数。

```jsx
import { useLocation } from 'react-router-dom'

export default function Detail() {
  // 连续解构赋值
  const {
    state: { id, name, age },
  } = useLocation()

  return (
    <div>
      <li>id:{id}</li>
      <li>name:{name}</li>
      <li>age:{age}</li>
    </div>
  )
}
```

## `useNavigate()` 编程式路由导航

`useNavigate()` 返回一个函数，调用该函数实现编程式路由导航。函数有两种参数传递方式。

第一种方式传递两个参数：路由和相关参数。参数只能设置 `replace` 和 `state`。想要传递 `params` 和 `search` 参数直接在路由带上。

第二种方式传递数字，代表前进或后退几步。

```jsx
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

export default function Message() {
  const [list] = useState([
    { id: 1, name: 'Bruce', age: 33 },
    { id: 2, name: 'You', age: 3 },
    { id: 3, name: 'React', age: 333 },
  ])

  const navigate = useNavigate()

  function showDetail(item) {
    navigate('detail', {
      replace: true,
      state: {
        id: item.id,
        name: item.name,
        age: item.age,
      },
    })
  }

  function back() {
    navigate(1)
  }

  function forward() {
    navigate(-1)
  }

  return (
    <div>
      <ul>
        {list.map((item) => {
          return (
            <li key={item.id}>
              <button onClick={() => showDetail(item)}>查看详情</button>
              <button onClick={back}>后退</button>
              <button onClick={forward}>前进</button>
            </li>
          )
        })}
      </ul>
      <Outlet></Outlet>
    </div>
  )
}
```

## Other Hooks

### `useMatch()`

返回路由组件的 `match` 数据，即 5 版本中的 `match` 属性。

必须传入该组件对应的路由规则才能正确返回，否则返回 `null`。

```jsx
// Detail.jsx
import { useParams, useMatch } from 'react-router-dom'

export default function Detail() {
  const match = useMatch('hello/message/detail/:id/:name/:age')
  console.log(match)
  return (
    <div>
      <li>id</li>
    </div>
  )
}

/*
params: {id: '1', name: 'Bruce', age: '33'}
pathname: "/hello/message/detail/1/Bruce/33"
pathnameBase: "/hello/message/detail/1/Bruce/33"
pattern: {path: 'hello/message/detail/:id/:name/:age', caseSensitive: false, end: true}
*/
```

### `useInRouterContext()`

如果组件在 `<Router>` 的上下文中呈现，则 `useInRouterContext` 钩子返回 `true`，否则返回 `false`。即组件有没有被包裹在 `<BrowserRouter>` 这种东西里面。这个对第三方组件库有用处。

### `useNavigationType()`

返回当前的导航类型（用户是如何来到当前页面的）。

返回值：`POP`、`PUSH`、`REPLACE`。

`POP` 是指在浏览器中直接打开了这个路由组件（刷新页面）。

### `useOutlet()`

用来呈现当前组件中渲染的嵌套路由。

```jsx
const result = useOutlet()
console.log(result)
// 如果嵌套路由没有挂载,则返回 null
// 如果嵌套路由已经挂载,则展示嵌套的路由对象
```

### `useResolvedPath()`

给定一个 URL 值，解析其中的：`path`、`search`、`hash` 值。

```jsx
const res = useResolvedPath('/user?id=001&name=Bruce#React')
console.log(res)

/*
hash: '#React'
pathname: '/user'
search: '?id=001&name=Bruce'
*/
```
