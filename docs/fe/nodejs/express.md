# Express

[官网传送门](https://www.expressjs.com.cn/)

> 基于 Node.js 平台，快速、开放、极简的 Web 开发框架

Express 是用于快速创建服务器的第三方模块。

## Express 初体验

### 基本使用

安装 Express：

```bash
npm install express
```

创建服务器，监听客户端请求，并返回内容：

```js
const express = require('express')
// 创建 web 服务器
const app = express()

// 监听客户端的 GET 和 POST 请求，并向客户端响应具体的内容
app.get('/user', (req, res) => {
  res.send({ name: 'zs', age: 20, gender: '男' })
})
app.post('/user', (req, res) => {
  res.send('请求成功')
})

app.get('/', (req, res) => {
  // 通过 req.query 可以获取到客户端发送过来的查询参数
  console.log(req.query)
  res.send(req.query)
})

// 这里的 :id 是一个动态的参数
app.get('/user/:ids/:username', (req, res) => {
  // req.params 是动态匹配到的 URL 参数，默认是一个空对象
  console.log(req.params)
  res.send(req.params)
})

app.listen(80, () => {
  console.log('express server running at http://127.0.0.1')
})
```

### 托管静态资源

- 通过 `express.static()` 方法可创建静态资源服务器，向外开放访问静态资源。
- Express 在指定的静态目录中查找文件，并对外提供资源的访问路径，存放静态文件的目录名不会出现在 URL 中
- 访问静态资源时，会根据托管顺序查找文件
- 可为静态资源访问路径添加前缀

```js
app.use(express.static('public'))
app.use(express.static('files'))
app.use('/bruce', express.static('bruce'))

/*
可直接访问 public, files 目录下的静态资源
http://localhost:3000/images/bg.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/login.js

通过带有 /bruce 前缀的地址访问 bruce 目录下的文件
http://localhost:8080/bruce/images/logo.png
*/
```

## Express 路由

创建路由模块：

```js
// router.js

const express = require('express')
// 创建路由对象
const router = express.Router()

// 挂载具体路由
router.get('/user/list', (req, res) => {
  res.send('Get user list.')
})
router.post('/user/add', (req, res) => {
  res.send('Add new user.')
})

// 向外导出路由对象
module.exports = router
```

注册路由模块：

```js
const express = require('express')
const router = require('./router')

const app = express()

// 注册路由模块，添加访问前缀
app.use('/api', router)

app.listen(80, () => {
  console.log('http://127.0.0.1')
})
```

## Express 中间件

- 中间件是指流程的中间处理环节
- 服务器收到请求后，可先调用中间件进行预处理
- 中间件是一个函数，包含 `req, res, next` 三个参数，`next()` 参数把流转关系交给下一个中间件或路由

中间件注意事项；

- 在注册路由之前注册中间件（错误级别中间件除外）
- 中间件可连续调用多个
- 别忘记调用 `next()` 函数
- `next()` 函数后别写代码
- 多个中间件共享 `req`、 `res`对象

### 全局中间件

- 通过 `app.use()` 定义的中间件为全局中间件

```js
const express = require('express')
const app = express()

// 定义第一个全局中间件
app.use((req, res, next) => {
  console.log('调用了第1个全局中间件')
  next()
})
// 定义第二个全局中间件
app.use((req, res, next) => {
  console.log('调用了第2个全局中间件')
  next()
})

app.get('/user', (req, res) => {
  res.send('User page.')
})

app.listen(80, () => {
  console.log('http://127.0.0.1')
})
```

### 局部中间件

```js
const express = require('express')
const app = express()

// 定义中间件函数
const mw1 = (req, res, next) => {
  console.log('调用了第一个局部生效的中间件')
  next()
}

const mw2 = (req, res, next) => {
  console.log('调用了第二个局部生效的中间件')
  next()
}

// 两种定义局部中间件的方式
app.get('/hello', mw2, mw1, (req, res) => res.send('hello page.'))
app.get('/about', [mw1, mw2], (req, res) => res.send('about page.'))

app.get('/user', (req, res) => res.send('User page.'))

app.listen(80, function () {
  console.log('Express server running at http://127.0.0.1')
})
```

### 中间件分类

1. 应用级别的中间件

- 通过 `app.use()` 或 `app.get()` 或 `app.post()` ，绑定到 `app` 实例上的中间件

2. 路由级别的中间件

- 绑定到 `express.Router()` 实例上的中间件，叫做路由级别的中间件。用法和应用级别中间件没有区别。应用级别中间件是绑定到 `app` 实例上，路由级别中间件绑定到 `router` 实例上。

```js
const app = express()
const router = express.Router()

router.use(function (req, res, next) {
  console.log(1)
  next()
})

app.use('/', router)
```

3. 错误级别的中间件

- 用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题
- 错误级别中间件的处理函数中，必须有 4 个形参，形参顺序从前到后分别是 `(err, req, res, next)` 。
- 错误级别的中间件必须注册在所有路由之后

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  throw new Error('服务器内部发生了错误！')
  res.send('Home page.')
})

