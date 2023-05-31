# 前端编程题

## debounce 防抖

防抖原理：连续触发事件，只有最后一次事件被触发 n 秒之后才会执行回调，是解决事件频繁触发的手段之一。

实现思路：

- 事件触发，设置定时器，在 n 秒之后调用回调
- 若 n 秒之内再次触发事件，则清空定时器并重新设置

注意事项：`this` 指向的修正、参数的正确传递。

```js
function debounce(func, wait) {
  let timeout = null;

  return function() {
    const context = this;
    const args = arguments;

    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait)
  }
}
```