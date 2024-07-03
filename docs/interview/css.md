# css

## css 盒子模型

css 盒子模型是 css 布局的基础。每个盒子由四个部分组成：内容（content）、内边距（padding）、边框（border）、外边距（margin）。

css 盒子模型分为两种：

- 标准盒子模型：在标准盒子模型当中，盒子的宽度和高度是指内容 content 的宽高，不包括内边距、边框。因此设置内边距和边框，会把盒子撑大。

- 怪异盒子模型（IE盒子模型）：在怪异盒子模型当中，盒子的宽高包括了内边距和边框。因此设置内边距和边框，不会把盒子撑大。

可以通过设置 `box-sizing` 属性来改变盒子模型。

- `content-box`：标准盒子模型，默认值。

- `border-box`：怪异盒子模型。

## css 百分比

css 不同属性的百分比值，参照的基准不一样。

1. 参照**父元素宽度**：padding、margin、width、text-indent。

2. 参照**父元素高度**：height。

3. 参照**父元素相同属性**：font-size、line-height。

4. 相对定位的元素，top、bottom 参照的是父元素**内容（content）**的高度，left、right 参照的是父元素内容的宽度。

5. 绝对定位的元素，参照的分别是**最近的定位元素包含 padding 的高度和宽度**。绝对定位的元素以最近的设置了定位的元素为参照元素，只要 position 不是 static 就算是设置了定位，因为 static 是默认值。

## css 定位

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
