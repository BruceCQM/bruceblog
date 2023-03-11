# React 扩展内容

## setState 更新状态的两种写法

对象式：`setState(stateChange, [callback])`

- `stateChange` 为状态改变对象(该对象可以体现出状态的更改)
- `callback` 是可选的回调函数, 它在状态更新完毕、界面也更新后才被调用

函数式：`setState(updater, [callback])`

- updater 为返回 stateChange 对象的函数。
- updater 可以接收到 state 和 props。

说明：

- React 状态更新是异步的。下述代码打印的 `count` 值是上一次的值，而非更新后的。可在第二个参数回调中获取更新后的状态。

```js
add = () => {
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count)
}

add = () => {
  this.setState({ count: this.state.count + 1 }, () => {
    console.log(this.state.count)
  })
}
```

- `callback` 回调在 `componentDidMount` 钩子之后执行
- 对象式写法可以看做函数式写法的语法糖

```js
add = () => {
  this.setState((state, props) => {
    return { count: state.count + props.step }
  })
}
```

## 路由组件懒加载 lazyLoad

```js
import React, { Component, lazy, Suspense } from 'react'
import Loading from './Loading'

// 通过 lazy 函数配合 import() 函数动态加载路由组件
// 路由组件代码会被分开打包
const Home = lazy(() => import('./Home'))
const About = lazy(() => import('./About'))

export default Demo extends Component {
  render() {
    return (
      <div>
        <h1>Demo 组件</h1>
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>

        // 通过 <Suspense> 指定在加载得到路由打包文件前显示一个自定义 Loading 界面
        <Suspense fallback={Loading}>
          <Switch>
            <Route path="/home" component={Home}>
            <Route path="/about" component={About}>
          </Switch>
        </Suspense>
      </div>
    )
  }
}
```

## React Hook

> Hook 是 React 16.8.0 增加的新特性，让我们能在函数式组件中使用 `state` 和其他特性

### State Hook

- `State Hook` 让函数式组件也可拥有 `state` 状态。
- 语法：`const [Xxx, setXxx] = React.useState(initValue)`
- `useState()` 参数：状态初始化值；返回值：包含 2 个元素的数组，分别为状态值和状态更新函数
- `setXxx()` 的 2 种用法：
  - `setXxx(newValue)`
  - `setXxx(value => newValue)`
  - 注意！新状态值会**覆盖**原状态值！因此若有多个状态，只能多次调用 `React.useState` ，不能使用对象！

```js
const [count, setCount] = React.useState(0)
const [name, setName] = React.useState('Tom')

function add() {
  setCount(count + 1)
  setCount((count) => count + 1)
}
```

### Effect Hook

- `Effect Hook` 让我们能在函数式组件中执行副作用操作（就是模拟生命周期钩子）
- 副作用操作：发送 Ajax 请求、定时器、手动更改真实 DOM
- `Effect Hook` 可以模拟三个钩子：`componentDidMount`、`componentDidUpdate`、`componentWillUnmount`
- `React.useEffect` 第一个参数 `return` 的函数相当于 `componentWillUnmount` ，若有多个会按顺序执行

```js
// 语法
React.useEffect(() => {
  ...
  return () => {
    // 组件卸载前执行，即 componentWillUnmount 钩子
    ...
  }
}, [stateValue])

// 模拟 componentDidMount
// 第二个参数数组为空，表示不监听任何状态的更新
// 因此只有页面首次渲染会执行输出
React.useEffect(() => {
  console.log('DidMount')
  return () => {
    console.log('WillUnmount 1')
  }
}, [])

// 模拟全部状态 componentDidUpdate
// 若第二个参数不写，表示监听所有状态的更新
React.useEffect(() => {
  console.log('All DidUpdate')
  return () => {
    console.log('WillUnmount 2')
  }
})

// 模拟部分状态 componentDidUpdate
// 第二个参数数组写上状态，表示只监听这些状态的更新
React.useEffect(() => {
  console.log('Part DidUpdate')
  return () => {
    console.log('WillUnmount 3')
  }
}, [count, name])

// 若调用 ReactDOM.unmountComponentAtNode(document.getElementById('root'))
// 会输出 WillUnmount 1、2、3
```

