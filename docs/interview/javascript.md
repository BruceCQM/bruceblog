# JavaScript

## JS 有哪些数据类型

7 大基本数据类型：`Number、String、Boolean、Null、Undefined、Symbol、BigInt`。

引用数据类型：`Object`。

`Array、Date、RegExp、Map、Set` 等本质上都属于 `Object`，`typeof` 出来的结果都是 `object`。

:::tip 拓展
1、基本数据类型使用的是栈内存，引用数据类型使用的是堆内存。

2、`BigInt` 是否为基本数据类型存在争议。有一种说法是，`BigInt` 不是 JS 的基本数据类型，它是 ES10 新增的数据类型，表示任意大的整数，本质上还是属于 `Number`的数据类型。
:::
