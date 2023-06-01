# 前端编程题

## debounce 防抖

防抖原理：连续触发事件，只有最后一次事件被触发 n 秒之后才会执行回调，是解决事件回调频繁调用的手段之一。

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

## throttle 节流

节流原理：连续触发事件，每隔 n 秒执行一次回调，解决事件回调频繁调用的手段之一。

实现思路：主要有两种，使用时间戳判断和定时器。

### 时间戳

主要流程：
- 一个变量 `now` 记录当前事件触发的时间戳，一个变量 `previous` 记录上一次触发的时间戳
- 事件触发，判断 `now` 与 `previous` 的差值是否大于时间间隔 `wait`。若大于则调用回调函数，并将 `previous` 更新为 `now` 的值
- 若 n 秒内再次触发事件，由于存在时间差节流阀，不会再次调用回调函数

```js
function throttle(func, wait) {
  let previous = 0;

  return function () {
    const context = this;
    const args = arguments;
    const now = +new Date();

    if (now - previous >= wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}
```

### 定时器

主要流程：
- 事件触发，设置定时器，在 n 秒之后执行回调函数并清空定时器
- 若 n 秒内再次触发事件，不会做任何动作

```js
function throttle(func, wait) {
  let timer = null;

  return function () {
    const context = this;
    const args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(context, args);
        clearTimeout(timer);
        timer = null;
      }, wait);
    }
  };
}
```

### 结合体

时间戳和定时器方式各有独特的效果：时间戳会在事件触发的时候立即执行一次回调函数，定时器方式会在停止触发事件之后再执行一次回调函数。

这就是 `lodash` 和 `underscore` 工具库 `throttle` 方法的 `leading` 和 `trailing` 配置参数。

[Lodash throttle](https://www.lodashjs.com/docs/lodash.throttle#_throttlefunc-wait0-options){link=card}

```js
function throttle(func, wait, option) {
  if (typeof option !== 'object') {
    option = {};
  }
  let previous = 0;
  let timer = null;
  const { leading, trailing } = option;

  const throttled = function () {
    const context = this;
    const args = arguments;
    const now = +new Date();
    if (previous === 0 && leading === false) {
      previous = now;
    }
    const remaining = wait - (now - previous);

    if (remaining <= 0) {
      // 若时间戳先执行了，清空定时器
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      func.apply(context, args);
      previous = now;
      return;
    }
    if (!timer && trailing === true) {
      timer = setTimeout(() => {
        // 若定时器先执行了，更新previous时间
        previous = +new Date();
        func.apply(context, args);
        clearTimeout(timer);
        timer = null;
      }, remaining);
    }
  };

  return throttled;
}
```

注意，若时间戳先执行了，则要清空定时器，若定时器先执行了，则要更新previous时间。否则如果不断触发事件，会出现执行两次回调的情况。