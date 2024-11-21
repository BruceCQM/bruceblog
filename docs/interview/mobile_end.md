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