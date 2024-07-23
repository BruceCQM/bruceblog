# 浏览器相关

## requestAnimationFrame

requestAnimationFrame 是一个浏览器提供的方法，用于在浏览器下次重绘之前执行回调函数，通常用于动画和游戏开发。

它会把每一帧中的所有DOM操作集中起来,在重绘之前一次性更新,并且关联到浏览器的重绘操作。

优点：

1. requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，通常每秒60帧。

2. 在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这意味着更少的 CPU、GPU 和内存使用量。（文心一言网页版应该使用的这个，如果离开对话页面，文心一言会停止内容输出）

3. 函数节流，requestAnimationFrame 可保证每个刷新间隔内，函数只被执行一次。

requestAnimationFrame(callback) 触发的 callback 方法会接受一个时间戳参数，所以如果不想直接跟随浏览器系统帧频的话，可以利用这个时间戳参数来做到自定义帧频，做法就是当前时间减去所记录的上一次的时间，如果超过自定义的帧频时间，就可以真正做渲染。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .father {
      width: 100px;
      height: 100px;
      background-color: red;
      position: relative;
    }
  </style>
</head>
<body>
  <div class="father">123</div>
</body>
<script>
  var father = document.querySelector('.father');
  var flag = true;
  var left = 0;
  var lastTime = Date.now();
  var gapTime = 500;
  var nowTime = 0;

  function render() {
    if (flag) {
      if (left >= 100) {
        flag = false;
      }
      father.style.left = `${left++}px`;
    } else {
      if (left <= 0) {
        flag = true;
      }
      father.style.left = `${left--}px`;
    }
  }

  function loop() {
    var nowTime = Date.now();
    if (nowTime - lastTime >= gapTime) {
      lastTime = nowTime;
      render();
    }
    var id = requestAnimationFrame(loop);
    // if (left === 50) {
    //   cancelAnimationFrame(id);
    // }
  }

  loop();
  // setInterval(function() {
  //   render()
  // }, 10);
</script>
</html>
```

[requestAnimationFrame详解](https://www.jianshu.com/p/fa5512dfb4f5){link=static}

[浅析requestAnimationFrame的用法与优化](https://segmentfault.com/a/1190000044314827){link=static}