# HTML

## Canvas 使用

Canvas 入门指南详见：

[Canvas 入门指南](https://juejin.cn/post/6963197337350963230){link=static}

```html
<!-- Canvas 绘制矩形例子 -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas</title>
</head>
<body>
  <canvas id="canvas">
    Your browser does not support the HTML5 canvas tag.
  </canvas>
  <script>
    // 获取画布对象
    const canvas = document.getElementById('canvas');
    // 创建绘制对象
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    // 绘制矩形
    ctx.fillRect(30, 10, 30, 30);
    // 绘制矩形边框
    ctx.strokeRect(10,30,30,30);
    // 清楚指定区域的矩形
    ctx.clearRect(40,20,10,10)
  </script>
</body>
</html>
```

![Canvas paint Rectangle](./images/html/canvas_paint_rect.png)

MDN Canvas 教程：

[Canvas 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial){link=static}

## Canvas 和 SVG 区别

Canvas 是 H5 新出来的标签，可以理解为 Canvas 提供一个画布，利用 JS 在上面绘制图像。通过使用绘制工具 `getContext("2d")` 绘制图像。

SVG 是可缩放矢量图形（Scalable Vector Graphics），基于可扩展标记语言 XML。

两者区别：

- Canvas 绘制的是位图，依赖分辨率；SVG 绘制的是矢量图，不依赖分辨率。

- Canvas 就像动画，每次显示全部的一帧内容，想改变某个元素需要再下一帧中全部重新显示；SVG 把图形以 DOM 节点的形式插入页面，可以用 JS 操作。

- Canvas 是逐个像素进行渲染的，一旦图形绘制完成，就不会被浏览器关注；而 SVG 是通过 DOM 操作来显示。因此 Canvas 的文本渲染能力弱。

- SVG 适合带有大型渲染区域的程序，比如地图；Canvas 适合有许多对象要被频繁重绘的图形密集型游戏，SVG 由于 DOM 操作，在复杂度高的游戏应用中，会减慢渲染速度，因此不适合在游戏应用。

- Canvas 不支持事件处理器，因为 Canvas 绘制的图像都在画布里，不能用 JS 获取；而 SVG 支持事件处理器。