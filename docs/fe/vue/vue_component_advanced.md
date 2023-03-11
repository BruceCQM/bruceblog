# vue 组件进阶

## 动态组件

vue 提供了内置的 `<component>` 组件用于动态切换组件。

```html
<!-- 通过 is 属性指定要渲染的组件，传递的是字符串 -->
<component :is="comName"></component>

<button @click="comName = 'Left'">展示Left组件</button>
<button @click="comName = 'Right'">展示Right组件</button>
```

## keep-alive

默认情况下，切换动态组件时无法保持组件的状态。此时可以使用 vue 内置的 `<keep-alive>` 组件保持动态组件的状态，对被包裹的组件进行状态缓存。

被 `<keep-alive>` 包裹的组件会多出两个生命周期函数：当组件被激活时，触发 `activated` 钩子；当组件被缓存时，触发 `deactivated` 钩子。

```html
<keep-alive>
  <component :is="comName"></component>
</keep-alive>
```

`<keep-alive>` 的 `include` 和 `exclude` 属性，分别用于指明哪些组件要缓存、哪些组件不要缓存。

```html
<keep-alive include="Left, Right">
  <component :is="comName"></component>
</keep-alive>

<keep-alive :include="['News', 'Message']">
  <router-view></router-view>
</keep-alive>
```

## 插槽

### 何为插槽

插槽可以理解为组件封装期间，为用户预留的**内容占位符**。它是 vue 为组件封装者提供的能力，允许开发者在封装组件时，把**不确定的、希望由用户指定的部分**定义为插槽。

### 插槽基本用法

基础使用：

```html
<!-- 子组件中预留插槽 -->
<template>
  <div class="contianer">
    <h1>这是子组件</h1>
    <slot></slot>
  </div>
</template>

<!-- 父组件使用子组件时，向插槽填充内容 -->
<child-comp>
  <p>填充到插槽的内容</p>
</child-comp>
```

如果子组件没有预留插槽，那么父组件填充给子组件的自定义内容会被丢弃：

```html
<!-- 子组件没有预留插槽 -->
<template>
  <div class="contianer">
    <h1>这是子组件</h1>
  </div>
</template>

<!-- 父组件的自定义内容会被丢弃 -->
<child-comp>
  <p>这段自定义内容会被丢弃</p>
</child-comp>
```

子组件可以为插槽提供**后备内容**，当父组件没有提供自定义内容时，后备内容就会生效。

```html
<!-- 子组件提供后备内容 -->
<template>
  <div class="contianer">
    <h1>这是子组件</h1>
    <slot>这是后备内容，父组件没有提供自定义内容就会生效</slot>
  </div>
</template>

<!-- 父组件没有提供自定义内容 -->
<child-comp> </child-comp>
```

### 具名插槽

组件在预留插槽时可以设置 `name` 属性，为插槽指定名称，这种有具体名称的插槽就叫具名插槽。
没有设置 `name` 名称的插槽默认名称为 `default` 。

```html
<!-- 子组件预留多个具名插槽 -->
<template>
  <div class="contianer">
    <h1>这是子组件</h1>

    <slot name="title">title 具名插槽</slot>
    <hr />
    <slot name="content">content 具名插槽</slot>>
    <hr />
    <slot>没有设置 name 名称则默认为 default</slot>
    <slot name="default"></slot>
  </div>
</template>
```

父组件向具名插槽提供自定义内容

- 新的写法：包裹一个 `<template>` 标签，同时在 `<template>` 中通过 `v-slot:名称` 指明插槽的名称。简写形式为 `#名称` ，且 `v-slot` 只能使用在 `<template>` 和组件标签上，普通 HTML 标签不行
- 旧的写法：`slot="名称"` 指明插槽名称
- 如果不指定插槽名称，那么自定义内容会被填充到所有的 `default` 插槽当中
- 同一插槽填充多个内容，是追加不是覆盖

```html
<!-- 父组件向具名插槽提供自定义内容 -->
<child-comp>
  <h1 slot="title">《赠汪伦》</h1>

  <template v-slot:title>
    <h1>《静夜思》</h1>
  </template>

  <!-- 简写形式 -->
  <template #content>
    <p>床前明月光，疑是地上霜。</p>
    <p>举头望明月，低头思故乡。</p>
  </template>

  <template>
    <p>这段内容没有指定名称，会被填充到所有 default 插槽中。</p>
  </template>
</child-comp>
```

### 作用域插槽

- 组件可以为插槽绑定自定义属性 `props` ，这种插槽叫作用域插槽
- 理解：数据在组件的自身，但根据数据生成的结构需要组件的使用者来决定

```html
<!-- 子组件为插槽绑定 props 数据 -->
<template>
  <slot v-for="item in list" :user="item"></slot>
</template>
```

```js
export default {
  data() {
    return {
      list: [
        {
          id: 1,
          name: 'Lily',
          state: true,
        },
        {
          id: 2,
          name: 'Ben',
          state: false,
        },
        {
          id: 3,
          name: 'Water',
          state: true,
        },
      ],
    }
  },
}
```

父组件向插槽提供自定义内容时，可以接收作用域插槽提供的数据：

- 旧写法：`scope="scope"` 、`slot-scope="scope"`
- 新写法：`v-slot:default="scope"`

