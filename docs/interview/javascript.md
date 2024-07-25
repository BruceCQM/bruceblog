# JavaScript

## 1. JS 有哪些数据类型

7 大基本数据类型：`Number、String、Boolean、Null、Undefined、Symbol、BigInt`。

引用数据类型：`Object`。

`Array、Date、RegExp、Map、Set` 等本质上都属于 `Object`，`typeof` 出来的结果都是 `object`。

:::tip 拓展
1、`BigInt` 是否为基本数据类型存在争议。有一种说法是，`BigInt` 不是 JS 的基本数据类型，它是 ES10 新增的数据类型，表示任意大的整数，本质上还是属于 `Number`的数据类型。

2、基本数据类型使用的是栈内存，引用数据类型使用的是堆内存。

3、基本数据类型大小固定、所占内存空间小，因此在栈中存储。

4、引用数据类型大小不固定、所占内存空间较大，若在栈中存储，会影响程序的运行性能，因此在堆中存储。同时，引用数据类型在栈中存储的是指针，指向堆中实体的起始地址。
:::

## 2. 怎么判断 JS 数据类型

### `typeof` 判断

```js
// 7大基本数据类型
typeof 123 // number
typeof 'abc' // string
typeof true // boolean
typeof undefined // undefined
typeof null // object
typeof Symbol() // symbol
typeof BigInt(123) // bigint

// 引用数据类型
typeof {} // object
typeof [] // object
typeof new Date() // object
typeof /abc/ // object
typeof new Map() // object
typeof new Set() // object
typeof function () {} // function，特殊情况
```

### `instanceof` 判断

`instanceof` 通过判断构造函数的 `prototype` 原型对象，是否在实例对象的原型链上，来判断实例对象的数据类型。

该方法可以正确判断引用数据类型，但不能判断基本数据类型。

```js
666 instanceof Number // false
'str' instanceof String // false
true instanceof Boolean // false
Symbol(123) instanceof Symbol // false
BigInt(123) instanceof BigInt // false

[] instanceof Array // true
{} instanceof Object // true
function () {} instanceof Function // true
new Date() instanceof Date // true
/abc/ instanceof RegExp // true
new Map() instanceof Map // true
new Set() instanceof Set // true
```

### `constructor` 判断

`constructor` 属性返回实例对象的构造函数，可以用来判断基本数据类型。

```js
var a

// 基本数据类型
a = 123
a.constructor === Number // true
a = 'abc'
a.constructor === String // true
a = true
a.constructor === Boolean // true
Symbol(123).constructor === Symbol // true`
BigInt(123).constructor === BigInt // true

// 引用数据类型
a = []
a.constructor === Array // true
a = {}
a.constructor === Object // true
a = function () {}
a.constructor === Function // true
a = new Date()
a.constructor === Date // true
a = /abc/
a.constructor === RegExp // true
```

### `Object.prototype.toString.call` 判断

`Object.prototype.toString.call` 方法用于将一个对象转换为字符串，返回一个字符串。

```js
Object.prototype.toString.call(123) // [object Number]
Object.prototype.toString.call('abc') // [object String]
Object.prototype.toString.call(true) // [object Boolean]
Object.prototype.toString.call(undefined) // [object Undefined]
Object.prototype.toString.call(null) // [object Null]
Object.prototype.toString.call(Symbol(123)) // [object Symbol]
Object.prototype.toString.call(BigInt(123)) // [object BigInt]
Object.prototype.toString.call({}) // [object Object]
Object.prototype.toString.call([]) // [object Array]
Object.prototype.toString.call(function () {}) // [object Function]
```

:::tip 为何不直接使用 obj.toString 的形式判断？
`toString()` 是 `Object` 原型的方法，其功能是返回对象的具体类型。

但 `Array, Function` 等构造函数的原型都重写了 `toString` 方法，因此实例对象直接调用 `toString` 使用的是重写后的方法，而非 `Object` 原型上的 `toString`。

```js
arr = [1, 2, 'hello']
arr.toString() // '1,2,hello'

func = function () {
  console.log('hello')
}
func.toString() // 'function () { console.log('hello') }'

