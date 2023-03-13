# React-Redux

:::info what's it
React-Redux 是一个插件库，用于简化 React 中使用 Redux 。
:::

![React-Redux模型图](./images/react-redux.png)

React-Redux 将组件分为两类：

- UI 组件
  - 只负责 UI 呈现，不带有业务逻辑
  - 通过 `props` 接收数据
  - 不能使用 Redux 的 API
  - 保存在 `components` 文件夹下
- 容器组件
  - 负责管理数据和业务逻辑，和 Redux 通信，将结果交给 UI 组件
  - 可使用 Redux 的 API
  - 保存在 `containers` 文件夹下

## React-Redux 基本使用

要点：

- `connect()()` ：创建容器组件
- `mapStateToProps(state)` ：映射状态为 UI 组件标签属性，即传递状态
- `mapDispatchToProps(dispatch)` ：传递操作状态的方法
- 容器组件中的 `store` 是靠 `props` 传进去，而不是在容器组件中直接引入

```js
// containers/Count/index.jsx
// Count 容器组件

import CountUI from '../../components/Count'
import { connect } from 'react-redux'

import { createIncrementAction, createDecrementAction, createIncrementAsyncAction } from '../../redux/count_action'

function mapStateToProps(state) {
  return {
    count: state,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    add: (number) => dispatch(createIncrementAction(number)),
    sub: (number) => dispatch(createDecrementAction(number)),
    addAsync: (number) => dispatch(createIncrementAsyncAction(number, time)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountUI)
```

```js
// App.jsx
import React, { Component } from 'react'
import Count from './containers/Count'
import store from './redux/store.js'

export default class App extends Component {
  render() {
    return (
      <div>
        <Count store={store} />
      </div>
    )
  }
}
```

```js
// components/Count/index.jsx
// Count UI 组件

increment = () => {
  const { value } = this.selectNumber
  this.props.add(value * 1)
}

decrement = () => {
  const { value } = this.selectNumber
  this.props.sub(value * 1)
}

incrementAsync = () => {
  const { value } = this.selectNumber
  this.props.addAsync(value * 1, 500)
}
```

## 优化写法

`mapDispatchToProps` 可以写成对象形式，React-Redux 底层会帮助自动分发。

```js
// 函数写法
export default connect(
  state => ({count:state}),
  dispatch => ({
    add: number => dispatch(createIncrementAction(number)),
    sub: number => dispatch(createDecrementAction(number)),
    addAsync: (number,time) => dispatch(createIncrementAsyncAction(number,time)),
  })
)(CountUI)

// 对象写法
export default connect(
  state => ({ count: state }),
  {
    add: createIncrementAction,
    sub: createDecrementAction,
    addAsync: createIncrementAsyncAction,
  }
)(CountUI)
```

React-Redux 容器组件可以自动监测 Redux 状态变化，因此 `index.js` 不需要手动监听：

```js
store.subscribe(() => {
  ReactDOM.render(<App />, document.getElementById('root'))
})
```

`Provider` 组件的使用：让所有组件都能获得状态数据，不必一个一个传递

```js
// index.js

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

整合容器组件和 UI 组件为一个文件：

```js
import React, { Component } from 'react'
import {
	createIncrementAction,
	createDecrementAction,
} from '../../redux/count_action'
import {connect} from 'react-redux'

// 定义 UI 组件
class Count extends Component {
  ...
}

// 创建容器组件
export default connect(
  state => ({count: state}),
  {
    add: createIncrementAction,
    sub: createDecrementAction
  }
)(Count)
```

## 多个组件数据共享

首先规范化文件结构，容器组件和 UI 组件合为一体后放在 `containers` 文件夹。`redux` 文件夹新建 `actions` 和 `reducers` 文件夹分别用于存放每个组件对应的 `action` 和 `reducer` 。

新建 `Person` 组件对应的 `action` 和 `reducer` ：

```js
// redux/actions/person.js

import { ADD_PERSON } from '../constant.js'

export const createAddPersonAction = (personObj) => ({ type: ADD_PERSON, data: personObj })
```

```js
// redux/reducers/person.js

