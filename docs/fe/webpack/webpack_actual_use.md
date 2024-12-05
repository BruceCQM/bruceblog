# webpack 实战

本文内容是极客时间《玩转webpack》课程的内容整理笔记。

## postcss插件autoprefixer自动补齐css属性前缀

根据 Can I Use 规则（ https://caniuse.com/ ），决定是否增加css属性前缀。

所需依赖：postcss-loader autoprefixer。

安装依赖：

```bash
npm i postcss-loader@3.0.0 autoprefixer@9.5.1 -D
```

增加配置：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.less$/,
        use: [
          'style-loader',
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("autoprefixer")({
                  browsers: ["last 6 version", ">1%", "ios 4"],
                }),
              ],
            },
          },
        ],
      },
    ]
  }
}
```

## 静态资源内联

所谓静态资源内联，就是在 HTML 文件中引入静态资源，比如图片、js、css等。

资源内联的意义：

1、代码层面

- 页面框架的初始化脚本

- 上报相关打点

- css 内联可避免页面闪动

2、请求层面

- 减少 HTTP 请求次数。小图片或者字体可以内联到 HTML 中，使用 url-loader。

### HTML、js内联

所需依赖：raw-loader。

HTML 内联：`${require('raw-loader!./meta.html')}`。

JS 内联：`<script>${require('raw-loader!babel-loader!../../node_modules/lib-flexible/flexible.js')}</script>`。

安装依赖，raw-loader 选择安装 0.5.x 的版本，高版本有问题。

```bash
npm i raw-loader@0.5.1 -D
```

HTML 文件使用 raw-loader：

```shell
.
├── src
│   ├── index
│   │   ├── index.html
│   │   └── index.js
|   |
│   ├── search
│       ├── index.html
|       ├── index.js
|       ├── search.less
│       └── meta.html
├── .gitignore
├── package.json
├── webpack.prod.js
...
```

```html
<!-- src/search/meta.html -->
<meta charset="UTF-8">
<meta name="viewport" content="viewport-fit=cover,width=device-width,initial-scale=1,user-scalable=no">
<meta name="format-detection" content="telephone=no">
<meta name="keywords" content="now,now直播,直播,腾讯直播,QQ直播,美女直播,附近直播,才艺直播,小视频,个人直播,美女视频,在线直播,手机直播">
<meta name="name" itemprop="name" content="NOW直播—腾讯旗下全民视频社交直播平台"><meta name="description" itemprop="description" content="NOW直播，腾讯旗下全民高清视频直播平台，汇集中外大咖，最in网红，草根偶像，明星艺人，校花，小鲜肉，逗逼段子手，各类美食、音乐、旅游、时尚、健身达人与你24小时不间断互动直播，各种奇葩刺激的直播玩法，让你跃跃欲试，你会发现，原来人人都可以当主播赚钱！">
<meta name="image" itemprop="image" content="https://pub.idqqimg.com/pc/misc/files/20170831/60b60446e34b40b98fa26afcc62a5f74.jpg"><meta name="baidu-site-verification" content="G4ovcyX25V">
<meta name="apple-mobile-web-app-capable" content="no">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<link rel="dns-prefetch" href="//11.url.cn/">
<link rel="dns-prefetch" href="//open.mobile.qq.com/">

<!-- src/search/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- 引入meta.html文件的内容 -->
  ${require('raw-loader!./meta.html')}
  <title>Document</title>
  <!-- 引入lib-flexible的flexible.js文件，babel-loader转化ES6语法 -->
  <script>${require('raw-loader!babel-loader!../../node_modules/lib-flexible/flexible.js')}</script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

### css内联

方案一：使用 style-loader。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top', // 样式插入到head
              singleton: true, // 将所有的style标签合并成一个
            }
          },
          'css-loader',
          'scss-loader',
        ]
      }
    ]
  }
}
```

方案二：使用 html-inline-css-webpack-plugin。