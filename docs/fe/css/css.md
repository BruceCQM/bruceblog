# CSS 那些事儿

## CSS 选择器

### 标签选择器

- 通过标签名选择元素
- 优点：可快速为同类型标签统一设置样式
- 缺点：不能涉及差异化样式，只能选择全部标签

```css
h1 {
  color: #ccc;
}
```

### 类选择器

- 通过类名选择元素

```css
.container {
  color: pink;
}
```

### id 选择器

- 通过元素 id 属性选择元素

```css
#md {
  font-weight: 600;
}
```

### 通配符选择器

- 选择页面所有元素
- 用于清除内外边距

```css
* {
  padding: 0;
  margin: 0;
}
```

### 相邻选择器

- 选择所有指定元素的相邻后一个兄弟节点

```html
<h1>h1-2</h1>
<p>p0 被选中</p>
<div class="container">
  <h1 class="good">h1</h1>
  <p>p1 被选中</p>
  <p>p2</p>
</div>
```

```css
h1 + p {
  text-decoration: underline;
}
```

### 后代选择器

- 在所有后代节点中选

```css
ul li {
  color: blue;
}
```

### 子选择器

- 只在亲儿子中选

```css
div > a {
  color: green;
}
```

### 并集选择器

```css
h1,
h2,
h3 {
  text-align: center;
}
```

### 交集选择器

```css
/* good类的p元素 */
p.good {
  color: yellow;
}
```

### 伪类选择器

- 根据元素状态或所处 DOM 结构选择元素

#### 动态伪类选择器

```css
按这个顺序声明
a:link 链接一开始的样式
a:visited 链接访问后的样式
a:hover 光标经过链接的样式
a:active 链接被按下时的样式

:focus 用于选择获取焦点的表单元素，一般针对表单元素而言
input:focus
textarea:focus
```

#### 结构伪类选择器(C3)

| 选择符           | 含义                  |
| ---------------- | --------------------- |
| E:first-child    | 第一个子元素 E        |
| E:last-child     | 最后一个子元素 E      |
| E:nth-child(n)   | 第 n 个子元素 E       |
| E:first-of-type  | 指定元素 E 的第一个   |
| E:last-of-type   | 指定元素 E 的最后一个 |
| E:nth-of-type(n) | 指定元素 E 的第 n 个  |

- n 可以是数字、关键字（even，odd）、公式（n 从 0 开始）
- nth-child 先找父亲的第 n 个孩子，再看是否为元素 E，是成功，否失败
- nth-of-type 是直接找第 n 个 E，忽略其他非 E 的元素

```html
<div>
  <p>1</p>
  <span>span</span>
  <p>2</p>
  <p>3</p>
  <p>4</p>
</div>
```

```css
/* 啥都选不到 */
div > p:nth-child(2) {
  color: red;
}
/* 选到2号p标签 */
div > p:nth-of-type(2) {
  color: blue;
}
```

### 属性选择器(C3)

| 选择符        | 含义                                          |
| ------------- | --------------------------------------------- |
| E[att]        | 选择具有 att 属性的 E 元素                    |
| E[att="val"]  | 选择具有 att 属性且属性值等于 val 的 E 元素   |
| E[att^="val"] | 选择具有 att 属性且属性值以 val 开头的 E 元素 |
| E[att$="val"] | 选择具有 att 属性且属性值以 val 结尾的 E 元素 |
| E[att*="val"] | 选择具有 att 属性且属性值含有 val 的 E 元素   |

### 伪元素选择器(C3)

- 伪元素选择器利用 CSS 创建新标签元素，而不需要 HTML 标签，从而简化 HTML 结构
- before 和 after 创建了一个行内元素，在 DOM 树中无法找到，故为伪元素
- 必须有 content 属性

| 选择器   | 含义                   |
| -------- | ---------------------- |
| ::before | 在元素内部前面插入内容 |
| ::after  | 在元素内部后面插入内容 |

伪元素字体图标

```css
p::before {
  content: '\e91e';
  position: absolute;
  right: 20px;
  top: 10px;
  font-size: 20px;
}
```

伪元素清除浮动

```css
1、额外标签法（隔墙法）
在浮动元素后面添加一个块级标签（如div），并设置 clear: both

<div style="clear:both" ></div>

2、父级元素添加overflow，将其属性值设置为 hidden、 auto 或 scroll

3、父级添加after伪元素
.clearfix:after {
  content: ""; 必须要有content属性
  display: block; 块级元素
  height: 0; 不要看见该元素
  clear: both; 核心代码清除浮动
  visibility: hidden; 不要看见该元素
}
.clearfix { /* IE6、 7 专有 */
  *zoom: 1;
}

4、父级元素添加双伪元素
.clearfix:before,.clearfix:after {
  content:"";
  display:table; 转换为块级元素并一行显示
} .
clearfix:after {
  clear:both;
} .
clearfix {
  *zoom:1;
}
```