a = 123
a.toString() // '123'
a = true
a.toString() // 'true'
```

:::

## 3. 基本数据类型为何能调用方法？

基本数据类型都有其对应的包装类，能够调用方法是因为进行了自动封装。

## 4. `null` 和 `undefined` 的区别

相同点：

`undefined` 和 `null` 都是基本数据类型，都只有一个值，`undefined` 和 `null`。

不同点：

- `undefined` 代表未定义，使用 `var` 定义变量但没赋值就是 `undefined`，函数没有返回值则返回的也是 `undefined`。`null` 代表空对象，一般用于初始化可能为对象的变量。

- `undefined` 可以放在赋值语句的左边，`null` 不可以。可以通过 `void 0` 安全地获得 `undefined`。

```js
undefined = 3; // 不报错
null = 3; // Uncaught SyntaxError: Invalid left-hand side in assignment

void 0 === undefined; // true
```

- `typeof undefined` 返回 `undefined`。`typeof null` 返回 `object`，这是个历史遗留问题。

- `undefined == null` 返回 true，`undefined === null` 返回 false。

## 5. `new` 一个构造函数发生什么事

1. 创建一个空对象。

2. 将这个空对象的 `__proto__` 属性指向构造函数的原型对象 `prototype`。

3. 将构造函数的 `this` 指向这个新对象，并执行构造函数的代码。

4. 如果构造函数有返回值，则返回该值。如果没有，则返回这个创建的新对象。

一个标准的 `new` 过程效果如下。

```js
function Person(name) {
  this.name = name
}
Person.prototype.sayHello = function () {
  console.log('hello, my name is ' + this.name)
}

const person = new Person('kimmy')

person.name // kimmy
person.sayHello() // hello, my name is kimmy
```

手动实现一个 `new` 运算。

```js
function myNew() {
  // 创建空对象
  const obj = {}
  // 获取构造函数，约定第一个参数是构造函数
  const constructorFunc = Array.prototype.shift.call(arguments)
  // 空对象的__proto__指向构造函数的prototype
  obj.__proto__ = constructorFunc.prototype
  // 构造函数的this指向空对象，并执行构造函数
  const result = constructorFunc.apply(obj, arguments)
  // 如果构造函数有返回值，则返回该值，否则返回空对象
  return typeof result === 'object' ? result : obj
}

const myPerson = myNew(Person, 'kimmy')
person.name // kimmy
person.sayHello() // hello, my name is kimmy
```

## 6. `new` 一个箭头函数会怎样

箭头函数没有 `this`，没有 `prototype`，也不能使用 `arguments` 参数，无法 `new` 一个箭头函数。

## 7. 原型链和原型对象

### 如何理解原型链？

:::tip 回答思路
首先说什么是原型，为什么设计原型（共享属性和方法），再说属性和方法的查找顺序，自然而然谈到了原型链。原型链可以隐身到继承，继承结合构造函数和原型。
:::

1、为什么设计原型

当我们使用 new 构造函数的方式创建实例时，定义在构造函数内部的方法会在每个实例里都创建一遍，这样一来就造成了内存空间的浪费，因为这些方法的功能都是相同的，没有必要多次创建。

因此原型就被设计出来解决这个问题，每个构造函数都有一个原型对象 prototype，在原型里定义的方法和属性可以被所有的实例对象共享。因此，通过将方法定义在原型对象 prototype 上，就能避免方法的重复创建。

2、原型链是什么

每个实例对象都有一个 `__proto__` 属性，指向它的构造函数的原型对象 prototype，而原型对象 prototype 它本身也是一个对象，它也有 `__proto__` 属性，指向它自己的构造函数的原型对象，这样一层一层往上走，就形成了原型链。原型链的终点是 Object 构造函数的原型对象，它的 `__proto__` 属性指向 null。

3、属性和方法的查找顺序

原型链实际上提供了一条查询属性和方法的路径，当我们要访问一个对象的属性时，首先看这个对象本身是否存在这个属性，如果没有，再沿着原型链查找原型对象，一直到原型链的终点为止。如果都没有，则返回 undefined。

![原型链](./images/prototype_chain.png)

### Function、Object 之间微妙的关系

先看一道题，以下的代码输出什么？

```js
Object instanceof Function
Function instanceof Function
Object instanceof Object
Function instanceof Object
```

回顾一下 instanceof 的工作原理，它是判断构造函数的 prototype 属性是否存在于实例对象的原型链上。

Object、Function 是函数对象，可以看作是 new Function() 产生的，而 Object 构造函数的 prototype 存在于所有原型链上，因此上述代码都打印 true。

```js
Object instanceof Function // true
Function instanceof Function // true
Object instanceof Object // true
Function instanceof Object // true
```

下面看更复杂的例子。

```js
Function.__proto__ === Function.prototype

Function.__proto__.__proto__ === Object.prototype

Object.__proto__ === Function.prototype

Object.__proto__.__proto__ === Object.prototype
```

- Function.prototype 可以看作是一个对象，由 Object 构造函数创建。

- Object 可以看作一个函数，由 Function 构造函数创建。

- Function 可以 看作一个函数对象，由 Function 构造函数创建。

```js
// Function是一个函数对象，由Function构造函数创建
Function.__proto__ === Function.prototype // true

// Funtcion.prototype本身是一个对象，由Object构造函数创建
Function.__proto__.__proto__ === Object.prototype // true
Function.prototype.__proto__ === Object.prototype // true

// 原型对象的constructor指向构造函数
Function.__proto__.constructor === Function // true

// Object是一个函数对象，由Function构造函数创建
Object.__proto__ === Function.prototype // true

// Object.prototype本身是一个对象，由Object构造函数创建
Object.__proto__.__proto__ === Object.prototype // true
```

一图胜千言：

![原型链](./images/js/prototype-chain.png)

[浅谈 Function.prototype 和函数、Object 的关系](https://blog.csdn.net/Pang_Yue__Fairy/article/details/130570056){link=static}

### 创建对象的方法及它们的proto

1. 字面量创建

```js
const obj = {};
obj.__proto__ === Object.prototype // true
```

2. new Object创建

```js
const obj = new Object();
obj.__proto__ === Object.prototype // true
```

3. Object.create()创建

Object.create()创建一个对象，它的 __proto__ 指向第一个参数。

```js
const obj = Object.create({});
obj.__proto__; // {}
```

4. new构造函数创建

new 构造函数创建的对象，它的 __proto__ 指向构造函数的 prototype。

```js
function Person() {}
const person = new Person();
person.__proto__ === Person.prototype // true
```

### 和原型相关的方法

- Object.getPrototypeOf(obj)：获取对象的原型。

- Object.setPrototypeOf(obj, prototype)：设置对象的原型。

- obj.hasOwnProperty(prop)：判断对象是否包含自由属性 prop。

- obj.isPrototypeOf(obj2)：判断 obj2 是否在 obj 的原型链上，和 instanceof 类似。

- Object.create(obj)：创建一个新对象，它的原型指向obj。

实现继承：子类通过原型链继承父类的属性和方法。

```js
function Animal(name) {
 this.name = name;
}

Animal.prototype.sayName = function () {
 console.log(`My name is ${this.name}`);
};

function Dog(name, breed) {
 Animal.call(this, name); // 继承⽗类的属性
 this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype); // 继承⽗类的⽅法
Dog.prototype.constructor = Dog;
Dog.prototype.sayBreed = function () {
 console.log(`My breed is ${this.breed}`);
};

const dog = new Dog("Buddy", "Golden Retriever");
dog.sayName(); // My name is Buddy
dog.sayBreed(); // My breed is Golden Retriever
```

```js
// 多态
function Animal() {}

Animal.prototype.speak = function () {
 console.log("Animal speaks");
};

function Cat() {}
Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;
Cat.prototype.speak = function () {
 console.log("Meow");
};

function Dog() {}
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.speak = function () {
 console.log("Woof");
};

const cat = new Cat();
const dog = new Dog();
cat.speak(); // Meow
dog.speak(); // Woof
```

![继承链路图](./images/js/js-inherit.png)

```js
// 修改对象
const person = { name: "John" };

Object.getPrototypeOf(person).sayHello = function () {
 console.log(`Hello, my name is ${this.name}`);
};

person.sayHello(); // 输出：Hello, my name is John
```

## 8. `call() apply() bind()` 的作用

call、apply、bind 都能改变函数内部的 this 指向。

call 和 apply 都会调用函数，其中 apply 需要以数组的形式传递参数，数组中的元素作为参数传递给被调用的函数。

bind 不会调用函数，它返回一个改变了 this 指向的新函数。

当需要改变函数内部 this 指向且要立即调用函数时，可使用 call、apply。

当需要改变函数内部 this 指向有不需要立刻调用函数的时候，可以使用 bind，如改变定时器内部的 this 指向。

```js
const max = Math.max.apply(null, [1, 2, 3]) // 3

