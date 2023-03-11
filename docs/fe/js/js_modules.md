# JS 模块化

## 模块化概念

- 模块化是指解决一个复杂问题时，自顶向下逐层把系统划分为若干模块的过程，模块是可组合、分解和更换的单元。
- 模块化可提高代码的复用性和可维护性，实现按需加载。
- 模块化规范是对代码进行模块化拆分和组合时需要遵守的规则，如使用何种语法格式引用模块和向外暴露成员。

## CommonJS

每个模块内部都有一个 `module` 变量代表当前模块，存储相关信息。

通过 `module.exports` 对象把模块内部成员共享出去，供外界使用。加载模块得到的就是 `module.exports` 指向的对象。

默认情况下，`exports` 和 `module.exports` 指向同一个对象。最终导出的结果以 `module.exports` 指向的对象为准。

Nodejs 用的是 CommonJS 模块化规范。

### 基本用法

```js
// m1.js
module.exports = 'module1'

// m2.js
exports.name = 'Bruce'
exports.age = 11

// m3.js
module.exports = {
  car: 'Benz',
  price: 50,
}

exports = {
  name: 'Benz',
  age: 50,
}

// app.js
const m1 = require('./src/m1')
const m2 = require('./src/m2')
const m3 = require('./src/m3')
const fs = require('fs')
const axios = require('axios')

console.log(m1) // 'module1'
console.log(m2) // {name: 'Bruce', age: 11}
console.log(m3) // {car: 'Benz', price: 50}
```

### 加载机制

#### 重复加载

模块第一次加载后会被缓存，即多次调用 `require()` 不会导致模块的代码被执行多次，提高模块加载效率，且模块是单例。

```js
// m3.js
console.log('m3')
module.exports = {
  car: 'Benz',
  price: 50,
}

// app.js
let a = require('./src/m3')
let b = require('./src/m3') // m3 只会打印一次

console.log(a === b) // true
```

可删除模块缓存：

```js
// 删除指定模块的缓存
delete require.cache[require.resolve('./src/m3')]

// 删除所有模块的缓存
Object.keys(require.cache).forEach(function (key) {
  delete require.cache[key]
})
```

#### 内置模块加载

内置模块加载优先级最高。

#### 自定义模块加载

加载自定义模块时，路径要以 `./` 或 `../` 开头，否则会作为内置模块或第三方模块加载。

导入自定义模块时，若省略文件扩展名，则 Node.js 会按顺序尝试加载文件：

- 按确切的文件名加载
- 补全 `.js` 扩展名加载
- 补全 `.json` 扩展名加载
- 补全 `.node` 扩展名加载
- 报错

#### 第三方模块加载

- 若导入第三方模块， Node.js 会从**当前模块的父目录**开始，尝试从 `/node_modules` 文件夹中加载第三方模块。
- 如果没有找到对应的第三方模块，则移动到再**上一层父目录**中，进行加载，直到**文件系统的根目录**。

例如，假设在 `C:\Users\bruce\project\foo.js` 文件里调用了 `require('tools')`，则 Node.js 会按以下顺序查找：

- `C:\Users\bruce\project\node_modules\tools`
- `C:\Users\bruce\node_modules\tools`
- `C:\Users\node_modules\tools`
- `C:\node_modules\tools`

#### 目录作为模块加载

当把目录作为模块标识符进行加载的时候，有三种加载方式：

- 在被加载的目录下查找 `package.json` 的文件，并寻找 `main` 属性，作为 `require()` 加载的入口
- 如果没有 `package.json` 文件，或者 `main` 入口不存在或无法解析，则 Node.js 将会试图加载目录下的 `index.js` 文件。
- 若失败则报错

### 浏览器玩 CommonJS

构建项目结构：

    ├── dist # 打包文件所在目录
    ├── src
    │   ├── m1.js
    │   ├── m2.js
    │   └── m3.js
    ├── app.js
    ├── index.html
    └── package.json

