# React 网络请求

## React 脚手架配置代理

方法一：

在 `package.json` 文件中进行配置：

```js
"proxy": "http://localhost:5000"
```

- 优点：配置简单，前端请求资源可不加前缀
- 缺点：不能配置多个代理
- 工作方式：当请求了 3000 端口号（本机）不存在的资源时，就会把请求转发给 5000 端口号服务器

方法二：

在 `src` 目录下创建代理配置文件 `setupProxy.js` ，进行配置：

```js
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
    proxy('/api1', {
      //配置转发目标地址(能返回数据的服务器地址)
      target: 'http://localhost:5000',
      //控制服务器接收到的请求头中host字段的值
      /*
      changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
      changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
      changeOrigin默认值为false，但一般将changeOrigin改为true
      */
      changeOrigin: true,

      //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
      pathRewrite: { '^/api1': '' },
    }),
    proxy('/api2', {
      target: 'http://localhost:5001',
      changeOrigin: true,
      pathRewrite: { '^/api2': '' },
    })
  )
}
```

## 消息订阅-发布机制

即 React 中兄弟组件或任意组件之间的通信方式。

使用的工具库：[PubSubJS](https://www.npmjs.com/package/pubsub-js)

下载安装 `PubSubJS` ：`npm install pubsub-js --save`

基础用法：

```js
import PubSub from 'pubsub-js'

// 订阅消息
var token = PubSub.subscribe('topic', (msg, data) => {
  console.log(msg, data)
})

// 发布消息
PubSub.publish('topic', 'hello react')

// 取消订阅
PubSub.unsubscribe(token)
```

## Github 搜索框案例知识点总结

1. 设计状态时要考虑全面，例如带有网络请求的组件，要考虑请求失败怎么办。

2. ES6 知识点：解构赋值 + 重命名

```js
let obj = { a: { b: 1 } }

//传统解构赋值
const { a } = obj

//连续解构赋值
const {
  a: { b },
} = obj

//连续解构赋值 + 重命名
const {
  a: { b: value },
} = obj
```

3. 消息订阅与发布机制

- 先订阅，再发布（隔空对话）
- 适用于任意组件间通信
- 要在 `componentWillUnmount` 钩子中取消订阅

4. `fetch` 发送请求（**关注分离**的设计思想）

```js
try {
  // 先看服务器是否联系得上
  const response = await fetch(`/api1/search/users2?q=${keyWord}`)
  // 再获取数据
  const data = await response.json()
  console.log(data)
} catch (error) {
  console.log('请求出错', error)
}
```
