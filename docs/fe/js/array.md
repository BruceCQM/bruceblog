# JavaScript 数组

## 数组方法

### 数组操作

#### `push()`

向数组末尾添加元素，返回新数组长度

```js
let arr = [520, 55520, 521]
// 添加单个元素
let newLen = arr.push(666)
// 添加多个元素
arr.push(2333, 'BruceBlog')
```

#### `pop()`

数组末尾删除一个元素，返回被删除的元素

```js
let arr = [520, 55520, 521]
let el = arr.pop()

// 数组没有元素返回 undefined
arr = []
arr.pop()
```

#### `unshift()`

数组头部添加元素，返回新数组长度

```js
let arr = [520, 55520, 521]
// 添加单个元素
let newLen = arr.unshift(666)
// 添加多个元素
arr.unshift(2333, 'BruceBlog') // [2333, 'BruceBlog', 666, 520, 55520, 521]
```

#### `shift()`

数组头部删除一个元素，返回被删除的元素

```js
let arr = [520, 55520, 521]
let el = arr.shift()

// 数组没有元素返回 undefined
arr = []
arr.shift()
```

#### `splice()`

可给数组删除、添加、替换元素，改变原数组

返回被删除元素组成的数组，没有删除元素则为空数组

参数：操作起始位置、删除的元素个数、添加的元素

```js
let arr = ['JS', 'Java', 'C++', 'PHP']
let res = 0

// 删除元素
// ['JS', 'PHP'], ['Java', 'C++']
res = arr.splice(1, 2)

// 添加元素
// ['Python', 'TS', 'JS', 'PHP'], []
res = arr.splice(0, 0, 'Python', 'TS')

// 替换元素（删除元素的同时添加新元素）
// ['Python', 'C', 'Go']
arr.splice(1, 3, 'C', 'Go')
```

### 数组排序

#### `sort()`

对数组进行排序，修改原数组，返回排序后的数组。

默认按字符串顺序升序排序。

```js
let arr = [0, 2, 8, 10, 25]
// [0, 10, 2, 25, 8]
let res = arr.sort()
// true
res === arr
```

`sort()` 方法可传入一个比较函数，自定义比较规则。

比较函数传入两个参数：新数和旧数。返回正数则新数排在旧数之后，返回负值则新数排在旧数之前，返回 0 则相等。

```js
function compareAsc(a, b) {
  return a - b
}
function compareDes(a, b) {
  return b - a
}
function compareRandom(a, b) {
  return 0.5 - Math.random()
}

let arr = [0, 52, 8, 25, 10]
// [0, 8, 10, 25, 52]
arr.sort(compareAsc)

// [52, 25, 10, 8, 0]
arr.sort(compareDes)

// 随机排序数组
arr.sort(compareRandom)

// 根据对象属性排序
let cars = [
  { type: 'Benz', year: 2021 },
  { type: 'Lexus', year: 2022 },
  { type: 'BMW', year: 2023 },
]

cars.sort(function (a, b) {
  let x = a.type.toLowerCase()
  let y = b.type.toLowerCase()
  if (x < y) {
    return -1
  }
  if (x > y) {
    return 1
  }
  return 0
})
```

#### `reverse()`

反转数组，改变原数组。

```js
let arr = ['red', 'blue', 'green']
// ['green', 'blue', 'red']
arr.reverse()
```

### 数组迭代

#### `forEach()`

遍历数组，对每个元素执行传入的函数。相当于使用 `for` 循环遍历数组。

`forEach()` 没有返回值，不会改变原数组。

```js
let arr = [1, 44, 3, 2]
let count = 0
let res = arr.forEach((item, index, arr) => {
  count += item
})
// count: 50
// res: undefined
```

#### `filter()`

过滤数组，返回符合条件的元素组成的新数组。不改变原数组。

传入一个筛选函数，筛选函数 3 个参数：元素、索引、数组。

```js
let arr = [5, 23, 66, 520, 77]
let res = arr.filter((item, index, arr) => item > 50)
// [66, 520, 77]
```

#### `map()`

对数组每个元素执行传入的函数，返回每个执行结果组成的数组。不改变原数组。

```js
let arr = [1, 3, 5, 7]
let res = arr.map((item, index, arr) => item * 3)
// [3, 9, 15, 21]
```

#### `every()`

检查数组每个元素是否都满足条件，若都返回 `true`，则 `every()` 方法返回 `true`。若有一个元素返回 `false`，则 `every()` 方法返回 `false`。

一旦遇到元素返回 `false`，则**停止后续遍历**。

```js
let arr = [1, 2, 3, 4, 5]
arr.every((item, index, arr) => item < 2) // false
arr.every((item, index, arr) => item > 0) // true
```

#### `some()`

检查数组是否存在元素满足条件，若有一个元素返回 `true`，则 `some()` 方法返回 `true`。

一旦遇到元素返回 `true`，则**停止后续遍历**。

```js
let arr = [4, 5, 6, 7, 8]
arr.some((item, index, arr) => item === 6) // true
```

#### `reduce()`

遍历数组，生成一个最终返回值，可用于条件统计。

`reduce()` 方法可传入 2 个参数：归并函数、初始值。其中初始值可选，若不传，则默认初始值为数组第一个元素，从数组第二个元素开始遍历。

归并函数可传入 4 个参数：上一个归并值、元素、索引、数组本身。

```js
// 数组元素累加
let arr = [1, 2, 3, 4, 5]
arr.reduce((pre, cur, index, arr) => pre + cur) // 15
arr.reduce((pre, cur, index, arr) => pre + cur, 10) // 25
```

#### `reduceRight()`

效果与 `reduce()` 方法相同，只是方向相反，从右往左遍历。
