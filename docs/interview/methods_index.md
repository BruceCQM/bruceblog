# JS 常用方法用法

## Object.defineProperty()

`Object.defineProperty()` 是 JavaScript 中用于定义对象属性的一个方法。它允许你精确地控制属性的各种特性，包括是否可枚举、是否可配置、是否可写以及属性的值等。

这个方法接收三个参数：对象、属性名（字符串）和一个描述符对象。

#### 一、参数

- 对象：要在其上定义属性的对象。
- 属性名：要定义或修改的属性的名称，以字符串形式表示。
- 描述符对象：一个包含属性特性的对象。

#### 二、描述符对象

描述符对象可以有两种主要的形式：数据描述符和存取描述符。它们都可以包含以下属性：

1、数据描述符
- value：属性的值，默认为 undefined。
- writable：属性的值是否可以被重新赋值，默认为 false。

2、存取描述符
- get：一个函数，当读取属性时调用。它的返回值会被用作属性的值。
- set：一个函数，当属性被赋值时调用。它接收一个参数（即新的属性值）。

3、通用属性（可以和数据、存取描述符搭配使用）
- enumerable：属性是否可以被枚举（如在 for...in 或 Object.keys() 中），默认为 false。
- configurable：属性是否可以被删除，默认为 false。

注意：数据描述符和存取描述符不能同时使用。如果一个描述符对象同时包含 value 或 writable 和 get 或 set，那么会抛出一个错误 `TypeError: Invalid property descriptor. Cannot both specify accessors and a value or writable attribute`。

#### 三、使用示例

1、定义一个简单的属性

```js
const obj = {};

Object.defineProperty(obj, 'property1', {
  value: 42,
  writable: false
});

console.log(obj.property1); // 输出 42
obj.property1 = 77; // 没有错误抛出，但是在非严格模式下失败，严格模式下会抛出错误
console.log(obj.property1); // 仍然输出 42
```

2、定义一个带有 getter 和 setter 的属性

```js
const obj = {
  _property2: 'Hello'
};

Object.defineProperty(obj, 'property2', {
  get: function() {
    return this._property2;
  },
  set: function(value) {
    this._property2 = value;
  },
  enumerable: true,
  configurable: true
});

console.log(obj.property2); // 输出 'Hello'
obj.property2 = 'World';
console.log(obj.property2); // 输出 'World'
```

3、使用 enumerable 和 configurable

```js
const obj = {};

Object.defineProperty(obj, 'property3', {
  value: 'value3',
  enumerable: false, // 不可枚举
  configurable: true // 可配置
});

console.log(Object.keys(obj)); // 输出 []，因为 property3 不可枚举
delete obj.property3; // 成功删除，因为 property3 是可配置的
```