import { ADD_PERSON } from '../constant.js'

const initState = [{ id: 'lsfd', name: 'china', age: '9999' }]
export default function personReducer(preState = initState, action) {
  const { type, data } = action
  switch (type) {
    case ADD_PERSON:
      return [data, ...preState]
    default:
      return preState
  }
}
```

关键步骤：在 `store.js` 中使用 `combineReducers()` 整合多个 `reducer` 来创建 `store` 对象。

这样 Redux 中就以对象的形式存储着每个组件的数据。类似于这样：

```js
{
  total: 0,
  personList: []
}
```

```js
// redux/store.js

import { createStore, applyMiddleware, combineReducers } from 'redux'
import countReducer from './reducers/count'
import personReducer from './reducers/person'
import thunk from 'redux-thunk'

const Reducers = combineReducers({
  total: countReducer,
  personList: personReducer,
})

export default createStore(Reducers, applyMiddleware(thunk))
```

`Person` 组件中获取 Redux 保存的状态，包括其他组件的数据。

```js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAddPersonAction } from '../../redux/actions/person'
import { nanoid } from 'nanoid'

class Person extends Component {
  addPerson = () => {
    const name = this.nameInput.value
    const age = this.ageInput.value
    const personObj = { id: nanoid(), name, age }
    this.props.addPerson(personObj)
    this.nameInput.value = ''
    this.ageInput.value = ''
  }

  render() {
    return (
      <div>
        <h2>在Person组件拿到Count组件的数据：{this.props.count}</h2>
        <input type="text" ref={(c) => (this.nameInput = c)} placeholder="Please input name" />
        <input type="text" ref={(c) => (this.ageInput = c)} placeholder="Please input age" />
        <button onClick={this.addPerson}>添加</button>
        <ul>
          {this.props.personList.map((item) => {
            return (
              <li key={item.id}>
                {item.name} -- {item.age}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default connect(
  // state 是 Redux 保存的状态对象
  // 容器组件从 Redux 中取出需要的状态，并传递给 UI 组件
  state => ({personList: state.personList, count: state.total}),
  {
    addPerson: createAddPersonAction
    // 这一行凑数的，为了保持代码格式
    addPerson2: createAddPersonAction
  }
)(Person)
```

一个细节，在 `personReducer` 中，是按如下方式修改状态的，而没有使用 `unshift` 方法。在第二种方式，React 会认为状态没有变化从而不会重新渲染页面，因为 `preState` 保存的是数组地址值，返回的地址和之前的地址是一样的，尽管数组内容发生了改变。而第一种方式返回一个新的数组的地址值，和之前不一样，因此会重新渲染页面。

```js
// 方式一
switch (type) {
  case ADD_PERSON:
    return [data, ...preState]
  default:
    return preState
}

// 方式二
switch (type) {
  case ADD_PERSON:
    preState.unshift(data)
    return preState
  default:
    return preState
}
```

## 纯函数

概念：输入同样的参数，返回同样的输出。

约束：

- 不能修改参数数据
- 不产生任何副作用，如网络请求、输入和输出设备
- 不能调用 `Date.now()` 或 `Math.random()` 等不纯的方法

`reducer` 的函数必须是纯函数。

## Redux 开发者工具

Chrome 安装 Redux DevTools 开发者工具，项目下载依赖包 `npm i redux-devtools-extension --save-dev`，最后在 `store.js` 进行配置：

```js
import { composeWithDevTools } from 'redux-devtools-extension'
...
export default createStore(Reducers, composeWithDevTools(applyMiddleware(thunk)))
// 不需要异步中间件
export default createStore(Reducers, composeWithDevTools())
```

## 项目打包运行

运行命令：`npm run build` 进行项目打包，生成 `build` 文件夹存放着打包完成的文件。

运行命令：`npm i serve -g` 全局安装 `serve` ，它能够以当前目录为根目录开启一台服务器，进入 `build` 文件夹所在目录，运行 `serve` 命令即可开启服务器查看项目效果。
