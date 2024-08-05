# ES6 新特性

## 1. let 和 const

## 2. 解构赋值

对象、数组的结构。

```js
const { age } = obj;

const [first, second, third] = [1,2,3];
```

## 3. 模板字符串

模板字符串用反引号 ` 包围，支持字符串插值，直接嵌入表达式。


```js
const name = 'world';
const str = `hello ${name}`;
```

高级用法：标签模板。

[JS 标签模板（Tagged templates）什么时候使用？](https://www.zhangxinxu.com/wordpress/2021/12/js-tagged-templates/){link=static}

## 4. 简化对象写法

对象的属性名和属性值的变量名相同，可以简写。

```js
const name = 'world';
const obj = {
  name
}
```

## 5. 函数参数

- 允许给函数赋默认值，且可以直接在参数定义中使用解构赋值

- 可以使用剩余参数替代 arguments

```js
function say({ name = 'Ben', age = 66}, ...rest) {
  console.log(name, age, rest);
}
```

## 6. 扩展运算符

扩展运算符就是三个点：`...`，和剩余参数的三个点一样。

常见用途：数组或对象合并、数据的浅拷贝、将类数组转化为数组。

```js
// 1. 数组合并
const arr1 = [1,2,3];
const arr2 = [4,5,6];
const arr3 = [...arr1, ...arr2];

// 2. 对象合并
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const obj3 = { ...obj1, ...obj2 };

// 3. 数组拷贝
const arr = [1,2,3];
const arrCopy = [...arr];

// 4. 对象拷贝
const obj = { a: 1, b: 2 };
const objCopy = { ...obj };

// 5. 将类数组转化为数组
const nodeList = document.querySelectorAll('div');
const nodeArray = [...nodeList]; // 将 NodeList 转换为数组
```

## 7. 箭头函数

- 静态this。

- 不能使用 arguments，可以使用剩余参数。

- 没有原型对象。

- 不能作为构造函数。

## 8. Symbol

- Symbol 的值是唯一的，用来解决命名冲突的问题。

- Symbol 值不能与其他类型的值进行运算，也不能和自己进行运算，如 +、-、*、/等运算，会报错。

- Symbol 定义的对象属性不能用 for...in 遍历，但可以使用 Reflect.ownKeys来获取对象所有键名。

- Symbol 定义可以传参数，`let s = Symbol(111)`，即使传进去的值相等，返回的值也是不相等的。使用 Symbol.for() 创建 Symbol 可以解决这个问题。

- Symbol.for() 不会每次创建一个新的内存，如果标志不存在则创建一个，存在则直接引用以前的地址。

应用：给对象添加属性和方法，由于 Symbol 值具有唯一性，因此可以安全地把属性和方法加入对象中。

## 9. 迭代器

- 创建一个指针对象，指向当前数据结构的起始位置。

- 第一次调用对象的 next 方法，指针自动指向数据结构的第一个成员。

- 接下来不断调用 next 方法，指针一直往后移动，直到指向最后一个成员。

- 每次调用 next 方法，返回一个包含 value 和 done 属性的对象，done 属性表示遍历是否结束。

```js
// 实现一个迭代器
function createIterator(items) {
  let index = 0;
  return {
    next: function () {
      const value = items[index++];
      const done = index >= items.length;
      return { value, done };
    },
  };
}

const iterator = createIterator([1, 2, 3]);

console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

任何数据结构只要部署 iterator 接口，即可完成遍历操作。

ES6 还引入了生成器对象，让创建迭代器对象的过程变得更简单。

## 10. 生成器

```js
function* gen(x){
  try {
    var y = yield x + 2;
  } catch (e){ 
    console.log(e);
  }
  return y;
}

var g = gen(1);
g.next();
g.throw（'出错了'）;
// 出错了
```

[Generator 函数的含义与用法](https://www.ruanyifeng.com/blog/2015/04/generator.html){link=static}

[Generator 函数的语法](https://es6.ruanyifeng.com/#docs/generator){link=static}

## 11.Promise

## 12. Set

ES6 提供了新的数据结构 Set（集合），本质上是一个对象。它类似于数组，但成员的值都是唯一的，Set 实现了 iterator 接口，因此可以使用 for...of 遍历。

常用 API：

- size：返回集合中元素的个数。

- add()：增加一个新元素，返回当前集合。

- delete()：删除一个元素，返回一个布尔值。

- has()：判断元素是否存在于集合中，返回一个布尔值。

应用：数组去重、求并集、搭配 filter 求交集。

```js
// 数组去重
const arr = [1,1,2,2,3];
const uniqueArr = [...new Set(arr)];

// 搭配 filter 求交集
const arr1 = [1,2,3];
const arr2 = [2,3,4];
const set2 = new Set(arr2);
// set的has方法时间复杂度是O(1)，如果直接用数组的includes方法，时间复杂度是O(n)，效率会有点优化。
const intersection = new Set(arr1.filter(item => set2.has(item)));

// 求并集
const arr1 = [1,2,3];
const arr2 = [2,3,4];
const union = new Set([...arr1, ...arr2]);
```

## 13. Map

ES6 提供了 Map 数据结构，它类似于对象，也是键值对的集合，但是建的范围不限于字符串，各种类型的值（包括对象）都可以当作键。这是和普通对象不同的地方。

Map 也实现了 iterator 接口，因此可以使用 for...of 遍历。

常见 API：

- size：返回 Map 的键值对个数。

- set()：设置键值对，返回当前 Map。

- get()：根据键获取值，如果找不到键，返回 undefined。

- delete()：删除键值对，返回一个布尔值。

- has()：判断 Map 中是否有该键，有返回 true，否则返回 false。

- clear()：清空 Map 中的所有键值对。

- values()： 返回一个迭代器对象，包含 Map 中所有键值对的值。

- keys()：返回一个迭代器对象，包含 Map 中所有键值对的键。

```js
const map = new Map();
map.set(1,11);
map.set(2,22);
map.set(3,33);

const values = map.values();
values.next(); // {value: 11, done: false}
values.next(); // {value: 22, done: false}
values.next(); // {value: 33, done: false}
values.next(); // {value: undefined, done: true}
```