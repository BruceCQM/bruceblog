# 页面布局

## 案例适配方案

- 设计稿是 1920px
- 采用淘宝团队的适配方案 [flexible.js](https://segmentfault.com/a/1190000022509489) 进行 rem 适配布局
- flexible.js 默认将屏幕划分为 10 等份，在这里修改为 24 等份
- vscode 安装 px to rem & rpx(cssrem)插件，并将插件的 Root Font Size 设置为 80px (1920/24)，可自动计算 px 与 rem 之间的对应值

## 基础设置

- body 设置背景图，缩放为 100%，行高 1.15
- css 初始化

```less
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
li {
  list-style: none;
}
body {
  min-width: 1024px;
  background: url(../images/bg.jpg) no-repeat;
  background-size: cover;
  line-height: 1.15;
}
```

## header 布局

- 高度为 100px
- 背景图，在容器内显示
- 缩放比例为 100%
- h1 标题部分 白色 38 像素 居中显示 行高为 80 像素
- 时间模块 showTime 定位右侧 right 为 30px 行高为 75px 文字颜色为：rgba(255, 255, 255, 0.7) 而文字大小为 20 像素

```html
// 格式： 当前时间：2020年3月17-0时54分14秒
<script>
  var t = null
  t = setTimeout(time, 1000)
  function time() {
    clearTimeout(t)
    dt = new Date()
    var y = dt.getFullYear()
    var mt = dt.getMonth() + 1
    var day = dt.getDate()
    var h = dt.getHours()
    var m = dt.getMinutes()
    var s = dt.getSeconds()
    document.querySelector('.showTime').innerHTML = '当前时间：' + y + '年' + mt + '月' + day + '-' + h + '时' + m + '分' + s + '秒'
    t = setTimeout(time, 1000)
  }
</script>
```

```less
header {
  position: relative;
  height: 1.25rem;
  background: url(../images/head_bg.png) no-repeat top center;
  background-size: 100% 100%;
  // background-size: cover;
  h1 {
    color: #fff;
    text-align: center;
    font-size: 0.475rem;
    line-height: 1rem;
  }
  .show-time {
    position: absolute;
    right: 0.375rem;
    top: 0;
    line-height: 0.9375rem;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.25rem;
  }
}
```

## main-box 主体模块

- 需要一个上左右的 10px 的内边距
- column 列容器，分三列，占比 3：5：3

```less
.main-box {
  overflow: hidden;
  display: flex;
  min-width: 1024px;
  max-width: 1920px;
  padding: 0.125rem 0.125rem 0;
  .column {
    flex: 3;
    &:nth-child(2) {
      flex: 5;
      margin: 0 0.125rem 0.1875rem;
    }
  }
}
```

## 公共面板 panel

- 高度为 310px
- 1 像素的 1px solid rgba(25, 186, 139, 0.17) 边框
- 有 line.jpg 背景图片
- padding 为 上为 0 左右 15px 下为 40px
- 下外边距是 15px
- 利用 panel 盒子 before 和 after 制作上面两个角 大小为 10px 线条为 2px solid #02a6b5
- 新加一个盒子 before 和 after 制作下侧两个角 宽度高度为 10px

```less
.panel {
  position: relative;
  height: 3.875rem;
  border: 1px solid rgba(25, 186, 139, 0.17);
  background: url(../images/line.png) rgba(255, 255, 255, 0.04);
  padding: 0 0.1875rem 0.5rem;
  margin-bottom: 0.1875rem;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    border-left: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
  }
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
    border-right: 2px solid #02a6b5;
    border-top: 2px solid #02a6b5;
  }
  .panel-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 10px;
      height: 10px;
      border-left: 2px solid #02a6b5;
      border-bottom: 2px solid #02a6b5;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-right: 2px solid #02a6b5;
      border-bottom: 2px solid #02a6b5;
    }
  }
  h2 {
    height: 0.6rem;
    line-height: 0.6rem;
    color: #fff;
    font-size: 0.25rem;
    text-align: center;
    font-weight: 400;
  }
  a {
    color: #fff;
    text-decoration: none;
    margin: 0 10px;
  }
  .chart {
    height: 3rem;
  }
}
```

## 图表模块

- 标题模块 h2 高度为 48px 文字颜色为白色 文字大小为 20px
- 图表内容模块 chart 高度 240px
- 以上可以作为 panel 公共样式部分

```less
h2 {
  height: 0.6rem;
  line-height: 0.6rem;
  color: #fff;
  font-size: 0.25rem;
  text-align: center;
  font-weight: 400;
}
.chart {
  height: 3rem;
}
```

## 中间布局

> 上面是 no 数字模块，下面是 map 地图模块

数字模块：

1. 数字模块 no 有个背景颜色 rgba(101, 132, 226, 0.1); 有个 15 像素的内边距
2. 注意中间列 column 有个 左右 10px 下 15px 的外边距
3. no 模块里面上下划分 上面是数字（no-hd) 下面 是 相关文字说明(no-bd)
4. no-hd 数字模块 有一个边框 1px solid rgba(25, 186, 139, 0.17)
5. no-hd 数字模块 里面分为两个小 li 每个小 li 高度为 80px 文字大小为 70px 颜色为 #ffeb7b 字体是图标字体 electronicFont
6. no-hd 利用 after 和 before 制作 2 个小角， 边框 2px solid #02a6b5 宽度为 30px 高度为 10px
7. 小竖线 给 第一个小 li after 就可以 1px 宽 背景颜色为 rgba(255, 255, 255, 0.2); 高度 50% top 25% 即可
8. no-bd 里面也有两个小 li 高度为 40px 文字颜色为 rgba(255, 255, 255, 0.7) 文字大小为 18px 上内边距为 10px

