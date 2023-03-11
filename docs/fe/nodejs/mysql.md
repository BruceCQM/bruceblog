# 数据库和身份认证

## Node 操作 mysql

### 配置 mysql 模块

1. 安装 mysql 模块

```bash
npm install mysql
```

2. 建立连接

```js
const mysql = require('mysql')

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'test',
})
```

3. 测试是否正常工作

```js
db.query('select 1', (err, results) => {
  if (err) return console.log(err.message)
  console.log(results)
})
```

### 操作 mysql 数据库

1. 查询数据

```js
db.query('select * from users', (err, results) => {
  ...
})
```

2. 插入数据

```js
// ? 表示占位符
const sql = 'insert into users values(?, ?)'
// 使用数组的形式为占位符指定具体的值
db.query(sql, [username, password], (err, results) => {
  if (err) return console.log(err.message)
  if (results.affectedRows === 1) console.log('插入成功')
})
```

向表中新增数据时，如果数据对象的每个属性和数据表的字段一一对应，则可以通过如下方式快速插入数据：

```js
const user = {username:'Bruce', password:'55520'}
const sql = 'insert into users set ?'
db.query(sql, user, (err, results) => {
  ...
})
```

3. 更新数据

```js
const sql = 'update users set username=?, password=? where id=?'
db.query(sql, [username, password, id], (err, results) => {
  ...
})
```

快捷方式：

```js
const user = {id:7,username:'Bruce',password:'55520'}
const sql = 'update users set ? where id=?'
db.query(sql, [user, user.id], (err, results) => {
  ...
})
```

4. 删除数据

```js
const sql = 'delete from users where id=?'
db.query(sql, id, (err, results) => {
  ...
})
```

使用 delete 语句会真正删除数据，保险起见，使用标记删除的形式，模拟删除的动作。即在表中设置状态字段，标记当前的数据是否被删除。

```js
db.query('update users set status=1 where id=?', 7, (err, results) => {
  ...
})
```

## Web 开发模式

### 服务端渲染

服务器发送给客户端的 HTML 页面，是在服务器通过字符串的拼接动态生成的。因此客户端不需要使用 Ajax 额外请求页面的数据。

```js
app.get('/index.html', (req, res) => {
  const user = { name: 'Bruce', age: 29 }
  const html = `<h1>username:${user.name}, age:${user.age}</h1>`
  res.send(html)
})
```

优点：

- 前端耗时短。浏览器只需直接渲染页面，无需额外请求数据。
- 有利于 SEO。服务器响应的是完整的 HTML 页面内容，有利于爬虫爬取信息。

缺点：

- 占用服务器资源。服务器需要完成页面内容的拼接，若请求比较多，会对服务器造成一定访问压力。
- 不利于前后端分离，开发效率低。

### 前后端分离

前后端分离的开发模式，依赖于 Ajax 技术的广泛应用。后端只负责提供 API 接口，前端使用 Ajax 调用接口。

优点：

- 开发体验好。前端专业页面开发，后端专注接口开发。
- 用户体验好。页面局部刷新，无需重新请求页面。
- 减轻服务器的渲染压力。页面最终在浏览器里生成。

缺点：

- 不利于 SEO。完整的 HTML 页面在浏览器拼接完成，因此爬虫无法爬取页面的有效信息。Vue、React 等框架的 SSR（server side render）技术能解决 SEO 问题。

### 如何选择

- 企业级网站，主要功能是展示，没有复杂交互，且需要良好的 SEO，可考虑服务端渲染
- 后台管理项目，交互性强，无需考虑 SEO，可使用前后端分离
- 为同时兼顾首页渲染速度和前后端分离开发效率，可采用首屏服务器端渲染+其他页面前后端分离的开发模式

## 身份认证

### Session 认证机制

服务端渲染推荐使用 Session 认证机制

#### Session 工作原理

![session](./images/Session.png)

#### Express 中使用 Session 认证

1. 安装 express-session 中间件

```bash
npm install express-session
```

2. 配置中间件

```js
const session = require('express-session')
app.use(
  session({
    secret: 'Bruce', // secret 的值为任意字符串
    resave: false,
    saveUninitalized: true,
  })
)
```

3. 向 session 中存数据

中间件配置成功后，可通过 `req.session` 访问 session 对象，存储用户信息

```js
app.post('/api/login', (req, res) => {
  req.session.user = req.body
  req.session.isLogin = true

  res.send({ status: 0, msg: 'login done' })
})
```

4. 从 session 取数据

```js
app.get('/api/username', (req, res) => {
  if (!req.session.isLogin) {
    return res.send({ status: 1, msg: 'fail' })
  }
  res.send({ status: 0, msg: 'success', username: req.session.user.username })
})
```