安装 [browserify](https://browserify.org/)，它把 CommonJS 语法转换成浏览器能执行的代码：

```shell
# 先全局安装
npm install -g browserify
# 再局部安装
npm install browserify --save-dev
```

打包代码：

```shell
browserify src/app.js -o dist/bundle.js
```

页面引入打包好的代码：

```html
<script src="./dist/bundle.js"></script>
```

## ES6 模块

ES6 使用 `export` 和 `import` 导出和导入模块。

### 导出模块

一个模块就是一个独立的 JS 文件，该文件内的变量外部无法获取。若希望能让外部获取模块内的变量，则要用 `export` 关键字暴露变量。

```js
// 分别暴露（命名行内导出）
export const age = 66
export let name = 'Bruce'
export function sayHello() {
  console.log('hello from m1.js')
}
```

```js
// 统一暴露（命名子句导出）
let book = '红宝书'
let price = 129
let bookInfo = {
  author: 'Matt Frisbie',
  translator: '李松峰',
}
// 可以使用 as 关键字重命名，改名后原来的名字就不能用了
export { book, price, bookInfo as bookMessage }
```

```js
// 默认暴露（默认导出）
export default {
  color: 'red',
  edition: 4,
}
```

一个模块只能有一个默认导出，重复的默认导出会出错。

```js
// SyntaxError
const obj = { age: 44 }
export default obj
export default {
  name: 'Modules'
}
```

默认暴露和统一暴露可以组合到一起。

```js
const foo = 'foo'
const bar = 'bar'

// foo 是默认暴露，bar 是统一暴露
export { foo as default, bar }
```

本质上默认暴露是导出名为 `default` 的变量，导入的时候可以任意取名。因此后面不能跟变量声明语句。

```js
// 等同
export { foo as default }
export default foo

// 等同
import xxx from 'module.js'
import {default as xxx} from 'module.js'

// 报错
export default let a = 1
```

三种导出方式可以在同一个模块同时使用。

```js
// 默认暴露
export default {
  color: 'red',
  edition: 4,
}

// 统一暴露
let bar = 666
let foo = 'foo'
export { bar, foo }

// 分别暴露
export let msg = 'good'
```

`export` 导出的是值的引用，导入值会随导出值的变化而改变，也就是通过接口可得到模块内部实时的值。

```js
// m1.js
export let name = 'Bruce'
setTimeout(() => {
  name = 'good'
}, 1000)

import { name } from './m1.js'
console.log(name) // 'Bruce'
setTimeout(() => {
  console.log(name)
}, 1500) // 'good'
```

### 导入模块

使用 `import` 关键字导入模块。

```js
// 导入通过分别暴露和统一暴露导出的接口
import { name, age, sayHello } from './m1.js'
// 导入通过默认暴露导出的接口，变量名自取
import defaultValue from './m3.js'
// 混合导出的接口
import defaultValue, { book, price, bookInfo } from './m3.js'
```

导入模块时可以对变量重命名。

```js
import { bookInfo as bookMessage } from './m2.js'
```

可以使用 `*` 进行模块的整体导入，此时必须进行重命名。`*` 是一个对象，所有导入值都保存在这个对象上。

```js
import * as person from './m1.js'

console.log(person.name)
console.log(person.age)
person.sayHello()
```

`import` 命令会提升到模块顶部再执行，它是在编译阶段执行的，在代码运行之前。

由于它是静态执行，因此无法使用在运行时才能得到结果的结构。

```js
// 不会报错，正常运行
sayHello()
import { sayHello } from './m1.js'

// 报错
import { 'say' + 'Hello' } from './m1.js'
```

### 浏览器玩 ES6 模块

构建项目结构：

    ├── lib # 转码文件所在目录
    ├── src
    │   ├── m1.js
    │   ├── m2.js
    │   ├── m3.js
    │   └── app.js
    ├── babel.config.json
    ├── index.html
    └── package.json

安装 [Babel](https://www.babeljs.cn/)转码器，它可将 ES6 语法转成 ES5 语法，让浏览器得以执行。

```shell
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

在 `babel.config.json` 文件配置 `Babel`。`presets` 字段设置转码规则。

```json
{
  "presets": ["@babel/env"]
}
```

将 `src` 的代码编译到 `lib` 目录。

```shell
./node_modules/.bin/babel src --out-dir lib
```

编译后的代码还包含 `require` 等 CommonJS 关键字，浏览器还不能识别，因此还需要安装 [browserify](https://browserify.org/) 进行二次转换。

```shell
npm install -g browserify
```

打包代码：

```shell
browserify lib/app.js -o lib/bundle.js
```

页面引入打包好的代码：

```html
<script src="./lib/bundle.js"></script>
```

可以在浏览器自由玩 ES6 模块了！:relaxed:
