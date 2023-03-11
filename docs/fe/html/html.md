# HTML

## `noscript` 标签

`noscript` 标签是一个古老的标签，当初被引入的目的是帮助老旧的浏览器平滑升级更替，早期的浏览器不支持 JavaScript，因此使用 `noscript` 标签显示替代的内容

`noscript` 标签在下面两种情况下起作用：

- 浏览器不支持 JavaScript
- 浏览器支持 JavaScript，但被禁用

```html
<noscript> 老铁，这个页面需要 JavaScript 支持啊 </noscript>
```

网站不能强制开启 JavaScript，但增加提示还是比较用户友好的。

## 获取 `html head body` 标签

```js
document.documentElement
document.head
document.body
```

## `!DOCTYPE` 的作用

DOCTYPE 是文档类型 document type 的缩写，指明浏览器使用哪种 HTML 规范来解析页面。

若不添加，则采用混杂模式，每种浏览器都采用自身的方式解析渲染页面，导致页面效果可能不同。

添加之后，采用标准模式，每种浏览器都按照统一的 HTML 标准解析渲染页面。

#### 相关链接

[深入理解 DOCTYPE 的作用](https://blog.csdn.net/qq_38128179/article/details/80758192)

## `em` 和 `rem` 的区别

区别：参照物不同。

`em`：

- 元素的字体大小 `font-size` 相对于父元素的 `font-size`
- 元素的 `width heigth border margin padding` 相对于自身的 `font-size`

```html
<div>
  父元素div
  <p>
    子元素p
    <span>孙元素span</span>
  </p>
</div>
```

```css
div {
  font-size: 20px;
  width: 2em; /* 40px */
}
p {
  font-size: 0.5em; /* 10px */
  width: 2em; /* 20px */
}
span {
  font-size: 0.5em; /* 5px */
  width: 2em; /* 10px */
}
```

`rem`：

- 统一相对于根元素 `<html>` 的字体大小 `font-size`

```css
html {
  font-size: 16px;
}
div {
  font-size: 2rem; /* 32px */
  width: 10rem; /* 160px */
}
```

这两种都可做响应式，但 `rem` 更方便。

#### 相关链接

[css 中单位 em 和 rem 的区别](https://www.cnblogs.com/wind-lanyan/p/6978084.html)
