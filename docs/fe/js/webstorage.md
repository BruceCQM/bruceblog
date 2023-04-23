# 浏览器本地存储 Web Storage

:::tip 浏览器本地存储
浏览器本地存储包括两个对象：`sessionStorage` 和 `localStorage`，它们都是 `Storage` 的实例对象。

```js
window.localStorage instanceof Storage // true
```

:::

## 基本使用

访问数据：`getItem()`

添加、修改数据：`setItem()`

删除数据：`removeItem()`

清空数据：`clear()`

获取给定位置的键名：`key()`

```js
// 以 localStorage 为例，sessionStorage 都一样
// 添加数据
localStorage.setItem('name', 'BruceBlog')
localStorage.setItem('age', 2333)

// 修改数据
localStorage.setItem('age', 520)

// 读取数据
localStorage.getItem('age')

// 删除数据
localStorage.removeItem('name')

// 清空数据
localStorage.clear()

// 遍历所有值，不知道是按什么顺序排列的
for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i)
  let value = localStorage.getItem(key)
  console.log(`key: ${key}, value: ${value}`)
}
```

## 注意事项

只能够存储字符串，不是字符串的会调用 `toString()` 方法转成字符串。

如果想要存储对象，需要使用 `JSON.stringify()` 转成 JSON 字符串再存储，以后再用 `JSON.parse()` 还原成对象。

如果无法转成字符串，则会报错。比如 `Symbol` 类型的变量无法转成字符串。

```js
let obj = { book: 'HTTP', price: 46 }
let obj2 = {}
function fn() {}

localStorage.setItem(obj, 'object') // '[object Object]': 'object'
localStorage.setItem('func', fn) // 'func': 'function fn() {}'

localStorage.setItem('info', JSON.stringify(obj)) // 'info': '{\"book\":\"HTTP\",\"price\":46}'

localStorage.getItem(obj2) // 'object'，obj2 会被转成 '[object Object]'

localStorage.setItem('symbol', Symbol(666)) // Uncaught TypeError: Cannot convert a Symbol value to a string
```

## `sessionStorage` 与 `localStorage` 对比

`sessionStorage` 是跨会话存储机制，`localStorage` 是永久存储机制。

作用时间：`sessionStorage` 在窗口关闭后就会失效，`localStorage` 是永久存储，除非手动通过 JS 删除或清除浏览器缓存。

作用范围：`sessionStorage` 的数据只能在**同源**（协议域名端口号相同）、**同一个窗口**共享，`localStorage` 的数据在**同源、不同窗口共享（同一个浏览器）**。
