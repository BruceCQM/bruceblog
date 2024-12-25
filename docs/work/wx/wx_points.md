# 小程序开发的坑

## 图片组件宽高自适应

接到一个需求，需要在小程序中展示图片，自然而然需要使用到 Image 图片组件。由于项目使用的是Taro，因此使用的是Taro的 `Image` 图片组件。

### 错误方法

产品要求的是宽度 100% 屏幕宽度，高度自适应。如果是浏览器，给图片设置 `width: 100%`，那么高度就会自适应了。然而实际上小程序不会。

```jsx
import { Image } from '@tarojs/components';
import './index.scss';

<Image
  src={imageUrl}
  className="photo"
/>
```

```scss
.photo {
  width: 100%;
}
```
实际效果是，宽度铺满了屏幕，但高度始终是固定的。这就造成了图片的变形。

后来尝试过给图片设置 `object-fit: contain` 属性，依然不奏效。

### 问题根源

查看页面元素，发现小程序为 image 标签设置了如下属性。

```css
image {
  display: inline-block;
  height: 240px;
  width: 320px;
  overflow: hidden;
}
```

这导致了高度无法自适应的问题，但是也不能设置图片高度，因为每张图片的宽高也不一样。

### 解决方法

通过查阅 Taro 和微信小程序官方文档，发现 Image 组件提供了 mode 属性可设置图片裁剪、缩放模式。

其中，将 mode 属性设置为 `widthFix` 即可实现需要的效果，宽度固定，高度自适应。

```jsx
<Image
  src={imageUrl}
  className="photo"
  mode="widthFix"
/>
```

折腾半天，这么一个属性就解决了。

:::warning 教训
遇到问题积极查资料、看文档。
:::

### 相关链接

[微信小程序——image图片组件宽高自适应方法](https://blog.csdn.net/weixin_42326144/article/details/104817585){link=card}

[image 属性说明](https://developers.weixin.qq.com/miniprogram/dev/component/image.html){link=card}

## 点击全屏预览图片

使用 `Taro.previewImage()` 方法，传入 `urls` 和 `current` 参数，分别是图片链接列表、当前预览的图片链接。

```js
bigImage = (url) => {
  const { imageSrcs } = this.state;
  Taro.previewImage({
    current: url, // 当前显示图片的http链接
    urls: imageSrcs // 需要预览的所有图片http链接列表
  });
};

<Image
  src={imageUrl}
  className="photo"
  mode="widthFix"
  onClick={(imageUrl) => this.bigImage(imageUrl)}
/>
```

[Taro.previewImage](https://taro-docs.jd.com/docs/apis/media/image/previewImage){link=card}

## 小程序页面栈溢出报错

小程序页面栈溢出报错 `navigateTo fail page limit exceeded`

报错原因：小程序页面栈最多十层，反复使用 `navigateTo` 跳转页面，压入页面栈，会导致报错。

判断是否页面栈溢出，可以使用 `getCurrentPages` 获取当前页面栈，如果栈内页面数量大于 10，说明页面栈溢出，使用 `redirectTo` 跳转页面。

```js
const pages = getCurrentPages();
if(pages.length >= 10) {
  // 替换当前页面栈，类似 history.replace()
  Taro.redirectTo({ url: '' });
} else {
  Taro.navigateTo({ url: '' });

}
```

[小程序页面跳转，页面栈提示”navigateTo fail page limit exceeded“错误，解决办法](https://blog.csdn.net/qq_35310623/article/details/108082712){link=card}

## 微信小程序地图设置圆角

直接给 `<Map>` 组件设置 `border-radius` 属性不生效。

解决方案：`<Map>` 外面包一层 `<View>`，设置 View 的圆角属性，同时添加 `overflow: hidden` 样式。

这个方法在 IOS 中圆角不生效，还需要增加 `transform: translateY(0)` 样式属性。

```jsx
import { Map, View, Image } from '@tarojs/components';

<View
  style={{
    width: '100%',
    height: '290rpx',
    borderRadius: '10px',
    overflow: 'hidden',
    transform: 'translateY(0)'
  }}
>
  <Map
    style={{ width: '100%', height: '330rpx' }}
    onTap={this.onTap}
    circles={circles}
    longitude={longitude}
    latitude={latitude}
    showLocation
    scale={14}
  />
</View>
```

[map 地图组件设置圆角](https://developers.weixin.qq.com/community/develop/doc/000088de32c6d80c00e7444895ac00){link=card}

## 地图点击 marker 获取的 markerId 不对

微信小程序地图的 marker 的 id 是要传 number 类型的数据进去的，如果是 string 类型会被转成 number 类型。

如果原始的 id 是很长的字符串，转成 number 类型会和原来不同。

```js
str = '19823791827379832384891';
num = Number(str); // num和str不相同
```

[使用微信小程序的过程中 点击marker获取markerId 并不是数据的id?](https://developers.weixin.qq.com/community/develop/doc/00080074b54048165a0d6d3b35b800){link=card}

## showToast 提示的问题

### 文案有长度限制

[小程序基础库在1.9.0以上，但wx.showToast内容在真机上还是显示不全？](https://developers.weixin.qq.com/community/develop/doc/00066e522dcba0e903d11311661800){link=static}

小程序的 [showToast()](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showToast.html) 提示有长度限制，最多展示两行。对于长文本要么使用其它 Toast 组件，要是改用 [showModal()](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html) 对话框展示

一个通用的做法是，自己封装一个方法，如果文案长度小于20，使用 showToast，否则使用 showModal。其实这也应当成为公司 toast 提示的规范。如果想使用 showToast 的样式，必须要精简文案。

```js
const myToast = (options) => {
  const { msg = '' } = options || {};
  if (msg.length <= 0) {
    return;
  }
  if (msg.length < 20) {
    Taro.showToast({ ...options, title: msg });
  } else {
    Taro.showModal({
      ...options,
      content: msg,
      showCancel: false,
    })
  }
}
```

### 闪一下消失

[wx.navigateTo 打断wx.showToast ！？](https://developers.weixin.qq.com/community/develop/doc/000a6a819f8f604ba652e53956b800){link=static}

showToast() 是依赖于页面存在的，不是全局的，因此当前页面消失 showToast 也会跟着消失，所以会出现 navigateTo() 跳转页面时 showToast 闪一下就消失的问题。

可以现在A页面 showToast 提示完，在 success 回调中使用 navigateTo 跳转到B页面。

如果需要在B页面 toast 提示，只能尝试下在 navigateTo 的 success 回调中调用 showToast，但大概率还是会闪烁的，因为 success 回调很快就会触发，但跳转页面一般会卡。可以尝试下设置定时器延时 1.5s 再 showToast 提示，根据实际情况调整时间。

```js
Taro.navigateTo({
  url: 'xxx',
  success() {
    setTimeout(() => {
      Taro.showToast({ title: '提示文案', duration: 2000 })
    }, 1500)
  }
})
```