```html
<child-comp>
  <template #default="scope">
    <p>作用域插槽提供的数据：{{ scope }}</p>
  </template>

  <template slot-scope="scope" slot="default">
    <p>{{ scope }}</p>
  </template>
</child-comp>
```

其中接收到的数据 `scope` 是一个对象。

```js
// scope 的内容
{
  'user': {
    'id': 1,
    'name': 'Lily',
    'state': true
  }
}
```

在接收作用域插槽提供的数据时可以使用解构赋值。

```html
<child-comp>
  <template #default="{user}">
    <p>id：{{ user.id }}</p>
    <p>name：{{ user.name }}</p>
    <p>state：{{ user.state }}</p>
  </template>
</child-comp>
```

## 自定义指令

### 分类

- 私有自定义指令：在组件的 `directives` 节点声明
- 全局自定义指令：在 `main.js` 文件中声明

### 完整写法

```html
<input type="text" v-focus="content" />
```

```js
data() {
  return {
    content: 666
  }
},
directives: {
  focus: {
    // 指令与元素成功绑定时执行，执行一次
    bind(el, binding) {
      el.value = binding.value
    }

    // 指令所在元素插入页面时执行，执行一次
    inserted(el, binding) {
      // 一进入页面输入框获得焦点
      el.focus()
    }

    // 指令所在元素重新解析（个人觉得不应是渲染，而是解析，重新解析不一定重新渲染）时执行，执行 0+N 次
    update(el, binding) {
      el.value = binding.value
    }
  }
}

// 全局写法
Vue.directive('focus', {
  bind(el, binding) {
    el.value = binding.value
  }
  inserted(el, binding) {
    el.focus()
  }
  update(el, binding) {
    el.value = binding.value
  }
})
```

### 简写形式

- 当 `bind` 函数和 `update` 函数里的逻辑完全相同时，可以简写
- 不需要定义 `inserted` 函数才使用简写形式
- 因此简写形式的调用时机：初次绑定和 DOM 更新（指令所在模板被重新解析）

```html
<h2 v-color="'red'">简写形式</h2>
```

```js
directives: {
  color(el, binding) {
    el.style.color = binding.value
  }
}

// 全局写法
Vue.directive('color', (el, binding) => {
  el.style.color = binding.value
}))
```

### 注意事项

- 自定义指令使用时需要添加 `v-` 前缀
- 指令名如果是多个单词，要使用 `kebab-case` 短横线命名方式，不要用 `camelCase` 驼峰命名
- 自定义指令三个函数里的 `this` 指向 `window`

```html
<span v-big-number="n"></span>
```

```js
data() {
  return {
    n: 1
  }
},
directives: {
  // 添加引号才是对象键名完整写法
  // 平时不加引号都是简写形式
  // 遇到短横线的键名就必须添加引号
  'big-number': {
    bind(el, binding) {
      console.log(this) // Window
      el.innerText = binding.value * 10
    }
  }
}
```

## Mixin 混入

- Mixin 可以把多个组件共用的配置提取成一个混入对象
- 混入和组件自身的配置会合并
- `data` 、`methods` 若冲突以自身为准
- 对于生命周期钩子，执行动作会合并，且先执行 Mixin 里的动作

定义混入：

```js
// mixin.js
export const mixin = {
  methods: {
    showName() {
      alert(this.name)
    },
  },
  mounted() {
    console.log('hello mixin')
  },
}
export const mixin2 = {
  data() {
    return {
      x: 100,
      y: 200,
    }
  },
}
```

使用局部混入：

```js
import { mixin, mixin2 } from '../mixin.js'

export default {
  name: 'School',
  data() {
    return {
      schoolName: '北大',
    }
  },
  mixins: [mixin, mixin2],
}
```

使用全局混入：

```js
// main.js
import { mixin, mixin2 } from './mixin.js'

Vue.mixin(mixin)
Vue.mixin(mixin2)
```

## 插件

- 用于增强 Vue
- 本质是包含 `install` 方法的一对象，`install` 第一个参数是 Vue 构造函数，第二个以后的参数是插件使用者传递的数据

定义插件：

```js
// plugins.js
export default {
  install(Vue, ...rest) {
    console.log(rest)

    Vue.filter(...)
    Vue.directive(...)
    Vue.mixin(...)

    Vue.prototype.myProperty = 'plugins'
    Vue.prototype.myMethod = function() {}
  }
}
```

使用插件：

```js
// main.js
import plugins from './plugins.js'

Vue.use(plugins, 1, 2)
```

## $nextTick

- 语法：`this.$nextTick(回调函数)`
- 作用：在下一次 DOM 更新结束后执行其指定的回调
- 什么时候用：当改变数据后，要基于更新后的 DOM 进行操作时，要在 `nextTick` 指定的回调函数中执行
- 组件的 `$nextTick(cb)` 方法，会把 cb 回调推迟到下一个 DOM 更新周期之后执行，即在 DOM 更新完成后再执行回调，从而保证 cb 回调可以获取最新的 DOM 元素

```js
methods: {
  showInput() {
    this.inputVisible = true
    // 对输入框的操作推迟到 DOM 更新完成之后
    this.$nextTick(() => {
      this.$refs.input.focus()
    })
  }
}
```
