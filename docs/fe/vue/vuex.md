# Vuex

[官网传送门](https://vuex.vuejs.org/zh/)

## 概述

何为 Vuex ？

Vuex 专门在 Vue 中实现集中式状态（数据）管理的一个 Vue 插件，对 Vue 应用中多个组件的共享状态进行集中式的管理，也是一种组件间通信的方式，适用于任意组件间通信

何时用 Vuex ？

- 多个组件依赖于同一状态
- 来自不同组件的行为需要变更同一状态

Vuex 工作原理图：

![Vuex工作原理](./images/vuex.png)

官方 Vuex 项目结构示例：

    ├── index.html
    ├── main.js
    ├── api
    │   └── ... # 抽取出API请求
    ├── components
    │   ├── App.vue
    │   └── ...
    └── store
        ├── index.js          # 组装模块并导出 store 的地方
        ├── actions.js        # 根级别的 action
        ├── mutations.js      # 根级别的 mutation
        └── modules
            ├── cart.js       # 购物车模块
            └── products.js   # 产品模块

## Vuex 核心概念

### state

- Vuex 管理的状态对象
- 唯一的

### actions

- 值为一个对象，包含多个响应用户动作的回调函数
- 通过 `commit()`触发 mutation 中函数的调用，间接更新 state
- 可包含异步代码

### mutations

- 值为一个对象，包含多个直接更新 state 的方法
- 不能写异步代码，只能单纯地操作 state

### getters

- 值为一个对象，包含多个用于返回数据的函数
- 类似于计算属性，getters 返回的数据依赖于 state 的数据

### modules

- 一个 module 是一个 store 的配置对象，与一个组件对应

## 搭建 Vuex 环境

安装 Vuex：`npm install vuex@3 --save`

> 注意：Vue2 安装 Vuex3，Vue3 安装 Vuex4，版本需对应。

创建文件 `src/store/index.js` ：

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const actions = {}
const mutations = {}
const state = {}

export default new Vuex.Store({
  actions,
  mutations,
  state,
})
```

`main.js` 配置 `store` ：

```js
import store from './store'

new Vue({
  el: '#app',
  store,
  render: (h) => h(App),
})
```

## 基本使用

组件实例与 `Actions` 和 `Mutations` 对话：

- 若没有网络请求或其他业务逻辑，组件中也可以越过 `actions` ，即不写`dispatch`，直接编写`commit`：

```js
methods: {
  increment() {
    this.$store.commit('ADD', this.number)
  },
  incrementOdd() {
    this.$store.dispatch('addOdd', this.number)
  },
  incrementAsync() {
    this.$store.dispatch('addAsync', this.number)
  }
}
```

定义 `Actions` 和 `Mutations`：

- `context` 是一个迷你版的 `store`，可访问 `dispatch`, `commit` 方法和 `state`
- `mutations` 的动作类型一般用大写，与 `actions` 区分

```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const actions = {
  // context 是一个迷你版的 store
  // 可访问 dispatch, commit 方法和 state
  addOdd(context, value) {
    if (context.state.sum % 2 !== 0) {
      context.commit('ADD', value)
    }
  },
  addAsync(context, value) {
    setTimeout(() => {
      context.commit('ADD', value)
    })
  },
}
const mutations = {
  // mutations 的动作类型一般用大写，与 actions 区分
  ADD(state, value) {
    state.sum += value
  },
}

const state = {
  sum: 0,
}

export default new Vuex.Store({
  actions,
  mutations,
  state,
})
```

组件访问 Vuex 的数据：

```html
<p>{{ $store.state.sum }}</p>
```

## getters 的使用

- 当 `state` 中的数据需要经过加工后再使用时，可以使用 `getters` 加工
- 它不是必须的，当加工逻辑复杂且需要复用时，可以考虑使用
- `state` 与 `getters` 的关系有点像 `data` 和 `computed` 的关系
- 组件读取：`$store.getters.bigSum`

```js
...
const getters = {
  bigSum(state) {
    return state.sum * 10
  }
}

export default new Vuex.Store({
  actions,
  mutations,
  state,
  getters
})
```

## 四个 mapXxx 方法

### mapState()

- 将 `state` 状态映射为计算属性
- 对象写法：键为自取的计算属性名，值为对应的状态（必须为字符串）
- 数组写法：当键值同名，可直接写状态名（字符串）
- 函数返回一个对象：`{sum: f, price: f}`
- 注意对象的 `...{}` 展开写法

```js
import { mapState } from 'vuex'

computed: {
  // 手动写法
  sum() {
    return this.$store.state.sum
  },
  price() {
    return this.$store.state.price
  },

  // 对象写法
  ...mapState({sum: 'sum', price: 'price'}),

  // 数组写法
  ...mapState(['sum', 'price'])
}

```

### mapGetters

- 将 `getters` 的数据映射为计算属性

```js
import { mapGetters } from 'vuex'

computed: {
  bigSum() {
    return this.$store.getters.bigSum
  },
  double() {
    return this.$store.getters.double
  },

  // 对象写法
  ...mapGetters({bigSum: 'bigSum', double: 'double'}),

  // 数组写法
  ...mapGetters(['bigSum', 'double']),
}
```

### mapActions

- 生成与 `actions` 对话的函数，即包含 `$store.dispatch()`
- `mapActions` 生成的函数不会传入参数，需要在调用时手动传入数据，不传参默认传入 `$event`
- 数组写法要注意函数名和 `actions` 动作类型同名，调用时勿写错

```js
import { mapActions } from 'vuex'

methods: {
  // 手动写法
  incrementOdd() {
    this.$store.dispatch('addOdd', this.number)
  },
  incrementAsync() {
    this.$store.dispatch('addAsync', this.number)
  },

  // 对象写法
  ...mapActions({incrementOdd: 'addOdd', incrementAsync: 'addAsync'}),

  // 数组写法
  ...mapActions(['addOdd', 'addAsync']),
}
```

```html
<button @click="incrementOdd(number)">奇数+1</button>
```

### mapMutations

- 生成与 `mutations` 对话的函数，即包含 `$store.commit()`
- 同样注意传递参数，以及数组形式函数名的问题

```js
import { mapMutations } from 'vuex'

methods: {
  increment() {
    this.$store.commit('ADD', this.number)
  },
  decrement() {
    this.$store.commit('SUB', this.number)
  },

  // 对象写法
  ...mapMutations({increment: 'ADD', decrement: 'SUB'}),

  // 数组写法
  ...mapMutations(['ADD', 'SUB']),
}
```

## Vuex 模块化&命名空间

让代码更好维护，让多种数据分类更加明确，每一类数据及其相关操作对应一个 `store` 。

```js
// src/store/index.js
const countAbout = {
  // 开启命名空间
  namespaced: true,
  state: {
    sum: 0
  },
  actions: {...},
  mutations: {...},
  getters: {
    bigSum(state) {
      return state.sum * 10
    }
  }
}
const personAbout = {
  // 开启命名空间
  namespaced: true,
  state: {
    personList: []
  },
  actions: {...},
  mutations: {...},
  getters: {...}
}

export default new Vuex.Store({
  modules: {
    countAbout,
    personAbout
  }
})
```

开启命名空间后，组件中读取 `state` 数据：

```js
// 直接读取
this.$store.state.personAbout.personList

// mapState 读取
...mapState('countAbout',['sum','school']),
```

开启命名空间后，组件中读取 `getters` 数据：

```js
// 直接读取
this.$store.getters['countAbout/bigSum']

// mapGetters 读取：
...mapGetters('countAbout',['bigSum'])
```

开启命名空间后，组件中调用 `dispatch`

```js
// 直接 dispatch
this.$store.dispatch('countAbout/addODdd', this.number)
// 借助 mapActions
...mapActions('countAbout', {incrementOdd:'addOdd', incrementWait:'addAsync'})
```

开启命名空间后，组件中调用 `commit`

```js
// 直接 commit
this.$store.commit('personAbout/ADD_PERSON', person)
// 借助 mapMutations
...mapMutations('countAbout',{increment:'ADD',decrement:'SUB'}),
```