### Ref Hook

- `Ref Hook` 可以在函数式组件存储或查找组件内的标签或其他数据
- 语法：`const refContainer = React.useRef()`
- 保存标签对象的容器，和 `React.createRef()` 类似，也是专人专用

```js
function Demo() {
  const myRef = React.useRef()

  function show() {
    console.log(myRef.current.value)
  }

  return (
    <div>
      <input type="text" ref={myRef} />
      <button onClick={show}>展示数据</button>
    </div>
  )
}
```

## Fragment

- `Fragment` 标签本身不会被渲染成一个真实 DOM 标签，有点像 Vue 的 `template`。
- 用空标签也有相同效果，但是空标签不能传递任何属性，`Fragment` 标签可以传递 `key` 属性，遍历时候可用。

```js
import React, { Component, Fragment } from 'react'

export default class Demo extends Component {
  render() {
    return (
      <Fragment key={1}>
        <input type="text" />
        <input type="text" />
      </Fragment>
    )

    // 或
    return (
      <>
        <input type="text" />
        <input type="text" />
      </>
    )
  }
}
```

## Context

Context 是一种组件间通信方式，常用于祖父组件与子孙组件。实际开发一般不用，一般用 React-Redux

用法说明：

```js
1) 创建Context容器对象：
const XxxContext = React.createContext()

2) 渲染子组时，外面包裹xxxContext.Provider, 通过value属性给后代组件传递数据：
<XxxContext.Provider value={数据}>
  子组件
</XxxContext.Provider>

3) 后代组件读取数据：

// 第一种方式：仅适用于类组件
// 声明接收context
static contextType = xxxContext
// 读取context中的value数据
this.context

//第二种方式: 可用于函数组件与类组件
<XxxContext.Consumer>
  {
    // value就是context中的value数据
    value => (
      ...
    )
  }
</XxxContext.Consumer>

```

举个栗子：

```js
// context.js

import React from 'react'
export const MyContext = React.createContext()
export const { Provider, Consumer } = MyContext
```

```js
// A.jsx

import React, { Component } from 'react'
import B from './B.jsx'
import { Provider } from './context.js'

export default class A extends Component {
  state = { username: 'tom', age: 18 }

  render() {
    const { username, age } = this.state
    return (
      <div>
        <h3>A组件</h3>
        <h4>用户名是:{username}</h4>
        <Provider value={{ username, age }}>
          <B />
        </Provider>
      </div>
    )
  }
}
```

```js
// B.jsx

import React, { Component } from 'react'
import C from './C.jsx'

export default class B extends Component {
  render() {
    return (
      <div>
        <h3>B组件</h3>
        <C />
      </div>
    )
  }
}
```

```js
// C.jsx

import React, { Component } from 'react'
import { MyContext } from './context.js'

export default class C extends Component {
  static contextType = MyContext
  render() {
    const { username, age } = this.context
    return (
      <div>
        <h3>C组件</h3>
        <h4>
          从A组件接收到的用户名:{username},年龄:{age}
        </h4>
      </div>
    )
  }
}
```

```js
// C.jsx 为函数式组件

import { Consumer } from './context.js'
export default function C() {
  return (
    <div>
      <h3>我是C组件</h3>
      <h4>
        从A组件接收到的用户名:
        <Consumer>{(value) => `${value.username},年龄是${value.age}`}</Consumer>
      </h4>
    </div>
  )
}
```

## 组件渲染优化

问题：

- 只要调用 `setState()` ，即使没有修改状态，组件也会重新 `render()`
- 只要父组件重新渲染，即使子组件没有使用父组件的状态，也会重新 `render()`

原因：

- `shouldComponentUpdate()` 钩子默认总是返回 `true`

改进：

- 只有组件的 `state` 或 `props` 的数据发生改变时才重新渲染

方式：