btn.onclick = function () {
  this.disabled = true
  setTimeout(
    function () {
      this.disabled = false
    }.bind(this),
    1000
  )
}
```

## 9. JS 的包装类型是什么？

JS 中，基本类型是没有属性和方法的。为了便于操作基本类型，在调用基本类型的属性或方法时，JS 会隐式地将基本类型转换为对应的包装对象。

```js
const str = 'hello'
str.length // 5
str.toUpperCase() // 'HELLO'
```

通过 `Object()` 函数，也可以显式地将基本类型转换为包装对象。

```js
const str = 'hello'
Object(str) // String { "hello" }
const num = 123
Object(num) // Number { 123 }
```

通过 `valueOf()` 函数，可以将包装对象转换为基本类型。

```js
const str = 'hello'
const strObj = Object(str)
strObj.valueOf() // 'hello'
```

:::tip 看代码说结果

```js
const boo = new Boolean(false)
if (!boo) {
  console.log('boo is false') // 这段代码不会执行
}
```

上述代码不会打印 `boo is false`，因为 boo 是一个包装对象，本质上它已经是一个对象，因此 `if` 语句中是 `true`，打印语句不会执行。
:::

## 10. 为什么会有 BigInt 的提案

JS 中 `Number.MAX_SAFE_INTEGER` 来表示最大的安全整数，它的值是 9007199254740991（即 2 的 53 次方减 1）。

在这个范围内的整数可以精确表示，没有精度丢失。当整数超过这个范围时，JS 可能会出现计算不准确的情况。

由于这个问题在进行大数计算时不得不依靠一些第三方库，因此官方提出了 BigInt 的提案来解决这个问题。

:::tip JS 的特殊数值

```js
Number.MAX_SAFE_INTEGER // 最大的安全整数，9007199254740991
Number.MAX_VALUE // 最大正浮点数，约为 1.7976931348623157e+308
Number.MIN_SAFE_INTEGER // 最小的安全整数，-9007199254740991
Number.MIN_VALUE // 最小正浮点数，约为 5e-324
```

:::

## 11. 如何判断一个对象是空对象

### `Object.keys()`

```js
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}
```

`Object.keys()` 返回一个由给定对象的所有可枚举自有属性的属性名组成的数组。

### `JSON.stringify()`

```js
function isEmptyObject(obj) {
  return JSON.stringify(obj) === '{}'
}
```

若对象包含不可枚举的自有属性，这种方法不准确。

## 12. `const` 定义的变量的值可以修改吗

`const` 关键字保证的是栈内存中保存的值不能修改。

对于基本数据类型而言，栈内存中保存的就是实际的值，因此这个值无法被修改。

对于引用数据类型而言，栈内存中保存的是对象在堆内存中的**引用地址**，这个引用地址无法被修改，但是堆内存中的对象是可以被修改的。

## 13. `this` 指向

1. 函数调用。`this` 指向函数的调用者。普通函数调用指向全局对象（非严格模式）或 `undefined` （严格模式）。对象函数的调用，指向该对象。
2. 全局上下文的函数调用。非严格模式下，在全局上下文中，`this` 指向全局对象，浏览器是 `window` 对象，Node.js 是 `global` 对象。严格模式下，`this` 指向 `undefined`。
3. 构造函数调用。使用 `new` 构造函数创建对象时，构造函数的 `this` 指向创建的实例对象。
4. 定时器、立即执行函数、匿名函数的指向，同第二点。
5. 箭头函数没有自己的 `this`，它的 `this` 指向在函数定义时就已经确定了，指向的是函数外层作用域的 `this`，且不会改变。
6. `bind()`、`call()`、`apply()` 等方法可以改变函数的 `this` 指向。

## 14. s 箭头函数和普通函数的区别

1. 箭头函数没有自己的 this，它的 this 指向在函数定义时就确定了，指向函数外层作用域的 this，并且不会改变，call、apply、bind 方法也无法改变箭头函数的 this 指向。
2. 箭头函数没有 arguments，在箭头函数里访问 arguments 得到的实际上是外层函数的 arguments。如果没有外层函数，也就是箭头函数在全局作用域内，使用 arguments 会报错。可以使用剩余参数来代替 arguments 访问箭头函数的参数列表。
3. 箭头函数没有原型对象 prototype。
4. 箭头函数不能用作构造函数，不可以使用 new 命令。在 new 一个构造函数时，首先会创建一个对象，接着把新对象的 `__proto__` 属性设置为构造函数的原型对象 prototype，接着把构造函数的 this 指向新对象。对于箭头函数而言，第一，它没有原型对象 prototype，第二，它没有自己的 this，所以不能用作构造函数。
