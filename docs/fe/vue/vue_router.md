# Vue Router

[官网传送门](https://router.vuejs.org/zh/)

## 路由

### 何为路由

- 一组路由即一组映射关系（key-value）
- key 为路径，value 可能是 function 或 component

### 前端路由

前端路由即地址和组件之间的对应关系（以下已哈希模式为例）。

前端路由简易工作方式：

1. 用户点击了页面上的路由链接
2. URL 地址的 Hash 值发生变化
3. 前端路由监听到 Hash 值的变化
4. 前端路由渲染 Hash 地址对应的组件

实现简易的前端路由：

```html
<!-- a 链接添加对应 Hash 值 -->
<a href="#/home">Home</a>
<a href="#/movie">Movie</a>
<a href="#/about">About</a>

<!-- 动态渲染组件 -->
<component :is="compName"></component>
```

```js
export default {
  name: 'App',
  data() {
    return {
      compName: 'Home'
    }
  },
  created() {
    // 监听 Hash 地址改变，切换组件
    window.onhashchange = () => {
      switch(location.hash) {
        case: '#/home':
          this.compName = 'Home'
          break
        case: '#/movie':
          this.compName = 'Movie'
          break
        case: '#/about':
          this.compName = 'About'
          break
      }
    }
  }
}
```

### 后端路由

- 后端路由是指请求方式、请求地址与 `function` 处理函数之间的对应关系
- 服务器收到一个请求，根据请求方式、路径匹配对应的函数处理请求，返回响应数据

```js
const express = require('express')
const router = express.Router()

router.get('/userlist', function(req, res) {...})

module.exports = router
```

## 单页面应用程序 SPA

单页面应用程序将所有的功能局限于一个 web 页面中，仅在该 web 页面初始化时加载相应的资源（ HTML、JavaScript 和 CSS）。
一旦页面加载完成了，SPA 不会因为用户的操作而进行页面的重新加载或跳转。而是利用 JavaScript 动态地变换 HTML 的内容，从而实现页面与用户的交互。

SPA 的优点：

- 良好的交互体验
  - 内容的改变不需要重新加载整个页面
  - 数据通过 `Ajax` 异步获取
  - 没有页面跳转，不会出现白屏现象
- 良好的前后盾工作分离模式
  - 后端专注于提供 API 接口，更易实现接口复用
  - 前端专注页面渲染，更利于前端工程化发展
- 减轻服务器压力
  - 服务器只提供数据，不负责页面的合成与逻辑处理，吞吐能力会提高

SPA 的缺点：

- 首屏加载慢：可使用路由懒加载、代码压缩、CDN 加速、网络传输压缩
- 不利于 SEO ：SSR 服务器端渲染

## vue-router 初体验

安装 `vue-router`：

```
npm install vue-router@3.5.2 -S
```

创建路由模块，在 `src` 源代码目录下，新建 `router/index.js` 路由模块，初始化代码：

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/component/Home.vue'
import About from '@/component/About.vue'
import Movie from '@/component/Movie.vue'

// 把 VueRouter 安装为 Vue 的插件
Vue.use(VueRouter)

// 路由匹配规则
const routes = [
  { path: '/home', component: Home },
  { path: '/about', component: About },
  { path: '/movie', component: Movie },
]

// 创建路由实例对象
const router = new VueRouter({
  routes,
})

export default router
```

在 `main.js` 文件中导入并挂载路由模块：

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
```

在组件中声明路由链接和占位符：

```html
<template>
  <div class="app-container">
    <!-- 路由链接 -->
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>
    <router-link to="/movie">电影</router-link>

    <!-- 路由出口 -->
    <router-view></router-view>
  </div>
</template>
```

注意事项：

- 组件分为路由组件和一般组件，前者放在 `pages(或views)` 文件夹，后者放在 `components` 文件夹
- 每个组件都有 `$route` 属性，存储着组件的路由规则信息
- `$router` 是路由器对象，整个 SPA 只有一个

## 声明式导航

`<router-link>` 4 个常用属性：

1. `to` 属性

- 用于指定跳转路由

```html
<router-link to="/about"></router-link>
```

2. `tag` 属性

- 指明 `<router-link>` 最终被渲染为何种标签，默认是 a 标签
- 渲染为其他标签也会监听点击，触发导航

```html
<router-link to="/about" tag="li">tag</router-link>

<li>tag</li>
```

3. `replace` 属性

- 路由跳转不会增加新的历史记录，而是替换当前历史记录

```html
<router-link to="/about" replace>About</router-link>
```

4. `active-class` 属性

- 指明路由被激活时添加的类名，默认为 `router-link-active`
- 详见[路由高亮](#路由高亮)

```html
<router-link to="/about" active-class="active">About</router-link>
```

## 路由高亮

被激活的路由链接，默认会添加 `router-link-active` 的类名。可据此为激活的路由链接设置高亮的样式：

```css
.router-link-active {
  color: white;
  background-color: pink;
}
```

定义路由模块时可以自定义路由链接被激活时添加的类名：

```js
const router = new VueRouter({
  // 默认的 router-link-active 会被覆盖
  linkActiveClass: 'active-hello',
  routes,
})
```

声明路由链接时也可用 `active-class` 属性自定义激活类名：

```html
<!-- router-link-active 会被覆盖为 active -->
<router-link active-class="active" to="/about">About</router-link>
```

## 路由重定向

```js
const routes = [
  // 访问 / 跳转到 /home
  { path: '/', redirect: '/home' },
  { path: '/home', component: 'Home' },
  { path: '/about', component: 'About' },
  { path: '/movie', component: 'Movie' },
]

const router = new VueRouter({
  routes,
})

export default router
```

## 嵌套路由

`About` 组件中声明子路由链接和子路由占位符：

```html
<template>
  <div class="about-container">
    <!-- 要把父路由寫上 -->
    <router-link to="/about/tab1">tab1</router-link>
    <router-link to="/about/tab2">tab2</router-link>

    <router-view></router-view>
  </div>
</template>
```

通过 `children` 属性声明子路由规则：

```js
const routes = [
  {
    path: '/about',
    component: 'About',
    children: [
      // 注意不要写成 /tab1
      { path: 'tab1', component: Tab1 },
      { path: 'tab2', component: Tab2 },
    ],
  },
]
```

## 编程式导航

声明式导航：

- 通过点击链接实现导航
- 如普通网页点击 `a` 链接，`vue` 点击 `<router-link>`

编程式导航：

- 通过调用 API 实现导航
- 普通网页通过 `location.href` 的方式跳转页面也是编程式导航

`vue-router` 中实现编程式导航的 API ：

- `this.$router.push('hash地址')` ：跳转到指定页面，并增加一条历史记录
- `this.$router.replace('hash地址')` ：跳转页面，但不会新增历史记录，而是替换当前的历史记录
- `this.$router.go(数值)` ：历史记录前进或后退，相当于点击浏览器前进后退箭头
- `this.$router.forward()` ：前进一步
- `this.$router.back()` ：后退一步

## 命名路由

给路由命名，某些情况可简化路由跳转写法

```js
const routes = [
  {
    name: 'about',
    path: '/about',
    component: About,
  },
]
```

```html
<router-link :to="{ name: 'about'} "></router-link>

<router-link :to="{ name: 'about', query: { id: 1, title: 'hello' }}"></router-link>
```

## 路由传参

### query 参数

传递参数：

```html
<!-- 字符串写法 -->
<router-link :to="`/home/detail?id=${id}&title=${title}`">字符串写法</router-link>
<!-- 对象写法 -->
<router-link
  :to="{
    path: '/home/detail',
    query: {
      id: 1,
      title: 'hello',
    }
  }"
>
  对象写法
</router-link>
```

```js
this.$router.push(`/home/detail?id=${id}&title=${title}`)
this.$router.push({ path: '/home/detail', query: { id: 1, title: 'query' } })
```

接收参数：

```js
this.$route.query.id
this.$route.query.title
```

### params 参数（动态路由）

动态路由是把 Hash 地址中可变的部分定义为参数项，从而提高路由规则的复用性。

声明 params 参数：

```js
// 定义动态路由参数
{ path: '/movie/:id/:age', component: Movie }

// 以下类似的路由规则都能合并为上述规则，复用性得到提高
{ path: '/movie/1/21', component: Movie }
{ path: '/movie/2/22', component: Movie }
{ path: '/movie/3/23', component: Movie }
```

传递 params 参数：

```html
<router-link :to="/movie/1/21">字符串写法</router-link>
<!-- 对象写法只能和 name 搭配使用，不能和 path 搭配 -->
<router-link
  :to="{
  name: 'movie',
  params: {
    id: 1,
    age: 21
  }
}"
>
  对象写法
</router-link>

<!-- query 和 params 可以一起用 -->
<router-link :to="`/movie/1/21?id=${id}`">字符串写法</router-link>
<router-link
  :to="{
    name:'movie', 
    params: {id:1, age:21}, 
    query: {school: 'love'}
  }"
>
  对象写法
</router-link>
```

```js
this.$router.push(`/movie/1/21?id=${id}`)
this.$router.push({ name: 'movie', params: { id: 1, age: 21 }, query: { school: 'love' } })
```

接收 params 参数：

```html
<template>
  <div class="movie-container">
    <h1>Movie组件，参数值：{{ this.$route.params.id }}</h1>
  </div>
</template>
```

### 路由的 props 配置

简化路由组件接收参数。

在路由规则中开启 `props` 传参，组件可以使用 `props` 接收路由参数：

```js
{
  path: '/movie/:id/:title',
  component: Movie,

  // 方式一：该对象中的所有 key-value 都会以 props 的形式传给组件
  // 该方式是写死的，少用
  props: {id: 666, title: 'hello'}

  // 方式二：把 params 参数以 props 的形式传给组件
  // 只能接收 params 参数
  props: true

  // 方式三：函数写法，啥都能传
  props($route) {
    return {
      id: $route.query.id,
      title: $route.params.title,
      age: 21
    }
  }
}
```

组件接收参数：

```js
export default {
  // 使用 props 接收路由规则的参数项
  props: ['id', 'title'],
}
```

```html
<template>
  <h1>Movie组件，参数值：{{ id }}，题目：{{ title }}</h1>
</template>
```

### 路由传参注意事项

1. path 不能和 params 一起使用。path+query、name+query/params 都行
2. 如何指定 params 参数可传可不传？

- 若声明了 params 参数 `path: '/movie/:title'`，默认是必须要传递 params 参数的，否则 URL 会出现问题
- 指定 params 参数可不传：`path: '/movie/:title?'`

3. 已指明 params 参数可传可不传，但如果传递空串，如何解决？

- 传递空串，URL 也会出现问题
- 方法：使用 `undefined`

```js
this.$router.push({ name: 'search', params: { keyword: '' }, query: { key: this.key } })
this.$router.push({ name: 'search', params: { keyword: '' || undefined }, query: { key: this.key } })
```

## 路由元信息 meta

在 `meta` 中可以为路由添加自定义信息：

```js
const routes = [
  {
    name: 'about',
    path: '/about',
    component: About,
    meta: { title: 'hello', isAuth: true },
  },
]
```

## 路由守卫

> 作用：对路由进行权限控制。
>
> 分类：全局守卫、独享守卫、组件内守卫

### 全局守卫

- 全局前置守卫：`beforeEach()`
- 全局后置守卫：`afterEach()`

守卫回调函数 3 个形参：

- `to` ：将要访问的路由的信息对象，即 `$route`
- `from` ：将要离开的路由的信息对象
- `next` ：放行函数（后置守卫没有）

`next` 函数 3 种调用方式：

- 直接放行：`next()`
- 强制跳转到其他路由：`next(/login)`
- 阻止本次跳转：`next(false)`

```js
const router = new VueRouter({...})

router.beforeEach((to, from, next) => {
  if(to.path === '/main') {
    const token = localStorage.getItem('token')

    if(token) {
      next()
    } else {
      next('/login')
    }
  } else {
      next()
  }
})

router.afterEach((to,from) => {
  if(to.meta.title) {
    // 修改网页标题
    document.title = to.meta.title
  } else {
    document.title = 'vue_test'
  }
})
```

### 独享路由守卫

- 某一条路由规则独享的守卫
- 独享守卫只一个

```js
{
  path: 'about',
  component: About,
  beforeEnter(to, from ,next) {
    ...
  }
}
```

### 组件内路由守卫

```js
export default {
  name: 'About',

  // 进入守卫：通过路由规则，进入该组件时被调用
  beforeRouteEnter(to, from, next) {
    ...
  }

  // 离开守卫：通过路由规则，离开该组件时被调用
  beforeRouteLeave (to, from, next) {
    ...
  }
}
```

### 各个守卫执行顺序

从 `About` 组件通过路由规则进入 `Home` 组件：

```bash
About-beforeRouteLeave
beforeEach
Home-beforeEnter
Home-beforeRouteEnter
afterEach
Home组件生命周期开始
```

## vue-router 4.x

目前 `vue-router` 有 `3.x` 和 `4.x` 两个版本，前者只能在 `vue2.x` 中使用，后者只能在 `vue3.x` 中使用。

下面是 `vue-router 4.x` 初体验：

安装 `vue-router 4.x` ：

```
npm install vue-router@next -S
```

创建路由模块：

```js
// 从 vue-router 按需导入两个方法
// createRouter：创建路由实例对象
// createWebHashHistory：指定路由工作模式为 hash 模式
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/home', component: Home }],
})

export default router
```

`main.js` 导入并挂载路由模块：

```js
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
```
