# JavaScript

## JS 有哪些数据类型

7 大基本数据类型：`Number、String、Boolean、Null、Undefined、Symbol、BigInt`。

引用数据类型：`Object`。

`Array、Date、RegExp、Map、Set` 等本质上都属于 `Object`，`typeof` 出来的结果都是 `object`。

:::tip 拓展
1、`BigInt` 是否为基本数据类型存在争议。有一种说法是，`BigInt` 不是 JS 的基本数据类型，它是 ES10 新增的数据类型，表示任意大的整数，本质上还是属于 `Number`的数据类型。

2、基本数据类型使用的是栈内存，引用数据类型使用的是堆内存。

3、基本数据类型大小固定、所占内存空间小，因此在栈中存储。

4、引用数据类型大小不固定、所占内存空间较大，若在栈中存储，会影响程序的运行性能，因此在堆中存储。同时，引用数据类型在栈中存储的是指针，指向堆中实体的起始地址。
:::

## 怎么判断 JS 数据类型

[判断JS数据类型的四种方法](https://www.cnblogs.com/onepixel/p/5126046.html){link=static}

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

:::danger instanceof 的缺陷
instanceof 操作符的问题在于，它假定只有一个全局执行环境。如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的构造函数。

如果从一个框架向另一个框架传入一个数组，那么传入的数组与第二个框架原生创建的数组分别具有不同的构造函数。

一个例子就是，网页中有多个 iframe，每个 iframe  是相互独立的全局执行环境，都有各自的 Array。

```js
var iframe = document.createElement('iframe')
document.body.appendChild(iframe)
xArray = window.frames[0].Array
var arr = new xArray(1,2,3)
arr instanceof Array // false
```

为了解决这个问题，ECMAScript 提供了 Array.isArray() 来判断一个值是否为数组，不用管是在哪个全局执行环境创建的。

Array.isArray() 本质上检测的是对象的 `[[Class]]` 值，这是对象的一个内部属性，里面包含了对象的类型信息，格式为 [object Xxx]，Xxx 就是对应的具体类型。对于数组而言，`[[Class]]` 的值就是 [object Array]。

:::

[如何理解《JavaScript高程》第六章中Array.from中提到的instanceof的问题](https://segmentfault.com/q/1010000040302948){link=static}

[[学习笔记] JavaScript 检测数组](https://segmentfault.com/a/1190000002937174){link=static}

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

## 基本数据类型为何能调用方法？

基本数据类型都有其对应的包装类，能够调用方法是因为进行了自动封装。

## `null` 和 `undefined` 的区别

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

## `new` 一个构造函数发生什么事

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
  // 将 arguments 第一个元素弹出来，就是构造函数
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

## `new` 一个箭头函数会怎样

箭头函数没有 `this`，没有 `prototype`，也不能使用 `arguments` 参数，无法 `new` 一个箭头函数。

## 原型链和原型对象

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

## `call() apply() bind()` 的作用

call、apply、bind 都能改变函数内部的 this 指向。

call 和 apply 都会调用函数，其中 apply 需要以数组的形式传递参数，数组中的元素作为参数传递给被调用的函数。

bind 不会调用函数，它返回一个改变了 this 指向的新函数。

call 和 bind 会将第二个参数及其之后的参数传入函数体内。

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

看代码说结果

```js
function func(a, b, c) {
  console.log(a, b, c);
}
var func1 = func.bind(null, "linxin");

func("A", "B", "C"); 
func1(); 
func1("A", "B", "C"); 
func1("B", "C"); 
func.call(null, "linxin"); 
func.apply(null, ["a", "b", "c"]); 


// 结果分别是：
// A B C
// linxin undefined undefined
// linxin A B
// linxin B C
// linxin undefined undefined
// a b c
```

## bind 链式调用

看代码说结果。

```js
function fn(age) {
  console.log('🥬  ', arguments);
  console.log('🥬  ', this.name, age);
}
let obj1 = { name: 'obj1' };
let obj2 = { name: 'obj2' };
let obj3 = { name: 'obj3' };

let a = fn.bind(obj1, 10);
let b = a.bind(obj2, 20);
let c = b.bind(obj3, 30);

a(66);
b(77);
c(88);

fn.bind(obj1, 10).bind(obj2, 20).bind(obj3, 30)(40);
```

结果如下。

```js
// node 环境下的运行结果
🥬   [Arguments] { '0': 10, '1': 66 }
🥬   obj1 10
🥬   [Arguments] { '0': 10, '1': 20, '2': 77 }
🥬   obj1 10
🥬   [Arguments] { '0': 10, '1': 20, '2': 30, '3': 88 }
🥬   obj1 10
🥬   [Arguments] { '0': 10, '1': 20, '2': 30, '3': 40 }
🥬   obj1 10
```

1、bind() 方法会创建一个新函数。

2、bind()的第一个参数为新函数的 this 指向，后面的参数会作为新函数的前几个参数传入。

3、新函数在运行时，会调用原函数。

4、连续 bind 会产生闭包，算是函数柯里化的一种应用。

`fn.bind(obj1, 10).bind(obj2, 20).bind(obj3, 30)(40);` 相当于：

```js
let a = fn.bind(obj1, 10);
let b = a.bind(obj2, 20);
let c = b.bind(obj3, 30);
c(40);
```

c(40) 运行时，会调用 b 函数，并且把参数 30、40（bind 直接绑定的参数在前面） 传给 b 函数，b 函数的 this 指向 obj3。

b 运行时，调用 a 函数，传入参数 20、30、40。

a 运行时，调用 fn 函数，传入参数 10、20、30、40，fn 函数 this 指向 obj1。

即最后执行的时候相当于 `fn.call(obj1, 10, 20, 30, 40)`。

[连续bind返回值的个人理解](https://juejin.cn/post/6947353368687804453){link=static}

## 手写 call、apply、bind

### call

主要思路：将原函数挂载到指定对象上，接着通过该对象调用原函数，从而将函数的 this 指向指定对象，最后将函数从对象属性上删除。

难点：在 ES5 中，如何将 arguments 类数组的参数，转换为逗号分割的参数序列，给原函数传递参数。

```js
// ES5 实现
Function.prototype.myCall = function (context) {
  // 如果 context 为空，则挂载到全局对象上，Node 是 global
  // Object(context) 是为了防止传入基本类型
  var context = context ? Object(context) : window;

  // 为了防止属性名冲突，拼接上当前时间戳
  var key = 'fn' + new Date().getTime();
  context[key] = this;

  // 获取参数，从第二个开始，第一个是 context 
  var args = [];
  for (var i = 1;i < arguments.length;i++) {
    args.push(arguments[i]);
  }

  // 假设 args 是 [1, 2, 3]
  // 调用字符串：context[key](1,2,3)
  // 这样也可以：'context.' + key + '(' + args + ')'，结果是：context.fn1623844656(1,2,3)
  // 在这里，args 会自动调用数组的 toString 方法，转换为逗号分割的参数序列字符串 1,2,3
  var callStr = 'context[key](' + args + ')';
  // eval 函数将字符串当作 JS 代码执行
  var res = eval(callStr);

  // 删除临时添加的属性
  delete context[key];
  return res;
}
```

无注释版本：

```js
// ES5 实现
Function.prototype.myCall = function (context) {
  var context = context ? Object(context) : window;

  var key = 'fn' + new Date().getTime();
  context[key] = this;

  var args = [];
  for (var i = 1;i < arguments.length;i++) {
    args.push(arguments[i]);
  }

  var callStr = 'context[key](' + args + ')';
  var res = eval(callStr);

  delete context[key];
  return res;
}

// 使用 Symbol
Function.prototype.myCall = function (context) {
  var context = context ? Object(context) : window;

  // 每个 Symbol 都是独一无二的，不会冲突
  var key = Symbol();
  context[key] = this;

  var args = [];
  for (var i = 1;i < arguments.length;i++) {
    args.push(arguments[i]);
  }

  var callStr = 'context[key](' + args + ')';
  var res = eval(callStr);

  delete context[key];
  return res;
}

// ES6 实现
Function.prototype.myCall = function (context, ...rest) {
  const context = context ? Object(context) : window;

  const key = Symbol();
  context[key] = this;

  const res = context[key](...rest);

  delete context[key];
  return res;
}
```

### apply

apply 的实现和 call 类似，区别就在于 apply 传递的参数是数组，而 call 传递的参数是逗号分割的参数序列。

```js
// ES5 实现
Function.prototype.myApply = function (context, args) {
  var context = context ? Object(context) : window;

  var key = 'fn' + new Date().getTime();
  context[key] = this;

  var callStr = 'context[key](' + args + ')';
  var res = eval(callStr);

  delete context[key];
  return res;
}

// ES6 实现
Function.prototype.myApply = function (context, args) {
  const context = context ? Object(context) : window;

  const key = Symbol();
  context[key] = this;

  const res = context[key](...args);

  delete context[key];
  return res;
}
```

### bind

实现 bind 的几个关键点：

- 改变 this 指向。

- bind 返回一个函数。

- 预设参数，即参数可以在 bind 中传递，也可以在 bind 返回的函数中传递。

- 需要保留原函数的原型 prototype。

- 需要判断 bind 返回的函数是否被 new 了。

```js
// ES5 的实现
Function.prototype.myBind = function (context) {
  // 保留原函数
  var fn = this;
  //  arg1 是 bind 函数里传递的参数，从第 2 个开始
  var arg1 = Array.prototype.slice.call(arguments, 1);

  // 返回的新函数
  var result = function() {
    //  arg2是调用新函数时传递的参数
    var arg2 = Array.prototype.slice.call(arguments);
    // 如果这个新函数被 new 了，直接取 this
    return fn.apply(this instanceof result ? this : context, arg1.concat(arg2));
  }

  // 维护原型链
  result.prototype = fn.prototype;
  return result;
}

// ES6 的实现
Function.prototype.myBind = function (context, ...arg1) {
  const fn = this;
  const result = function(...arg2) {
    return fn.apply(this instanceof result ? this : context, [...arg1, ...arg2]);
  }
  result.prototype = fn.prototype;
  return result;
}
```

## JS 的包装类型是什么？

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

## 为什么会有 BigInt 的提案

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

## 如何判断一个对象是空对象

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

## `const` 定义的变量的值可以修改吗

`const` 关键字保证的是栈内存中保存的值不能修改。

对于基本数据类型而言，栈内存中保存的就是实际的值，因此这个值无法被修改。

对于引用数据类型而言，栈内存中保存的是对象在堆内存中的**引用地址**，这个引用地址无法被修改，但是堆内存中的对象是可以被修改的。

## `this` 指向

1. 函数调用。`this` 指向函数的调用者。普通函数调用指向全局对象（非严格模式）或 `undefined` （严格模式）。对象函数的调用，指向该对象。
2. 全局上下文的函数调用。非严格模式下，在全局上下文中，`this` 指向全局对象，浏览器是 `window` 对象，Node.js 是 `global` 对象。严格模式下，`this` 指向 `undefined`。
3. 构造函数调用。使用 `new` 构造函数创建对象时，构造函数的 `this` 指向创建的实例对象。
4. 定时器、立即执行函数、匿名函数的指向，同第二点。
5. 箭头函数没有自己的 `this`，它的 `this` 指向在函数定义时就已经确定了，指向的是函数外层作用域的 `this`，且不会改变。
6. `bind()`、`call()`、`apply()` 等方法可以改变函数的 `this` 指向。

## 箭头函数和普通函数的区别

1. 箭头函数没有自己的 this，它的 this 指向在函数定义时就确定了，指向函数外层作用域的 this，并且不会改变，call、apply、bind 方法也无法改变箭头函数的 this 指向。
2. 箭头函数没有 arguments，在箭头函数里访问 arguments 得到的实际上是外层函数的 arguments。如果没有外层函数，也就是箭头函数在全局作用域内，使用 arguments 会报错。可以使用剩余参数来代替 arguments 访问箭头函数的参数列表。
3. 箭头函数没有原型对象 prototype。
4. 箭头函数不能用作构造函数，不可以使用 new 命令。在 new 一个构造函数时，首先会创建一个对象，接着把新对象的 `__proto__` 属性设置为构造函数的原型对象 prototype，接着把构造函数的 this 指向新对象。对于箭头函数而言，第一，它没有原型对象 prototype，第二，它没有自己的 this，所以不能用作构造函数。

## 作用域、执行上下文

### 作用域

1. 简单而言，作用域相当于一个区域，就是为了说明这个区域有多大，而不包括这个区域里面有什么东西。这个区域里面有什么东西是这个作用域对应的执行上下文要说明的内容。

2. JS 没有块级作用域，只有函数作用域和全局作用域。块级作用域就是定义在 {} 里的范围，比如 if() 和 for() 里那个 {} 的范围就叫做块级作用域。

3. 全局变量要在代码前端声明，函数中的变量要在函数体一开始的地方声明好。除了这两个地方，其它地方不要出现变量声明。否则会：内层变量会覆盖外层变量；用来计数的循环变量泄漏变成全局变量。使用 let 会解决 var 没有块级作用域的问题。

4. 作用域是在函数创建的时候就已经确定了，而不是函数调用的时候。

5. 作用域最大的用处就是隔离变量，不用作用域下的同名变量不会有冲突。

### 执行上下文

我们可以将执行上下文看作代码当前运行的环境。主要分为：全局执行上下文、函数执行上下文和 eval 函数执行上下文。

对于一个执行上下文，也可以称为当前 js 执行环境，包括了私有作用域、当前作用域中的变量、上层作用域、当前作用域对象 this。

执行上下文的建立过程：

1. 建立阶段（调用一个函数时，但在执行函数体内具体代码以前）：给参数赋值、声明函数、声明变量、初始化作用域链、确认上下文的 this 指向。

2. 代码执行阶段：变量赋值、执行其它代码。

在建立执行上下文的过程中，变量的声明不重要，重要的是变量的赋值。不管在建立阶段的时候一个属性的声明是怎样的，在执行阶段仍然可以被赋值为不同类型的值，这也是为什么 JavaScript 是弱类型的语言。

### 作用域和上下文的关系

作用域只是一个区域，一个抽象的概念，其中没有变量。

要通过作用域对应的执行上下文环境来获取变量的值。

同一个作用域下，不同的调用会产生不同的执行上下文环境，继而产生不同的变量值。

### 自由变量

> **不在自己作用域里的变量都叫自由变量**。

在 JavaScript 中，自由变量（Free Variable）是指在一个函数内部可以访问到的，但不是该函数参数或局部变量的变量。这些变量通常是定义在函数外部的全局变量，或者是函数所在作用域链（Scope Chain）中的上层作用域中的变量。

自由变量的概念主要出现在函数式编程和闭包（Closure）的讨论中。闭包是指一个函数可以访问并操作其外部作用域中的变量，即使该函数在其他地方被调用。

```js
// 全局变量 x，是函数 foo 的自由变量
var x = 10;

function foo() {
  // 访问全局变量 x，这里 x 是自由变量
  console.log(x);
}

foo(); // 输出: 10
```

### 作用域链

在自己所在作用域对应的执行上下文取值，如果取不到就到上一级作用域对应的执行上下文，直到全局作用域对应的执行上下文。

作用域链是因为自由变量才存在的，也是因为自由变量，作用域链才有意义。

```js
var aa = 22;

function a() {
  console.log(aa);
}

function b(fn) {
  var aa = 11;
  fn();
}

b(a); // 22
```

作用域在函数创建的时候就已经确定了，而不是函数调用的时候。

因此，上述例子中，函数 a 的上一级作用域是全局作用域，而不是函数 b 的作用域，所以向上一级作用域取变量 aa 的值是 22，不是 11。

```js
function a() {
  var age = 21;
  var height = 178;
  var weight = 70;
  function b() {
    // var 声明的变量有变量提升，在这个位置 age 已声明但未赋值，所以是 undefined
    console.log(age); // undefined
    console.log(height); // 178
    var age = 25;
    height = 180;
    console.log(age); // 25
    console.log(height); // 180
  }
  b();
  console.log(height); // 180
}
a();
```

[javascript执行上下文、作用域与闭包（第一篇）---执行上下文](https://blog.csdn.net/iamchuancey/article/details/78230791){link=static}

## 闭包

当一个内部函数引用了外部函数的变量，就产生了闭包。

在闭包里，函数调用完之后，其执行上下文环境不会立即被销毁。使用闭包会使变量保存在内存中，导致增加内存开销。

内部函数保持对外部函数作用域的引用，使得外部函数中的变量在内部函数执行时依然可用。

闭包的应用场景：

1. 实现计数器

闭包可以用来创建自己的计数器或计时器，这些计数器或计时器能够记住它们自己的计数或时间信息，而不会影响其他计数器或计时器。

```js
function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter1 = makeCounter();
const counter2 = makeCounter();

console.log(counter1()); // 输出: 1
console.log(counter1()); // 输出: 2
console.log(counter2()); // 输出: 1
```

2. 封装私有变量

闭包可以用来创建只能通过特定函数访问的私有变量。

```js
function person(name, age) {
  let _name = name;
  let _age = age;

  return {
    getName: function() {
      return _name;
    },
    getAge: function() {
      return _age;
    },
    setAge: function(age) {
      _age = age;
    }
  };
}

const p = person('John', 30);
console.log(p.getName()); // 输出: 'John'
p.setAge(31);
console.log(p.getAge()); // 输出: 31
```

3. 实现模块化

闭包可以用来实现简单的模块化模式，创建私有变量和方法，只暴露必要的接口。把操作函数暴露在外部，细节隐藏在内部。

```js
function module() {
  const arr = []

  function add(val) {
    arr.push(val);
  }

  function get(index) {
    return arr[index];
  }

  return { add, get}
}

const m = module();
m.add(22);
m.get(0); // 22
```

4. 循环注册点击事件

有问题的代码：

```js
var list = document.querySelectorAll('li');
for (var i = 0;i < list.length;i++) {
  list[i].onclick = function() {
    alert(i);
  }
}
```

首先，这段代码是产生了闭包的。匿名回调函数引用了外部作用的变量 i，由于闭包的作用，即使循环结束，i 值会保留在内存中。

但是每个事件监听器会共享一个 i 值，因此点击任意一个 li 元素，弹出的值是循环结束的 i 值，即 list.length，而不是点击的元素在数组中的索引。

修改方法一：将索引值保存到每个 li 元素中

```js
var list = document.querySelectorAll('li');
for (var i = 0;i < list.length;i++) {
  list[i].index = i;
  list[i].onclick = function() {
    // 函数的 this 指向就是对应的 li 元素
    alert(this.index);
  }
}
```

修改方法二：var 改为 let

let 声明的变量具有块级作用域，每个循环迭代都会创建一个新的 i 的绑定，这样每个点击事件监听器就会引用它自己的 i 的值。

```js
var list = document.querySelectorAll('li');
for (let i = 0;i < list.length;i++) {
  list[i].onclick = function() {
    alert(i);
  }
}
```

修改方法三：使用 IIFE 产生新闭包

使用立即执行函数表达式（IIFE）来创建一个新的作用域，将循环中的 i 值传递给这个新的作用域。

```js
var list = document.querySelectorAll('li');
for (var i = 0;i < list.length;i++) {
  list[i].onclick = (function(index) {
    return function() {
      console.log(index)
    }
  })(i)
}

var list = document.querySelectorAll('li');
for (var i = 0;i < list.length;i++) {
  (function(index) {
    list[i].onclick = function() {
      console.log(index);
    }
  })(i)
}
```

## var let const

### 块级作用域

ES5 只有全局作用域和函数作用域，没有块级作用域。在 ES6 之前，大部分人会选择使用闭包来解决这个问题，现在可以用 let 来解决问题。

var：只有全局作用域和函数作用域，没有块级作用域的概念。

let：有全局作用域、函数作用域和块级作用域的概念。块级作用域由花括号{}包裹起来，if 和 for 语句的 {} 也属于块级作用域，注意对象的 {}不是块级作用域。

### 变量提升、暂时性死区

var 声明的变量存在变量提升，let、const 没有。

在作用域内，使用 let 声明的变量之前，这个变量都是不可用的，称为暂时性死区（temporal dead zone，简称 TDZ）。

当前作用域顶部到这个变量声明位置的中间部分，都是 let 变量的死区，在死区中，禁止访问这个变量，否则会报错。

```js
if (true) {
  console.log(name);
  let name = 'let'; // Uncaught ReferenceError: Cannot access 'name' before initialization
}
```

### 重复声明

var 的变量可以重复声明，let、const 的变量不允许重复声明，即在相同作用域内不能够重复声明一个变量。

### 全局对象的属性

ES5 中全局对象的属性与全局变量基本是等价的，但是也有区别，比如通过var声明的全局变量不能使用delete从 window/global （ global是针对与node环境）上删除，不过在变量的访问上基本等价。

ES6 中做了严格的区分，使用 var 和 function 声明的全局变量依旧作为全局对象的属性，使用 let, const 命令声明的全局变量不属于全局对象的属性。

```js
var a = 10;
console.log(window.a); //10
console.log(this.a) //10

let b = 20;
console.log(window.b); // undefined
console.log(this.b) // undefined
```

### const 常量

const 声明的变量具有 let 声明的变量的特性。

除此之外，const 变量必须在声明的时候初始化，并且不可改变。

当变量是对象时，这里的不可改变是指变量指向的对象不可改变，但是对象内部的变化是不受限制的。

```js
const a = 1;
a = 2; // Uncaught TypeError: Assignment to constant variable.

const b; // Uncaught SyntaxError: Missing initializer in const declaration

const c = [];
c[1] = 2;

c = [1,2]; // Uncaught TypeError: Assignment to constant variable.
```

[总结下var、let 和 const 的区别](https://www.cnblogs.com/jing-tian/p/11073168.html){link=static}

### 看代码说结果

```js
// 1.
var b = 20;
const a = {
  b: 12,
  fn: function () {
    return function () {
      console.log(this.b);
    };
  },
};
a.fn()();

// 2.
const b = 20;
const a = {
  b: 12,
  fn: function () {
    return function () {
      console.log(this.b);
    };
  },
};
a.fn()();

// 3.
var b = 20;
const a = {
  b: 12,
  fn: function () {
    console.log(this.b);
  },
};
a.fn();

// 4.
var b = 20;
const a = {
  b: 12,
  fn: function () {
    console.log(b);
  },
};
a.fn();



// 结果分别是：20, undefined, 12, 20
```

## 用 ES5 实现 const

由于ES5环境没有block的概念，所以是无法百分百实现const，只能是挂载到某个对象下，要么是全局的window，要么就是自定义一个object来当容器。

```js
var __const = function __const (data, value) {
  // 把要定义的data挂载到window下，并赋值value
  window.data = value
  // 利用Object.defineProperty的能力劫持当前对象，并修改其属性描述符
  Object.defineProperty(window, data, {
    enumerable: false,
    configurable: false,
    get: function () {
      return value
    },
    set: function (data) {
      // 当要对当前属性进行赋值时，则抛出错误
      if (data !== value) {
        throw new TypeError('Assignment to constant variable.')
      } else {
        return value
      }
    }
  })
}
__const('a', 10)
console.log(a)
delete a
console.log(a)
// 因为const定义的属性在global下也是不存在的，所以用到了enumerable: false来模拟这一功能
for (let item in window) {
  // 因为不可枚举，所以不执行
  if (item === 'a') {
    console.log(window[item])
  }
}
a = 20 // 报错
```

[如何在 ES5 环境下实现一个const ？](https://juejin.cn/post/6844903848008482824){link=static}

[如何用es5实现const](https://blog.csdn.net/Alive_tree/article/details/107839058){link=static}

## script 作用域

script 作用域可以理解为全局的块级作用域，它和全局作用域同级。

script 作用域和块级作用域的关系，就像全局作用域和函数作用域的关系。只有在全局中使用 let、const 定义变量，script 作用域才会被创建。

```js
debugger
var a = 'window a'

debugger
const b = 'script b'
debugger
{
    const c = 'Block c'
    debugger
}
function Fun() {
    const a = 'Fun a'
    var b = 'Fun b'
    debugger
}
Fun()
```

![const 声明变量还未赋值](./images/js/const-no-value.png)

![const 声明变量已赋值](./images/js/const-has-value.png)

![块级作用域](./images/js/block-scope.png)