[相关链接](https://juejin.cn/post/6976646049456717838)

## CSS Modules

CSS 不是编程语言，是一种网页样式描述的手段。

但程序员希望将其改造得像编程语言，于是 scss、less 出现了。

而 CSS Modules 为 CSS 增加了**局部作用域**和**模块依赖**两个功能。

### 局部作用域

我们都知道，CSS 是全局生效的，每个组件的样式都会对全局起作用。

要产生局部作用域，即避免样式冲突，就是使用唯一的类名。

但我们无法保证自己的类名不会与别人重复。

此时，CSS Modules 就有用武之地了。

```css
.title {
  color: blue;
}
```

```js
import React from 'react';
import style from './App.css';

export default () => {
  return (
    <h1 className={style.title}>
      Hello World
    </h1>

```

`style.title` 会被构建工具编译成哈希字符串

```html
<h1 class="_3zyde4l1yATCOkgn-DBWEL">Hello World</h1>
```

```css
._3zyde4l1yATCOkgn-DBWEL {
  color: red;
}
```

这样，类名就是唯一的了。

#### 相关链接

[CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)

## CSS 隐藏元素 :see_no_evil:

#### 1、设置 `display: none`

- 隐藏元素不再占有原来位置，因此会导致页面布局改变，引起重排
- 子元素无法通过设置 `display: block` 实现反隐藏
- 隐藏元素绑定的事件不会触发

#### 2、设置 `visibility: hidden`

- 隐藏元素占有原来位置，实现的是视觉上的隐藏
- 子元素可通过设置 `visibility: visible` 显示自己
- 隐藏元素绑定的事件不会触发，如点击事件

#### 3、设置 `opacity: 0`

- 通过设置透明度为 0 来隐藏元素，因此占有原来位置
- 子元素无法通过设置 `opacity: 1` 显示自己
- `opacity: 0` 的元素仍然能触发已绑定的事件

#### 4、利用绝对定位 `position: absolute`

- 将 `top` 和 `left` 设置为足够大的负数，使其离开屏幕，即可实现隐藏效果
- 只要我跑得够远，你就看不到我 :stuck_out_tongue_winking_eye:
- 绝对定位的元素是脱标的，不会影响页面布局

#### 相关链接：

[css 隐藏元素的几种方法是什么？](https://www.html.cn/qa/css3/14720.html)

## CSS 定位

### 静态定位 static

默认定位，相当于没有定位。

### 相对定位 relative

- 相对于元素原本的位置进行偏移
- 元素会浮起来，脱离标准流，但仍然占据原本的位置

### 绝对定位 absolute

- 相对于最近的具有定位属性的父元素进行偏移，若没有，则相对于 `body` 进行偏移
- 元素脱离标准流，且不占据原本的位置
- 通常是“子绝父相”

### 固定定位 fixed

- 相对于浏览器窗口进行偏移
- 不会随着浏览器窗口的滚动而滚动
- 可用于创建固定头部、底部

```css
// 创建全屏遮罩
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
}
```

#### 相关链接

[CSS 的几种定位详解](https://blog.csdn.net/weixin_38055381/article/details/81558288)

## CSS `:global`

在 CSS 局部作用域覆盖默认样式。

如覆盖 Ant Design 组件的默认样式。

```css
// index.module.scss

.father {
  color: green;
}

:global {
  // antd 的默认样式被覆盖
  .ant-form-head {
    color: red;
  }
}
```

```jsx
import { Form } from 'antd';
import styles from './index.module.scss';

export default const Hello = () => {
  return (
    <Form>
      <div className={styles.father}></div>
    </Form>
  )
}
```

#### 相关链接

[CSS 中的 global](https://blog.csdn.net/qq_36209248/article/details/90603474)

## CSS 属性浏览器私有前缀

```
Google Chrome、Safari：-webkit-
Firefox：-moz-
IE：-ms-
Opera：-o-
```

私有前缀是为了兼容老版本的浏览器。

什么是兼容？可以简单理解为一段代码在新的浏览器能正常运行，在老版本的浏览器也能正常运行。

对于一些新的 CSS 属性，老浏览器可能运行异常，通过添加私有前缀，让这个属性只在指定内核的浏览器生效，老浏览器就忽略这个属性。

等到该属性成熟、所有浏览器都支持后，就可以去掉私有前缀。

```css
h1 {
  font-size: 40px;
  color: black;
  -webkit-text-stroke: 2px red;
}
```

#### 相关链接

[浏览器的私有前缀理解](https://blog.csdn.net/Dreammin/article/details/104663120)

[-moz、-ms、-webkit 浏览器私有前缀详解，作用、出处](https://blog.csdn.net/wyx100/article/details/50450728)


## `break-all` 单词内换行

通过设置 `word-break: break-all;` 实现单词内换行。一长串数字或字母可以换行，不至于溢出盒子。

```css
.text {
  word-break: break-all;
}
```