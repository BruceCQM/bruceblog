# 浏览器相关

## 1. requestAnimationFrame

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

## 2. 重排重绘

### 重排重绘是什么？

- 重排（reflow）：又叫回流。当页面元素的**几何属性**（如宽、高、内外边距、position、display:none）发生变化，导致元素的位置大小发生改变时，浏览器需要重新**构建渲染树（计算 DOM 元素最终在屏幕显示的大小和位置）**，这个过程称为重排。一个节点的重排往往会导致它的子节点以及同级节点的重排。

- 重绘（repaint）：元素的样式发生改变，浏览器需要重新**将元素绘制到屏幕**上，这个过程称为重绘。

- 重排一定导致重绘，重绘不一定导致重排（如仅仅是颜色发生变化）。

### 重排的触发原因

重排是因为元素的几何属性发生变化，它的触发机制如下。

- 页面的初始化渲染（不可避免）

- 添加、删除**可见的**DOM 元素

- 元素本身的尺寸改变（如内外边距、宽高、边框厚度）

- 元素位置改变（display、float、position、overflow 等）

- 元素字体大小发生改变

- 浏览器窗口大小改变

- 内容改变，如文本改变或图片大小改变引起的宽高改变

- 动画效果

- 获取某些特殊属性。当获取一些属性时，浏览器为了能得到正确的值会强制触发重排，导致队列刷新，这些属性包括：

  - offset(Top/Left/Width/Height)

  - scroll(Top/Left/Width/Height)

  - cilent(Top/Left/Width/Height)

  - width,height

  - 调用了 getComputedStyle() 或者 IE 的 currentStyle

### 浏览器优化重排的措施

浏览器通过**队列化修改和批量运行来**优化重排，减少重排次数。

浏览器会维护 1 个队列，把所有引起重排、重绘的操作都放到这个队列当中，等队列中的操作达到一定数量或者到了一定的时间间隔，浏览器会刷新队列，进行一次批处理，这样多次重排重绘就会变成一次。

但是，对于一些特殊的几何属性，如 offsetTop、offsetLeft，这些都是需要实时返回给用户的属性，为了保证返回正确的值，浏览器会立即刷新队列，触发重排重绘。

### 开发者优化重排的措施

#### 1. 集中样式改变

不要一条一条地修改 DOM 的样式。通过**切换类名**修改样式，或者使用 **cssText 属性**。

```js
// 不推荐的写法
var element= document.getElementById('id');
element.style.width='20px';
element.style.height='20px';
element.style.border='solid 1px red';

// 推荐写法
ele.style.cssText = 'width:20px;height:20px;border:solid 1px red';
```