地图模块：

1. 地图模块高度为 810px 里面包含 4 个盒子 chart 放图表模块 球体盒子 旋转 1 旋转 2
2. 球体图片直接设置为 map 的背景图片， 大小为 518px，定位到最中央 透明度 .3
3. 旋转 1 map2 大小为 643px 要加背景图片 因为要缩放 100% 定位到中央 透明度 .6 做旋转动画 利用 z-index 压住球体
4. 旋转 2 map3 大小为 566px 要加背景图片 因为要缩放 100% 定位到中央 旋转动画 注意是逆时针

```html
<div class="column">
  <div class="no">
    <div class="no-hd">
      <ul>
        <li>25337</li>
        <li>24901</li>
      </ul>
    </div>
    <div class="no-bd">
      <ul>
        <li>前端需求人数</li>
        <li>市场供应人数</li>
      </ul>
    </div>
  </div>
  <div class="map">
    <div class="map2"></div>
    <div class="map3"></div>
    <div class="chart"></div>
  </div>
</div>
```

```less
.no {
  background-color: rgba(101, 132, 226, 0.1);
  padding: 0.1875rem;
  .no-hd {
    position: relative;
    border: 1px solid rgba(25, 186, 139, 0.17);
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 10px;
      border-top: 2px solid #02a6b5;
      border-left: 2px solid #02a6b5;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 30px;
      height: 10px;
      border-bottom: 2px solid #02a6b5;
      border-right: 2px solid #02a6b5;
    }
    ul {
      display: flex;
      list-style: none;
      li {
        position: relative;
        flex: 1;
        height: 1rem;
        line-height: 1rem;
        font-size: 0.875rem;
        color: #ffeb7b;
        text-align: center;
        font-family: 'electronicFont';
        &:first-child::after {
          content: '';
          position: absolute;
          right: 0;
          top: 25%;
          width: 1px;
          height: 50%;
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
  .no-bd {
    ul {
      display: flex;
      // justify-content: space-around;
      li {
        flex: 1;
        text-align: center;
        padding-top: 0.125rem;
        height: 0.5rem;
        font-style: 0.225rem;
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
}
.map {
  position: relative;
  height: 10.125rem;
  background: url(../images/map.png) no-repeat center center;
  background-size: 6.475rem 6.475rem;
  .chart {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    height: 10.125rem;
    width: 100%;
  }
  .map2 {
    width: 8.0375rem;
    height: 8.0375rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url(../images/lbx.png);
    background-size: 100% 100%;
    animation: rotate1 15s linear infinite;
    opacity: 0.6;
  }
  .map3 {
    width: 7.075rem;
    height: 7.075rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url(../images/jt.png);
    background-size: 100% 100%;
    animation: rotate2 10s linear infinite;
    opacity: 0.6;
  }

  @keyframes rotate1 {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  @keyframes rotate2 {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(-360deg);
    }
  }
}
```