5. 清空 session

```js
app.post('/api/logout', (req, res) => {
  // 清空当前客户端的session信息
  req.session.destroy()
  res.send({ status: 0, msg: 'logout done' })
})
```

### JWT 认证机制

前后端分离推荐使用 JWT（JSON Web Token）认证机制，是目前最流行的跨域认证解决方案

#### JWT 工作原理

Session 认证的局限性：

- Session 认证机制需要配合 Cookie 才能实现。由于 Cookie 默认不支持跨域访问，所以，当涉及到前端跨域请求后端接口的时候，需要做很多额外的配置，才能实现跨域 Session 认证。
- 当前端请求后端接口不存在跨域问题的时候，推荐使用 Session 身份认证机制。
- 当前端需要跨域请求后端接口的时候，不推荐使用 Session 身份认证机制，推荐使用 JWT 认证机制

JWT 工作原理图：

用户的信息通过 Token 字符串的形式，保存在客户端浏览器中。服务器通过还原 Token 字符串的形式来认证用户的身份。

![JWT](./images/JWT.png)

JWT 组成部分：

- Header、Payload、Signature
- Payload 是真正的用户信息，加密后的字符串
- Header 和 Signature 是安全性相关部分，保证 Token 安全性
- 三者使用 `.` 分隔

```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInVzZXJuYW1lIjoiQnJ1Y2UiLCJwYXNzd29yZCI6IiIsIm5pY2tuYW1lIjoiaGVsbG8iLCJlbWFpbCI6InNjdXRAcXEuY29tIiwidXNlcl9waWMiOiIiLCJpYXQiOjE2NDE4NjU3MzEsImV4cCI6MTY0MTkwMTczMX0.bmqzAkNSZgD8IZxRGGyVlVwGl7EGMtWitvjGD-a5U5c
```

JWT 使用方式：

- 客户端会把 JWT 存储在 localStorage 或 sessionStorage 中
- 此后客户端与服务端通信需要携带 JWT 进行身份认证，将 JWT 存在 HTTP 请求头 Authorization 字段中
- 加上 Bearer 前缀

```
Authorization: Bearer <token>
```

#### Express 使用 JWT

1. 安装

- jsonwebtoken 用于生成 JWT 字符串
- express-jwt 用于将 JWT 字符串解析还原成 JSON 对象

```bash
npm install jsonwebtoken express-jwt
```

2. 定义 secret 密钥

- 为保证 JWT 字符串的安全性，防止其在网络传输过程中被破解，需定义用于加密和解密的 secret 密钥
- 生成 JWT 字符串时，使用密钥加密信息，得到加密好的 JWT 字符串
- 把 JWT 字符串解析还原成 JSON 对象时，使用密钥解密

```js
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')

// 密钥为任意字符串
const secretKey = 'Bruce'
```

3. 生成 JWT 字符串

```js
app.post('/api/login', (req, res) => {
  ...
  res.send({
    status: 200,
    message: '登录成功',
    // jwt.sign() 生成 JWT 字符串
    // 参数：用户信息对象、加密密钥、配置对象-token有效期
    // 尽量不保存敏感信息，因此只有用户名，没有密码
    token: jwt.sign({username: userInfo.username}, secretKey, {expiresIn: '10h'})
  })
})
```

4. JWT 字符串还原为 JSON 对象

- 客户端访问有权限的接口时，需通过请求头的 `Authorization` 字段，将 Token 字符串发送到服务器进行身份认证
- 服务器可以通过 express-jwt 中间件将客户端发送过来的 Token 解析还原成 JSON 对象

```js
// unless({ path: [/^\/api\//] }) 指定哪些接口无需访问权限
app.use(expressJWT({ secret: secretKey }).unless({ path: [/^\/api\//] }))
```

5. 获取用户信息

- 当 express-jwt 中间件配置成功后，即可在那些有权限的接口中，使用 `req.user` 对象，来访问从 JWT 字符串中解析出来的用户信息

```js
app.get('/admin/getinfo', (req, res) => {
  console.log(req.user)
  res.send({
    status: 200,
    message: '获取信息成功',
    data: req.user,
  })
})
```

6. 捕获解析 JWT 失败后产生的错误

- 当使用 express-jwt 解析 Token 字符串时，如果客户端发送过来的 Token 字符串过期或不合法，会产生一个解析失败的错误，影响项目的正常运行
- 通过 Express 的错误中间件，捕获这个错误并进行相关的处理

```js
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.send({ status: 401, message: 'Invalid token' })
  }
  res.send({ status: 500, message: 'Unknown error' })
})
```