// 定义错误级别的中间件，捕获整个项目的异常错误，从而防止程序的崩溃
app.use((err, req, res, next) => {
  console.log('发生了错误！' + err.message)
  res.send('Error：' + err.message)
})

app.listen(80, function () {
  console.log('Express server running at http://127.0.0.1')
})
```

4. Express 内置中间件

自 Express 4.16.0 版本开始，Express 内置了 3 个常用的中间件，极大的提高了 Express 项目的开发效率和体验：

- `express.static` 快速托管静态资源的内置中间件，例如： HTML 文件、图片、CSS 样式等（无兼容性）
- `express.json` 解析 JSON 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
- `express.urlencoded` 解析 URL-encoded 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）

```js
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
```

5. 第三方中间件

## CORS 跨域资源共享

### cors 中间件解决跨域

- 安装中间件：`npm install cors`
- 导入中间件：`const cors = require('cors')`
- 配置中间件：`app.use(cors())`

### CORS

- CORS（Cross-Origin Resource Sharing，跨域资源共享）解决跨域，是通过 HTTP 响应头决定浏览器是否阻止前端 JS 代码跨域获取资源
- 浏览器的同源安全策略默认会阻止网页“跨域”获取资源。但如果接口服务器配置了 CORS 相关的 HTTP 响应头，就可解除浏览器端的跨域访问限制
- CORS 主要在服务器端进行配置。客户端浏览器无须做任何额外的配置，即可请求开启了 CORS 的接口。
- CORS 在浏览器中有兼容性。只有支持 XMLHttpRequest Level2 的浏览器，才能正常访问开启了 CORS 的服务端接口（例如：IE10+、Chrome4+、FireFox3.5+）。

### CORS 常见响应头

- `Access-Control-Allow-Origin`：制定了允许访问资源的外域 URL

```js
res.setHeader('Access-Control-Allow-Origin', 'http://bruceblog.io')
res.setHeader('Access-Control-Allow-Origin', '*')
```

- `Access-Control-Allow-Headers`
- 默认情况下，CORS 仅支持客户端向服务器发送如下的 9 个请求头：`Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width 、Content-Type （值仅限于 text/plain、multipart/form-data、application/x-www-form-urlencoded 三者之一）`
- 如果客户端向服务器发送了额外的请求头信息，则需要在服务器端，通过 A`ccess-Control-Allow-Headers` 对额外的请求头进行声明，否则这次请求会失败！

```js
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Custom-Header')
```

- `Access-Control-Allow-Methods`
- 默认情况下，CORS 仅支持客户端发起 GET、POST、HEAD 请求。如果客户端希望通过 PUT、DELETE 等方式请求服务器的资源，则需要在服务器端，通过 `Access-Control-Alow-Methods` 来指明实际请求所允许使用的 HTTP 方法

```js
res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, HEAD')
res.setHEader('Access-Control-Allow-Methods', '*')
```

### CORS 请求分类

#### 简单请求

- 请求方式：GET、POST、HEAD 三者之一
- HTTP 头部信息不超过以下几种字段：无自定义头部字段、Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width 、Content-Type（只有三个值 application/x-www-formurlencoded、multipart/form-data、text/plain）

#### 预检请求

- 请求方式为 GET、POST、HEAD 之外的请求 Method 类型
- 请求头中包含自定义头部字段
- 向服务器发送了 application/json 格式的数据

在浏览器与服务器正式通信之前，浏览器会先发送 OPTION 请求进行预检，以获知服务器是否允许该实际请求，所以这一次的 OPTION 请求称为“预检请求”。服务器成功响应预检请求后，才会发送真正的请求，并且携带真实数据
