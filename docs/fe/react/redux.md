# Redux

[官网](https://redux.js.org/)

[中文文档](https://www.redux.org.cn/)

## Redux 概述

Redux 为何物

- Redux 是用于做 **状态管理** 的 JS 库
- 可用于 React、Angular、Vue 等项目中，常用于 React
- 集中式管理 React 应用多个组件共享的状态

何时用 Redux

- 某个组件的状态，需要让其他组件拿到（状态共享）
- 一个组件需要改变另一个组件的状态（通信）
- 使用原则：不到万不得已不要轻易动用

Redux 工作流程

![redux 工作流程图](./images/redux.png)

- 组件想操作 Redux 中的状态：把动作类型和数据告诉 `Action Creators`
- `Action Creators` 创建 `action` ：同步 `action` 是一个普通对象，异步 `action` 是一个函数
- `Store` 调用 `dispatch()` 分发 `action` 给 `Reducers` 执行
- `Reducers` 接收 `previousState` 、`action` 两个参数，对状态进行加工后返回新状态
- `Store` 调用 `getState()` 把状态传给组件

## 核心概念

**`action`** ：

- 表示动作的对象，包含 2 个属性
- `type` ：标识属性，值为字符串，唯一，必须属性
- `data` ：数据属性，类型任意，可选属性
- `{type: 'increment', data: 2}`

**`reducer`** ：

- 用于初始化状态、加工状态
- 根据旧状态和 `action` 产生新状态
- 是**纯函数**

:::tip 纯函数
输入同样的实参，必定得到同样的输出

- 不能改写参数数据
- 不产生副作用，如网络请求、输入输出设备（网络请求不稳定）
- 不能调用 `Date.now()` 、`Math.random()` 等不纯方法
  :::

**`store`** ：

- Redux 核心对象，内部维护着 `state` 和 `reducer`
- 核心 API
  - `store.getState()` ：获取状态
  - `store.dispatch(action)` ：分发任务，触发 `reducer` 调用，产生新状态
  - `store.subscribe(func)` ：注册监听函数，当状态改变自动调用

## 一个求和案例

```js
// App.jsx

import React, { Component } from 'react'
import Count from './components/Count'

export default class App extends Component {
  render() {
    return (
      <div>
        <Count />
      </div>
    )
  }
}
```

```js
// index.js

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './redux/store'

ReactDOM.render(<App />, document.getElementById('root'))

// 状态改变重新渲染 App 组件
store.subscribe(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
})
```

```js
// redux/constant.js

// 保存常量值
export const INCREMENT = 'increment'
export const DECREMENT = 'decrement'
```

```js
// redux/count_reducer.js

import { INCREMENT, DECREMENT } from './constant'

//初始化状态
const initState = 0
export default function countReducer(preState = initState, action) {
  const { type, data } = action
  switch (type) {
    case INCREMENT:
      return preState + data
    case DECREMENT:
      return preState - data
    default:
      return preState
  }
}
```

```js
// redux/store.js

import { createStore } from 'redux'
//引入为 Count 组件服务的 reducer
import countReducer from './count_reducer'

export default createStore(countReducer)
```

```js
// redux/count_action.js

import { INCREMENT, DECREMENT } from './constant'

export const createIncrementAction = (data) => ({ type: INCREMENT, data })
export const createDecrementAction = (data) => ({ type: DECREMENT, data })
```

```js
// components/Count/index.jsx

import React, { Component } from 'react'
import store from '../../redux/store'
import { createIncrementAction, createDecrementAction } from '../../redux/count_action'

export default class Count extends Component {
  // 可在组件单独监听 Redux 状态变化
  // componentDidMount() {
  // 	store.subscribe(() => {
  // 		this.setState({})
  // 	})
  // }

  increment = () => {
    const { value } = this.selectNumber
    // 将 value 转为数值
    // 手动写 Action 对象
    store.dispatch({ type: 'increment', data: value * 1 })
    // 专门创建 Action 对象
    store.dispatch(createIncrementAction(value * 1))
  }

  decrement = () => {
    const { value } = this.selectNumber
    store.dispatch(createDecrementAction(value * 1))
  }

  incrementAsync = () => {
    const { value } = this.selectNumber
    setTimeout(() => {
      store.dispatch(createIncrementAction(value * 1))
    }, 500)
  }

  render() {
    return (
      <div>
        <h1>当前求和为：{store.getState()}</h1>
        <select ref={(c) => (this.selectNumber = c)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.incrementAsync}>异步加</button>
      </div>
    )
  }
}
```

- redux 只负责管理状态，状态改变驱动页面展示要自己写
- 可以在 `index.js` 中统一监听状态变化，也可以在组件中单独监听。注意不能直接 `this.render()` 调用 `render` 函数，要通过 `this.setState({})` 间接调用
- `reducer` 由 `store` 自动触发首次调用，传递的 `preState` 为 `undefined` ，`action` 为 `{type: '@@REDUX/ININT_a.5.v.9'}` 类似的东东，只有 `type`

## Redux 异步编程

安装异步中间件：

```bash
npm install redux-thunk -S
```

要点：

- 延迟的动作不想交给组件，而是 `action`
- 当操作状态所需数据要靠异步任务返回时，可用异步 `action`
- 创建 `action` 的函数返回一个函数，该函数中写异步任务
- 异步任务完成后，分发一个同步 `action` 操作状态
- 异步 `action` 不是必要的，完全可以在组件中等待异步任务结果返回在分发同步 `action`

```js
// store.js
import { createStore, applyMiddleware } from 'redux'
import countReducer from './count_reducer'
import thunk from 'redux-thunk'

export default createStore(countReducer, applyMiddleware(thunk))
```

```js
// count_action.js
import { INCREMENT, DECREMENT } from './constant.js'

export const createIncrementAction = (data) => ({ type: INCREMENT, data })
export const createDecrementAction = (data) => ({ type: DECREMENT, data })

// 异步 action 返回一个函数
export const createIncrementAsyncAction = (data, time) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(createIncrementAction(data))
    }, time)
  }
}
```

```js
// Count.jsx
incrementAsync = () => {
  const { value } = this.selectNumber
  store.dispatch(createIncrementAsyncAction(value * 1))
}
```

整个过程简单理解：`store` 在分发 `action` 时，发现返回一个函数，那它知道这是个异步 `action` 。因此 `store` 勉为其难地帮忙执行这个函数，同时给这个函数传递 `dispatch` 方法，等待异步任务完成取到数据后，直接调用 `dispatch` 方法分发同步 `action` 。
