# 杂记

简要记录些工作中遇到的杂七杂八问题。

## 那些比较复杂的CSS选择器

1、`.radio:not(:last-child)::after`

选择所有不是其父元素最后一个子元素的 `.radio` 元素，并在其后插入伪元素。

也就是选择除了最后一个的其它所有 `.radio` 元素。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .radio-group {
        display: flex;
        align-items: center;
      }
      .radio {
        position: relative;
        padding-right: 20px;
      }
      .radio:not(:last-child)::after {
        content: "|";
        position: absolute;
        right: 0;
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="radio-group">
      <label class="radio">Option 1</label>
      <label class="radio">Option 2</label>
      <label class="radio">Option 3</label>
      
      <div class="radio-group2">
        <label class="radio">Option 11</label>
        <label class="radio">Option 22</label>
        <label class="radio">Option 33</label>
      </div>
    </div>
  </body>
</html>
```

## iPhone 如何安装 whistle 证书

简要步骤：

- 扫描 whistle 二维码，用 Safari 下载证书。
- 安装证书。
- 开启信任证书。

[whistle苹果手机安装证书步骤](https://blog.csdn.net/qq_44859233/article/details/123834624){link=static}

## iOS手机无法安装 Charles 的 ssl 证书

新 IPhone 安装 Charles 证书有问题。

[iOS手机无法安装Charles 的ssl证书](https://blog.csdn.net/qq_43485197/article/details/132272661){link=static}

## 某些移动安卓设备 `font-weight: 600` 不生效

在某些安卓的移动端设备上，`font-weight: 600` 不生效，字体并没有加粗。这是因为在某些设备上，缺少对某些字体的粗细支持。

一般而言，绝大多数设备支持对 400 和 700 的粗细字体样式。也就是常见的 `font-weight: normal` 和 `font-weight: bold`。

而苹果设备对字体粗细的支持程度做的比安卓好很多，可以看到不同数值粗细的变化。

![font-weight不生效](./images/problems/font-weight.png)

[font-weight 失效移动安卓处理方法](https://blog.csdn.net/weixin_41697143/article/details/104517239){link=card}

## iOS机型二级页面返回到首页不刷新问题

宿主环境：某银行APP，机型：iPhone。

解决代码：
```js
// 解决ios部分机型二级页返回不刷新的问题
window.onpageshow = async (event) => {
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    if (isIOS()) {
      // 刷新页面操作
      this.refreshPage();
    }
  }
};
```

- `window.onpageshow` 事件在页面显示时触发，包括从缓存中恢复页面时。

- `event.persisted` 属性表明页面是否在缓存中加载的。

- `window.performance.navigation.type` 属性返回页面导航的类型，其中 2 表示页面通过浏览器的「前进」或「后退」按钮加载的。

## iOS机型二级页面返回,上一级页面状态没重置

机型：iPhone 14，系统：iOS 16.0.3。

问题描述：H5页面，从A页面跳转到B页面，在B页面调用 `Taro.navigateBack()` 后退路由，回到A页面，发现A页面的状态没有重置，从而导致其子组件重复执行了 `componentDidMount` 生命周期钩子。

而子组件的 `componentDidMount` 生命周期钩子又存在跳转到B页面的逻辑，因此导致页面来回跳转，陷入死循环。

问题代码模拟：

```js
// A.jsx
import SubComponent from '../SubComponent';

export default class AComponent extends Component {
  render() {
    const { showSub } = AStore || {};
    return (
      {showSub && <SubComponent />}
    )
  }
}

// SubComponent.jsx
export default class SubComponent extends Component {
  componentDidMount() {
    this.jumpToB();
  }
}
```

关键就在于 showSub，它的默认值是 false，其它机型从B页面返回的时候，它都会重置为 false，而在 iPhone14 中确始终是 true，导致 SubComponent 重复执行了 componentDidMount 生命周期钩子。

解决办法：针对 iOS 机型，在 componentDidMount 中增加变量判断，控制只执行一次初始化的跳转。由于没有办法精准判断 iPhone14，同时为了减少影响范围，只判断 iOS 机型，安卓机型不做处理。

```js
// SubComponent.jsx
let isIOSFirst = true;
export default class SubComponent extends Component {
  componentDidMount() {
    if (isIOS() && !isIOSFirst) {
      return;
    }
    if (isIOS()) {
      isIOSFirst = false;
    }
    this.jumpToB();
  }
}
```