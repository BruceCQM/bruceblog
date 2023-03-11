# flex 布局

## flex 布局原理

全称 flexible box，弹性布局。

如何开启：为元素添加 `display: flex`。

开启 flex 布局的元素，称为 flex 容器（flex container），其子元素成为容器成员，称为 flex 项目。

flex 布局原理：通过给父盒子添加 `display: flex`，来控制盒子的位置和排列方式。

## flex 布局父盒子常见属性

### `flex-direction`

设置主轴方向

| 属性值         | 含义             |
| -------------- | ---------------- |
| row            | 默认值，从左到右 |
| row-reverse    | 从右到左         |
| column         | 从上到下         |
| column-reverse | 从下到上         |

### `justify-content`

设置主轴子元素排列方式

| 属性值        | 含义                           |
| ------------- | ------------------------------ |
| flex-start    | 默认值，从头开始               |
| flex-end      | 从尾部开始                     |
| center        | 居中                           |
| space-around  | 平分剩余空间                   |
| space-between | 两侧子元素贴边，再平分剩余空间 |

### `flex-wrap`

设置子元素是否换行

默认不换行，若子盒子宽度和大于父盒子，则会收缩！

| 属性值 | 含义           |
| ------ | -------------- |
| wrap   | 换行           |
| nowrap | 默认值，不换行 |

### `align-items`

设置子元素在侧轴上的排列方式（子元素单行）

| 属性值     | 含义                                                   |
| ---------- | ------------------------------------------------------ |
| flex-start | 侧轴头部开始                                           |
| flex-end   | 侧轴尾部开始                                           |
| center     | 侧轴居中                                               |
| stretch    | 默认值，拉伸（拉满整个侧轴），若子元素设置了高度则失效 |

### `align-content`

设置子元素在侧轴上的排列方式（子元素多行）

| 属性值        | 含义                                               |
| ------------- | -------------------------------------------------- |
| flex-start    | 默认值，侧轴头部开始                               |
| flex-end      | 侧轴尾部开始                                       |
| center        | 侧轴居中                                           |
| stretch       | 子元素高度平分父元素高度（需要子元素没有设置高度） |
| space-around  | 平分侧轴空间                                       |
| space-between | 侧轴两侧贴边再平分剩余空间                         |

### `flex-flow`

`flex-direction` 与 `flex-wrap` 属性的复合写法

```css
son {
  flex-flow: row wrap;
}
```

## flex 布局子盒子常见属性

### `flex`

`flex` 属性其实是 `flex-grow`、`flex-shrink`、`flex-basis` 三个属性的简写。

`flex-grow` 属性值为一个数字，用于设置弹性盒子的扩展比例，即盒子占剩余空间的份数，默认为 0。常见的 `flex: 1` 是 `flex-grow` 为 1。

`flex-shrink` 属性值为一个数字，用于设置盒子的收缩比例，当子盒子的宽度之和大于父盒子时才会收缩。

`flex-basis` 用于设置子盒子的初始长度。

```css
span {
  flex: 1;
}

.son {
  flex: 0 0 33.33%;
}
```

### `align-self`

单独设置某个子盒子在侧轴的排列方式，它会覆盖 `align-items` 属性。默认值为 `auto`，表示继承父盒子的 `align-items` 属性，其余属性值与 `align-items` 相同。

### `order`

定义子盒子在**主轴**上的排列顺序。默认值为 0，值越小越靠前，可以为负数。

```css
.son {
  order: -3;
}
```