1. 手动重写 `shouldComponentUpdate(nextProps, nextState)` 的逻辑，只有数据发生改变才返回 `true`
2. 使用 `PureComponent` ，它重写了 `shouldComponentUpdate()` ， 只有 `state` 或 `props` 数据有变化才返回 `true`

:::tip

- 它只是进行 `state` 和 `props` 数据的浅比较, 如果只是数据对象内部数据变了, 返回 `false`。即对于引用数据类型，比较的是地址引用
- 不要直接修改 `state` 数据, 而是要产生新数据
  :::

```js
import React, { PureComponent } from 'react'

class Demo extends PureComponent {
  ...
  addStu = () => {
    // 不会渲染
    const { stus } = this.state
    stus.unshift('小刘')
    this.setState({ stus })

    // 重新渲染
    const { stus } = this.state
    this.setState({ stus: ['小刘', ...stus] })
  }
  ...
}
```

## render props (插槽)

> 类似于 Vue 中的插槽技术

如何向组件内部动态传入带内容的结构（即标签或组件）？

- Vue：插槽技术
- React：
  - 使用 `children props`：通过组件标签体传入结构
  - 使用 `render props`：通过组件标签属性传入结构，可携带数据

`children props` 方式：

- 组件标签体内容会存储到 `this.props.children` 中
- 缺点：A 组件无法向 B 组件传递数据

```js
import React, { Component } from 'react'

export default class Parent extends Component {
  render() {
    return (
      <div>
        <h3>Parent组件</h3>
        <A>
          <B />
        </A>
      </div>
    )
  }
}

class A extends Component {
  state = { name: 'tom' }
  render() {
    return (
      <div>
        <h3>A组件</h3>
        {this.props.children}
      </div>
    )
  }
}

class B extends Component {
  render() {
    return (
      <div>
        <h3>B组件</h3>
      </div>
    )
  }
}
```

`render props` 方式：

- `<A render={(name) => <B name={name} />} />`
- `{this.props.render(name)}`

```js
import React, { Component } from 'react'

export default class Parent extends Component {
  render() {
    return (
      <div>
        <h3>Parent组件</h3>
        <A render={(name) => <B name={name} />} />
      </div>
    )
  }
}

class A extends Component {
  state = { name: 'tom' }
  render() {
    const { name } = this.state
    return (
      <div>
        <h3>A组件</h3>
        {this.props.render(name)}
      </div>
    )
  }
}

class B extends Component {
  render() {
    return (
      <div>
        <h3>B组件,{this.props.name}</h3>
      </div>
    )
  }
}
```

## 错误边界

:::tip
错误边界(Error boundary)：用来捕获后代组件错误，渲染出备用页面。

注意：只在生产环境（项目上线）起效
:::

特点：

- 只能捕获**后代组件生命周期**产生的错误，不能捕获自己组件产生的错误和其他组件在合成事件、定时器中产生的错误
- 简单理解就是只能捕获后代组件生命周期钩子里面代码的错误

```js
import React, { Component } from 'react'
import Child from './Child'

export default class Parent extends Component {
  state = {
    //用于标识子组件是否产生错误
    hasError: '',
  }

  // 当子组件出现错误，会触发调用，并携带错误信息
  static getDerivedStateFromError(error) {
    // render 之前触发
    // 返回新的 state
    return { hasError: error }
  }

  // 子组件产生错误时调用该钩子
  componentDidCatch(error, info) {
    console.log(error, info)
    console.log('此处统计错误，反馈给服务器')
  }

  render() {
    return (
      <div>
        <h2>Parent组件</h2>
        {this.state.hasError ? <h2>网络不稳定，稍后再试</h2> : <Child />}
      </div>
    )
  }
}
```

## 组件通信方式总结

- `props`
- 消息订阅发布：`pubs-sub`
- 集中管理：Redux、dva 等
- [conText](#context)

推荐搭配：

- 父子组件：`props`
- 兄弟组件：消息订阅-发布、集中式管理
- 祖孙组件(跨级组件)：消息订阅-发布、集中式管理、`conText`(开发用的少，封装插件用的多即 React-Redux)