[cssText用法和使用说明](https://www.cnblogs.com/Joe-and-Joan/p/10036828.html){link=static}

#### 2. 批量修改 DOM 元素

对要操作的元素进行“离线处理”，处理完成后一起更新。

核心思想：元素脱离文档流，对其进行改变，将元素带回文档中。

- 使用 display:none，隐藏元素进行修改后再显示。这种方法触发 2 次重排，分别是元素的隐藏和显示过程。

- 使用文档片段 DocumentFragment 进行缓存操作。先使用文档片段（createDocumentFragment）创建一个子树，然后再拷贝到文档中。触发 1 次重排。

- 使用 cloneNode(true or false) 和 replaceChild 技术。将原始元素拷贝到一个独立的节点中，操作这个节点，然后覆盖原始元素，触发 1 次重排。

```js
// 隐藏，修改，显示
let ul = document.querySelector('#mylist');
ul.style.display = 'none';
appendNode(ul, data);
ul.style.display = 'block';

// 文档片段
let fragment = document.createDocumentFragment();
appendNode(fragment, data);
ul.appendChild(fragment);

// 拷贝覆盖
let old = document.querySelector('#mylist');
let clone = old.cloneNode(true);
appendNode(clone, data);
old.parentNode.replaceChild(clone, old);
```

#### 3. 缓存布局信息

当访问 offsetTop、offsetLeft 这些特殊属性时，应该尽量减少对布局信息的查询次数。查询时，将其赋值给局部变量，使用局部变量参与计算。

```js
// 将div 向右下方平移，每次移动 1px，起始位置 100px、100px

// 性能糟糕的代码
div.style.left = 1 + div.offsetLeft + 'px';
div.style.top = 1 + div.offsetTop + 'px';

// 上述代码每次都会访问 div 的 offsetLeft，导致浏览器强制刷新渲染队列以获取最新的 offsetLeft 值
// 应该将这个值保存下来，避免重复取值
current = div.offsetLeft;
currentTop = div.offsetTop;
div.style.left = 1 + ++current + 'px';
div.style.top = 1 + ++currentTop + 'px';
```

## 3. 浏览器垃圾回收机制

垃圾回收 GC：Garbage Collection。

浏览器的垃圾收集器会定期（周期性）找出那些不再继续使用的变量，接着释放其内存。这个过程不是实时的，因为其开销比较大，并且 GC 时停止响应其它操作，因此垃圾回收器会按照固定的时间间隔周期性地执行。

不再使用的变量，即生命周期结束的变量，只可能是局部变量，全局变量的生命周期直到浏览器卸载页面才会结束。

垃圾回收的两种方式：标记清除法和引用计数法。

### 标记清除

标记清除法保留「可达性」的值，清除「不可达」的变量。

有一些是永远是「可达」的，无法删除，这些值称为根。例如：

- 全局变量

- 本地函数的局部变量和参数（在该函数执行的时候，它们是根）

如果变量可以从根开始访问到，则认为这个值是可访问的。不可访问的就是垃圾。

标记清除法的垃圾回收步骤如下：

- 垃圾回收器获取根，并标记它们。

- 访问并标记所有根引用的值。

- 再访问标记这些值的所有引用，以此类推。

- 除了被标记的对象，其它对象就是垃圾，都被删除。

![标记清除法](./images/browser/mark_sweep_gc.png)

### 引用计数

引用计数的含义是跟踪记录每个值被引用的次数。

```js
function test() {
  var a = {}; //a的引用次数为0
  var b = a; //a的引用次数加1，为1
  var c = a; //a的引用次数再加1，为2
  var b = {}; //a的引用次数减1，为1
}
```

引用计数会遇到严重的问题：循环引用。循环引用指的是对象A中包含一个指向对象B的指针，而对象B中也包含一个指向对象A的引用。

```js
function fn() {
  var a = {};
  var b = {};
  a.pro = b;
  b.pro = a;
}
```

以上代码a和b的引用次数都是2，fn()执行完毕后，两个对象都已经离开环境，在标记清除方式下是没有问题的，但是在引用计数策略下，因为a和b的引用次数不为0，所以不会被垃圾回收器回收内存，如果fn函数被大量调用，就会造成内存泄露。在IE7与IE8上，内存直线上升。

IE中有一部分对象并不是原生js对象。例如，其内存泄露DOM和BOM中的对象就是使用C++以COM对象的形式实现的，而COM对象的垃圾回收机制采用的就是引用计数策略。因此，即使IE的js引擎采用标记清除策略来实现，但js访问的COM对象依然是基于引用计数策略的。换句话说，只要在IE中涉及COM对象，就会存在循环引用的问题。

### GC 算法

JavaScript 引擎基础 GC 方案是 mark and sweep（标记清除）。

- 遍历所有可访问对象。

- 回收不可访问的对象。

GC的缺陷：

GC时，停止响应其他操作，这是为了安全考虑。而Javascript的GC在100ms甚至以上，对一般的应用还好，但对于JS游戏，动画对连贯性要求比较高的应用，就麻烦了。这就是新引擎需要优化的点：避免GC造成的长时间停止响应。

### GC 优化策略

1. 分代回收（Generation GC）

通过区分「临时」和「持久」对象，多回收临时对象区（young generation），少回收持久对象区（tenured generation），从而减少每次需要遍历的对象，降低 GC 耗时。

持久对象的回收检查频率会降低。

对于tenured generation对象，有额外的开销：把它从young generation迁移到tenured generation，另外，如果被引用了，那引用的指向也需要修改。

2. 增量 GC

主要思想：每次处理一点，下次再处理一点，如此类推。

这种方案，虽然耗时短，但中断比较多，带来上下文切换频繁的问题。

3. 空闲时间回收

垃圾回收器只在 CPU 空闲时候运行，减少对执行的可能影响。

要根据实际应用选择不同方案。

### 内存泄漏问题

- 闭包导致的内存泄漏

- bind、call、apply 引起的泄漏问题

- 使用了 addEventListener，但是没有 removeEventListener

[前端面试：谈谈 JS 垃圾回收机制](https://segmentfault.com/a/1190000018605776){link=static}

[浏览器中的垃圾回收与内存泄漏](https://juejin.cn/post/6844903828102316045){link=static}

## 4. 跨域

同源策略：浏览器为了保证用户信息的安全，防止恶意网站窃取数据，禁止不同域之间的 JS 进行交互。对于浏览器而言，只要协议、域名、端口号其中一个不同，就会引发同源策略，从而限制不同域之间的交互行为。

解决方案详见第一篇文章。

[JS中的跨域问题及解决办法汇总](https://blog.csdn.net/lareinalove/article/details/84107476){link=static}

[浏览器同源政策及其规避方法-阮一峰](https://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html){link=static}

[跨域资源共享 CORS 详解-阮一峰](https://www.ruanyifeng.com/blog/2016/04/cors.html){link=static}