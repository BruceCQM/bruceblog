# 移动端相关内容

## PWA 技术

一、PWA 概述

[一文读懂什么是 PWA（Progressive Web App）](https://blog.csdn.net/sunyctf/article/details/136003062){link=static}

二、PWA 相关技术解析

[前端应该了解的PWA](https://juejin.cn/post/6844903603967115272){link=static}

[【PWA学习】3. 让你的 WebApp 离线可用](https://www.jianshu.com/p/0121d1793d01){link=static}

三、搭建一个简易的 PWA 应用

[PWA介绍及快速上手搭建一个PWA应用](https://segmentfault.com/a/1190000014639473){link=static}

四、PWA 在国内的未来

[小程序鼻祖 —— 在国内逐渐消亡的 PWA 可以带给我们哪些启示？](https://segmentfault.com/a/1190000041729491){link=static}

## 视口 viewport

三种视口：布局视口、理想视口、视觉视口。

- 布局视口：可以简单理解为就是 HTML 元素的宽度。在 PC 端上，布局视口默认等于浏览器窗口的宽度。

- 理想视口：设备屏幕宽度。

- 视觉视口：用户可以看到的区域宽度。

利用 meta 标签控制移动端视口的终极方案，也是现在基本固定的写法：

```html
<meta content="width=device-width,initial-scale=1,user-scalable=no" name="viewport">
```

- 将 width 设置为 device-width，使「布局视口」=「理想视口」，initial-scale 设置为 1，使「视觉视口」=「理想视口」/ 1 = 「理想视口」，从而实现三个视口相等。

- meta viewport 标签只对移动端浏览器有效，对 PC 端浏览器是无效的

[详解meta-viewport标签中的width和initial-scale属性](https://blog.csdn.net/leman314/article/details/111936863){link=static}

## 移动端适配

移动端适配的目标是，在不同的移动端设备中网页显示相同的效果。要求严格的公司甚至要求不同设备每行显示的字数都一样。

几种常见的适配方案：

- rem 布局

- vm/vh 布局

- 百分比布局

- 响应式布局

-  px 为主，搭配 vw/vh、媒体查询与 flex 进行布局

参考文章：

[移动端适配的5种方案](https://juejin.cn/post/6953091677838344199){link=static}

[一次说清楚，以后不要再问移动端怎么适配了！](https://zhuanlan.zhihu.com/p/267774232){link=static}

## 移动端兼容性问题

[移动端兼容性问题集锦】兼容性问题及解决方案](https://juejin.cn/post/6901940698518732808){link=static}

### 安卓兼容性问题

1. border-radius:50%不圆，因为，使⽤了rem布局，在部分机型上出现的问题，设置具体的px数值，不⽤50%即可。

2. line-height 不居中。Android 在排版计算的时候参考了 primyfont 字体的相关属性。

primyfont 的查找是看 `font-family` ⾥哪个字体在fonts.xml ⾥第⼀个匹配上，⽽原⽣ Android 下中⽂字体是没有 family name 的，导致匹配上的始终不是中⽂字体，所以解决这个问题就要 `fontfamily` ⾥显式申明中⽂，或者通过什么⽅法保证所有字符都fallback到中⽂字体。

针对Android 7.0+设备：`<html>`上设置 lang 属性：`<html lang="zh-cmn-Hans">`，同时 fontfamily 不指定英⽂，如 font-family: sans-serif 。

针对MIUI 8.0+设备：设置 font-family:miui 。这个⽅案就是显式声明中⽂的⽅案。

3. input的 placeholder 偏上。`input { line-height:normal; }`。

4. font-weight 设置 500 和 600 是⽆效的。如果缺少 500 ，那么会向下取值400。加粗可以设置 bold。

### IOS 兼容性问题

1. 滚动穿透，设置大容器 wrap，添加属性 `overflow: hidden`。

2. 滚动不流畅。设置 `-webkit-overflow-scrolling: touch`。

3. 滚动时，动画停止。

IOS 中，touch 的优先级高。当系统接收到 touch 事件后会优先响应，此时会暂停屏幕上包括 JS、css 的渲染。不光是 css 动画不动了，哪怕页面没有加载完，如果手指头还停留在屏幕上，页面也不会继续加载，直到手松开。（移动端滚动推荐使用 better-scroll 插件）

4. 当键盘弹起时，fixed 会失效，输入框被遮挡，手动滚动至底部即可。或者把页面滚动改为容器内滚动。

5. 底部安全距离。

6. 旋转字体变大：`-webkit-text-size-adjust: none`。

### 移动端点击事件 300ms 延迟

双击缩放(double tap to zoom)，这也是会有上述 300 毫秒延迟的主要原因。双击缩放，即用手指在屏幕上快速点击两次，iOS 自带的 Safari 浏览器会将网页缩放至原始比例。

假定这么一个场景。用户在 iOS Safari 里边点击了一个链接。由于用户可以进行双击缩放或者单击跳转的操作，当用户一次点击屏幕之后，浏览器并不能立刻判断用户是确实要打开这个链接，还是想要进行双击操作。因此，iOS Safari 就等待 300 毫秒，以判断用户是否再次点击了屏幕。

鉴于 iPhone 的成功，其他移动浏览器都复制了 iPhone Safari 浏览器的多数约定，包括双击缩放，几乎现在所有的移动端浏览器都有这个功能。

解决方法：

1. fastclick: FastClick 的原理是在 touchend 阶段调用 event.preventDefault，然后通过 document.createEvent 创建一个自定义事件 MouseEvents，再通过 eventTarget.dispatchEvent 触发对应目标元素上绑定的 click 事件。

2. 禁止缩放：会把双手缩放页禁止掉。

```html
<meta name="viewport" content="user-scalable=no" />
或者
<meta name="viewport" content="initial-scale=1,maximum-scale=1" />
```

3. 设置 `width=device-width`，会保留双手缩放。

```html
<meta name="viewport" content="width=device-width" />
```

4. 设置指针事件

```css
html {
  touch-action: manipulation;
}
```

[移动端300ms延迟原因及解决方案](https://juejin.cn/post/6844904031026937864){link=static}

### 音视频相关

1. 自动播放

- iOS Safari、IPhone Safari 中不支持，但在 webview 中可能被开启。iOS 开发文档明确说明蜂窝网络下不允许 autoplay。

- Chrome 中，设置 mouted 后可以自动播放。

- 微信中不允许⾃动播放。但是可以借助 WeixinJSBridge 实现。

2. 单例

- ios safari 中的⾳频对象是单例的，ios 中⽆法播放多个⾳频⽂件。

3. 循环播放

ios 部分机型不⽀持循环播放。解决⽅案：监听播放完成事件 ended，⼿动触发播放。

4. 其它

ios 视频⾃动全屏播放：设置内联属性 `playsinline webkit-playsinline`。