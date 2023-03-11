# Echarts 图表制作

## Echarts 简介

常见的数据可视化库：

- D3.js 目前 Web 端评价最高的 Javascript 可视化工具库(入手难)
- ECharts.js 百度出品的一个开源 Javascript 数据可视化库
- Highcharts.js 国外的前端数据可视化库，非商用免费，被许多国外大公司所使用
- AntV 蚂蚁金服全新一代数据可视化解决方案
- Highcharts 和 Echarts 类似 Office 和 WPS 的关系

> ECharts，一个使用 JavaScript 实现的开源可视化库，可以流畅的运行在 PC 和移动设备上，兼容当前绝大部分浏览器（IE8/9/10/11，Chrome，Firefox，Safari 等），底层依赖矢量图形库 [ZRender](https://github.com/ecomfe/zrender)，提供直观，交互丰富，可高度个性化定制的数据可视化图表。

[Echarts](https://echarts.apache.org/zh/index.html)：

- 是一个 JS 插件
- 性能好可流畅运行 PC 与移动设备
- 兼容主流浏览器
- 提供很多常用图表，且可定制

## Echarts 体验

官网教程：[快速上手](https://echarts.apache.org/handbook/zh/get-started/)

使用步骤：

- 引入 echarts 插件文件到 html 页面中

```html
<script src="./js/echarts.min.js"></script>
```

- 准备一个具备大小的 DOM 容器

```html
<div id="main" style="width:600px; height:400px;"></div>
```

- 初始化 echarts 实例对象

```js
var myChart = echarts.init(document.getElementById('main'))
```

- 指定配置项和数据(option)

```js
var option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
    },
  ],
}
```

- 将配置项设置给 echarts 实例对象

```js
myChart.setOption(option)
```

## Echarts 基础配置

[官网配置项手册](https://echarts.apache.org/zh/option.html)

- series：指定图表类型、设置数据和相关样式
- xAxis：直角坐标系 grid 中的 x 轴
- yAxis：直角坐标系 grid 中的 y 轴
- grid：直角坐标系内绘图网格
- title：标题组件
- tooltip：提示框组件
- legend：图例组件
- color：调色盘颜色列表

![Echarts 配置](./images/Echarts-setting.png)

```js
option = {
  // color 设置线条的颜色 注意后面是个数组
  color: ['pink', 'red', 'green', 'skyblue'],
  // 图表标题
  title: {
    text: '折线图堆叠123',
  },
  // 提示框组件
  tooltip: {
    // 触发方式
    trigger: 'axis',
  },
  // 图例组件
  legend: {
    // 若 series 里设置了 name 属性，则此处 data 要么和其一一对应，要么删除
    data: ['邮件营销', '联盟广告', '视频广告', '直接访问'],
  },
  // 网格配置  grid 可以控制线形图、柱状图图表大小
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    // 是否显示刻度标签
    containLabel: true,
  },
  // 工具箱组件，有另存为图片等功能
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  // x轴的相关配置
  xAxis: {
    type: 'category',
    // 线条和坐标轴是否有缝隙
    boundaryGap: false,
    data: ['星期一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  // y轴的相关配置
  yAxis: {
    type: 'value',
  },
  // 系列图表配置 它决定着显示那种类型的图表
  series: [
    {
      name: '邮件营销',
      type: 'line',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: '联盟广告',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: '视频广告',
      type: 'line',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: '直接访问',
      type: 'line',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
  ],
}
```

## 柱状图-就业行业

官网寻找类似的示例，直接 copy 到页面中

```js
;(function () {
  // 实例化对象
  let myChart = echarts.init(document.querySelector('.bar .chart'))
  // 指定配置和数据
  let option = {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: '直接访问',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220],
      },
    ],
  }
  // 把配置给实例对象
  myChart.setOption(option)
})()
```

根据需求定制图表

- 修改图表柱形颜色 #2f89cf
- 修改图表大小 top 为 10px bottom 为 4%

```js
color: ["#2f89cf"],
grid: {
  left: "0%",
  top: "10px",
  right: "0%",
  bottom: "4%",
  containLabel: true
},
```

- X 轴相关设置 xAxis
  - 文本颜色设置为 rgba(255,255,255,.6) 字体大小为 12px
  - X 轴线的样式 不显示

```js
// 设置x轴标签文字样式
// x轴的文字颜色和大小
axisLabel: {
  color: "rgba(255,255,255,.6)",
  fontSize: "12"
},
//  x轴样式不显示
axisLine: {
    show: false
    // 如果想要设置单独的线条样式
    // lineStyle: {
    //    color: "rgba(255,255,255,.1)",
    //    width: 1,
    //    type: "solid"
    // }
  }
}
```

- Y 轴相关定制 yAxis
  - 文本颜色设置为 rgba(255,255,255,.6) 字体大小为 12px
  - Y 轴线条样式 更改为 1 像素的 rgba(255,255,255,.1) 边框
  - 分隔线的颜色修饰为 1 像素的 rgba(255,255,255,.1)

```js
// y 轴文字标签样式
axisLabel: {
  color: "rgba(255,255,255,.6)",
  fontSize: "12"
},
// y轴线条样式
axisLine: {
  lineStyle: {
    color: "rgba(255,255,255,.1)",
    // width: 1,
    // type: "solid"
  }
},
// y 轴分隔线样式
splitLine: {
  lineStyle: {
    color: "rgba(255,255,255,.1)"
  }
}
```

- 修改柱形为圆角以及柱子宽度

```js
series: [
    {
      name: "直接访问",
      type: "bar",
      // 修改柱子宽度
      barWidth: "35%",
      data: [10, 52, 200, 334, 390, 330, 220],
      itemStyle: {
        // 修改柱子圆角
        barBorderRadius: 5
      }
    }
  ]
};
```

- 更换数据

```js
// x轴中更换data数据
data: [ "旅游行业","教育培训", "游戏行业", "医疗行业", "电商行业", "社交行业", "金融行业" ],
// series 更换数据
data: [200, 300, 300, 900, 1500, 1200, 600]
```

- 图表自适应屏幕

```js
window.addEventListener('resize', function () {
  myChart.resize()
})
```

## 柱状图-技能掌握

官网寻找类似示例，引入页面

根据需求定制图表

- 修改图形大小 grid

```js
// 图标位置
grid: {
  top: "10%",
  left: "22%",
  bottom: "10%"
},
```

- 不显示 x 轴

```js
xAxis: {
  show: false
},
```

- y 轴相关定制
  - 不显示 y 轴线和相关刻度
  - y 轴文字的颜色设置为白色

```js
//不显示y轴线条
axisLine: {
  show: false
},
// 不显示刻度
axisTick: {
  show: false
},
axisLabel: {
  color: "#fff"
},
```

- 修改第一组柱子相关样式（条状）

```js
name: "条",
// 柱子之间的距离
barCategoryGap: 50,
//柱子的宽度
barWidth: 10,
// 柱子设为圆角
itemStyle: {
  normal: {
    barBorderRadius: 20,
  }
},
```

- 设置第一组柱子内百分比显示数据

```js
// 图形上的文本标签
label: {
  normal: {
    show: true,
    // 图形内显示
    position: "inside",
    // 文字的显示格式
    formatter: "{c}%"
  }
},
```

- 设置第一组柱子不同颜色

```js
// 声明颜色数组
var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
// 给 itemStyle 里 color 属性设置一个返回值函数
itemStyle: {
  normal: {
    barBorderRadius: 20,
    // params 传进来的是柱子对象
    console.log(params);
    // dataIndex 是当前柱子的索引号
    return myColor[params.dataIndex];
  }
},
```

- 修改第二组柱子的相关配置（框状）

```js
name: "框",
type: "bar",
barCategoryGap: 50,
barWidth: 15,
itemStyle: {
  color: "none",
  borderColor: "#00c1de",
  borderWidth: 3,
  barBorderRadius: 15
},
```

- 给 y 轴添加第二组数据

```js
yAxis: [
  {
    type: "category",
    data: ["印尼", "美国", "印度", "中国", "世界人口(万)"],
    // 不显示y轴的线
    axisLine: {
      show: false
    },
    // 不显示刻度
    axisTick: {
      show: false
    },
    // 把刻度标签里面的文字颜色设置为白色
    axisLabel: {
      color: "#fff"
    }
  },
  {
    show: true,
    data: [702, 350, 610, 793, 664],
    // 不显示y轴的线
    axisLine: {
      show: false
    },
    // 不显示刻度
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        fontSize: 12,
        color: "#fff"
      }
    }
  }
],
```

- 设置两组柱子层叠以及更换数据

```js
// 给series第一个对象里面的 添加
yAxisIndex: 0,
// 给series第二个对象里面的 添加
yAxisIndex: 1,
// series第一个对象里面的data
data: [70, 34, 60, 78, 69],
// series第二个对象里面的data
data: [100, 100, 100, 100, 100],
// y轴更换第一个对象更换data数据
data: ["HTML5", "CSS3", "javascript", "VUE", "NODE"],
// y轴更换第二个对象更换data数据
data:[702, 350, 610, 793, 664],
```

## 折线图-人员变化

- 修改折线图大小，显示边框设置颜色：#012f4a，并且显示刻度标签

```js
// 设置网格样式
grid: {
  top: '20%',
  left: '3%',
  right: '4%',
  bottom: '3%',
  show: true,// 显示边框
  borderColor: '#012f4a',// 边框颜色
  containLabel: true // 包含刻度文字在内
},
```

- 修改图例组件中的文字颜色 #4c9bfd， 距离右侧 right 为 10%

```js
// 图例组件
legend: {
  textStyle: {
    color: '#4c9bfd' // 图例文字颜色
  },
  right: '10%' // 距离右边10%
},
```

x 轴相关配置

- 刻度去除
- x 轴刻度标签字体颜色：#4c9bfd
- 剔除 x 坐标轴线颜色（将来使用 Y 轴分割线)
- 轴两端是不需要内间距 boundaryGap

```js
xAxis: {
  type: 'category',
  data: ["周一", "周二"],
axisTick: {
  show: false // 去除刻度线
  },
  axisLabel: {
    color: '#4c9bfd' // 文本颜色
  },
  axisLine: {
    show: false // 去除轴线
  },
  boundaryGap: false  // 去除轴内间距
},
```

y 轴的定制

- 刻度去除
- 字体颜色：#4c9bfd
- 分割线颜色：#012f4a

```js
yAxis: {
  type: 'value',
  axisTick: {
    show: false  // 去除刻度
  },
  axisLabel: {
    color: '#4c9bfd' // 文字颜色
  },
  splitLine: {
    lineStyle: {
      color: '#012f4a' // 分割线颜色
    }
  }
},
```

两条线形图定制

- 颜色分别：#00f2f1 #ed3f35
- 把折线修饰为圆滑

```js
color: ['#00f2f1', '#ed3f35'],
series: [{
  name:'新增粉丝',
  data: [820, 932, 901, 934, 1290, 1330, 1320],
  type: 'line',
  // 折线修饰为圆滑
  smooth: true,
  },{
  name:'新增游客',
  data: [100, 331, 200, 123, 233, 543, 400],
  type: 'line',
  smooth: true,
}]
```

配置数据

```js
// x轴的文字
xAxis: {
  type: 'category',
  data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
}

// 图表数据
series: [{
  name:'新增粉丝',
  data:  [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
  type: 'line',
  smooth: true
},{
  name:'新增游客',
  data: [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79],
  type: 'line',
  smooth: true
  }
]
```

新增需求：点击 2020 年 2021 年，数据发生变化

数据：

```js
var yearData = [
  {
    year: '2020', // 年份
    data: [
      // 两个数组是因为有两条线
      [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
      [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79],
    ],
  },
  {
    year: '2021', // 年份
    data: [
      // 两个数组是因为有两条线
      [123, 175, 112, 197, 121, 67, 98, 21, 43, 64, 76, 38],
      [143, 131, 165, 123, 178, 21, 82, 64, 43, 60, 19, 34],
    ],
  },
]
```

tab 栏切换事件

- 点击 2020 按钮 需要把 series 第一个对象里面的 data 换成 2020 年对象里面 data[0]
- 点击 2020 按钮 需要把 series 第二个对象里面的 data 换成 2020 年对象里面 data[1]
- 2021 按钮同理

完整代码：

```js
;(function () {
  var yearData = [
    {
      year: '2020', // 年份
      data: [
        // 两个数组是因为有两条线
        [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
        [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79],
      ],
    },
    {
      year: '2021', // 年份
      data: [
        // 两个数组是因为有两条线
        [123, 175, 112, 197, 121, 67, 98, 21, 43, 64, 76, 38],
        [143, 131, 165, 123, 178, 21, 82, 64, 43, 60, 19, 34],
      ],
    },
  ]
  let myChart = echarts.init(document.querySelector('.line .chart'))
  let option = {
    color: ['#00f2f1', '#ed3f35'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      textStyle: {
        color: '#4c9bfd', // 图例文字颜色
      },
      right: '5%', // 距离右边5%
    },
    // 设置网格样式
    grid: {
      top: '20%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      show: true, // 显示边框
      borderColor: '#012f4a', // 边框颜色
      containLabel: true, // 包含刻度文字在内
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisTick: {
        show: false, // 去除刻度线
      },
      axisLabel: {
        color: '#4c9bfd', // 文本颜色
      },
      axisLine: {
        show: false, // 去除轴线
      },
      boundaryGap: false, // 去除轴内间距
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false, // 去除刻度
      },
      axisLabel: {
        color: '#4c9bfd', // 文字颜色
      },
      axisLine: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#012f4a', // 分割线颜色
        },
      },
    },
    series: [
      {
        name: '新增粉丝',
        data: yearData[0].data[0],
        type: 'line',
        smooth: true,
      },
      {
        name: '新增游客',
        data: yearData[0].data[1],
        type: 'line',
        smooth: true,
      },
    ],
  }
  myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
  // 5.点击切换效果
  $('.line h2').on('click', 'a', function () {
    // console.log($(this).index());
    // 点击 a 之后 根据当前a的索引号 找到对应的 yearData的相关对象
    // console.log(yearData[$(this).index()]);
    var obj = yearData[$(this).index()]
    option.series[0].data = obj.data[0]
    option.series[1].data = obj.data[1]
    // 需要重新渲染
    myChart.setOption(option)
  })
})()
```

## 折线图-播放量

- 更换图例组件文字颜色 rgba(255,255,255,.5) 文字大小为 12

```js
legend: {
  top: "0%",
  textStyle: {
    color: "rgba(255,255,255,.5)",
    fontSize: "12"
  }
},
```

- 修改图表大小

```js
grid: {
  left: "10",
  top: "30",
  right: "10",
  bottom: "10",
  containLabel: true
},
```

修改 x 轴相关配置

- 修改文本颜色为 rgba(255,255,255,.6) 文字大小为 12
- x 轴线的颜色为 rgba(255,255,255,.2)

```js
// 文本颜色为rgba(255,255,255,.6)  文字大小为 12
axisLabel: {
  textStyle: {
    color: "rgba(255,255,255,.6)",
    fontSize: 12
  }
},
  // x轴线的颜色为   rgba(255,255,255,.2)
axisLine: {
  lineStyle: {
    color: "rgba(255,255,255,.2)"
  }
},
```

修改 y 轴的相关配置

```js
axisTick: { show: false },
axisLine: {
  lineStyle: {
    color: "rgba(255,255,255,.1)"
  }
},
axisLabel: {
  textStyle: {
    color: "rgba(255,255,255,.6)",
    fontSize: 12
  }
},
// 修改分割线的颜色
splitLine: {
  lineStyle: {
    color: "rgba(255,255,255,.1)"
  }
}
```

修改两个线模块配置(注意在 series 里面定制)

```js
//第一条 线是圆滑
smooth: true,
// 单独修改线的样式
lineStyle: {
    color: "#0184d5",
    width: 2
},
// 填充区域
areaStyle: {
  // 渐变色，只需要复制即可
  color: new echarts.graphic.LinearGradient(
    0,
    0,
    0,
    1,
    [
      {
        offset: 0,
        color: "rgba(1, 132, 213, 0.4)" // 渐变色的起始颜色
      },
      {
        offset: 0.8,
        color: "rgba(1, 132, 213, 0.1)" // 渐变线的结束颜色
      }
    ],
    false
  ),
  shadowColor: "rgba(0, 0, 0, 0.1)"
},
// 设置拐点 小圆点
symbol: "circle",
// 拐点大小
symbolSize: 8,
// 设置拐点颜色以及边框
itemStyle: {
  color: "#0184d5",
  borderColor: "rgba(221, 220, 107, .1)",
  borderWidth: 12
},
// 开始不显示拐点， 鼠标经过显示
showSymbol: false,
```

```js
name: "转发量",
type: "line",
smooth: true,
lineStyle: {
  normal: {
    color: "#00d887",
    width: 2
  }
  },
areaStyle: {
  normal: {
    color: new echarts.graphic.LinearGradient(
      0,
      0,
      0,
      1,
      [
        {
          offset: 0,
          color: "rgba(0, 216, 135, 0.4)"
        },
        {
          offset: 0.8,
          color: "rgba(0, 216, 135, 0.1)"
        }
      ],
      false
    ),
    shadowColor: "rgba(0, 0, 0, 0.1)"
  }
},
// 设置拐点 小圆点
symbol: "circle",
// 拐点大小
symbolSize: 5,
// 设置拐点颜色以及边框
  itemStyle: {
    color: "#00d887",
    borderColor: "rgba(221, 220, 107, .1)",
    borderWidth: 12
},
// 开始不显示拐点，鼠标经过显示
showSymbol: false,
```

更换数据

```js
// x轴更换数据
data: [ "01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","26","28","29","30"],
// series  第一个对象data数据
data: [ 30, 40, 30, 40,30, 40, 30,60,20, 40, 30, 40, 30, 40,30, 40, 30,60,20, 40, 30, 40, 30, 40,30, 40, 20,60,50, 40],
// series  第二个对象data数据
data: [ 130, 10, 20, 40,30, 40, 80,60,20, 40, 90, 40,20, 140,30, 40, 130,20,20, 40, 80, 70, 30, 40,30, 120, 20,99,50, 20],
```

## 饼形图-年龄分布

- 修改图例组件在底部并且居中显示。
- 每个小图标的宽度和高度修改为 10px
- 文字大小为 12 颜色 rgba(255,255,255,.5)

```js
legend: {
  // 距离底部为0%
  bottom: "0%",
  // 小图标的宽度和高度
  itemWidth: 10,
  itemHeight: 10,
  data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
  // 修改图例组件的文字为 12px
  textStyle: {
    color: "rgba(255,255,255,.5)",
    fontSize: "12"
  }
},
```

- 修改水平居中 垂直居中
- 修改内圆半径和外圆半径为 ["40%", "60%"] pink 老师友情提示，带有直角坐标系的比如折线图柱状图是 grid 修改图形大小，而我们饼形图是通过 radius 修改大小

```js
series: [
  {
    name: '年龄分布',
    type: 'pie',
    // 设置饼形图在容器中的位置
    center: ['50%', '50%'],
    //  修改内圆半径和外圆半径为  百分比是相对于容器宽度来说的
    radius: ['40%', '60%'],
    // 不显示标签文字
    label: { show: false },
    // 不显示连接线
    labelLine: { show: false },
  },
]
```

更换数据

```js
// legend 中的data可省略
data: ["0岁以下", "20-29岁", "30-39岁", "40-49岁", "50岁以上"],
//  series 中的数据
data: [
  { value: 1, name: "0岁以下" },
  { value: 4, name: "20-29岁" },
  { value: 2, name: "30-39岁" },
  { value: 2, name: "40-49岁" },
  { value: 1, name: "50岁以上" }
] ,
```

更换颜色

```js
color: [
  "#065aab",
  "#066eab",
  "#0682ab",
  "#0696ab",
  "#06a0ab",
],
```

## 饼形图-地区分布（南丁格尔玫瑰图）

颜色设置

```js
color: ['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff'],
```

修改饼形图大小 ( series 对象)

```js
radius: ['10%', '70%'],
```

把饼形图的显示模式改为 半径模式

```js
roseType: "radius",
```

数据更换（series 对象里 data 对象）

```js
{ value: 20, name: '云南' },
{ value: 26, name: '北京' },
{ value: 24, name: '山东' },
{ value: 25, name: '河北' },
{ value: 20, name: '江苏' },
{ value: 25, name: '浙江' },
{ value: 30, name: '四川' },
{ value: 42, name: '湖北' }
```

字体大小 10 px，饼图图形上的文本标签可以控制饼形图的文字的一些样式

```js
series: [
  {
    name: '面积模式',
    type: 'pie',
    radius: [30, 110],
    center: ['50%', '50%'],
    roseType: 'radius',
    // 文本标签控制饼形图文字的相关样式， 注意它是一个对象
    label: {
      fontSize: 10,
    },
  },
]
```

设置引导线长度

- 连接图表 6 px
- 连接文字 8 px

```js
// 引导线调整
labelLine: {
  // 连接扇形图线长
  length: 6,
  // 连接文字线长
  length2: 8
}
```

## Echarts-map 的使用

在 [Gallery](https://www.makeapie.com/explore.html) 中可以找到基于 Echarts 高度定制的图表，可根据需求引入。新版官网 Gallery 的入口在更多资源处。

飞机航线图的社区例子：[https://www.makeapie.com/editor.html?c=x0-ExSkZDM](https://www.makeapie.com/editor.html?c=x0-ExSkZDM)

实现步骤：

- 下载中国地图 china.js 文件
- 引入第三方配置修改即可

修改：

- 去掉标题组件
- 去掉背景颜色
- 修改地图省份背景 #142957， areaColor 里面做修改
- 地图放大通过 zoom 设置为 1.2

```js
geo: {
  map: 'china',
  zoom: 1.2,
  label: {
    emphasis: {
      show: false
    }
  },
  roam: false,
  itemStyle: {
    normal: {
      areaColor: '#142957',
      borderColor: '#0692a4'
    },
    emphasis: {
      areaColor: '#0b1c2d'
    }
  }
},
```

约束缩放：

```js
/* 约束屏幕尺寸 */
@media screen and (max-width: 1024px) {
  html {
    font-size: 42px !important;
  }
}
@media screen and (min-width: 1920px) {
  html {
    font-size: 80px !important;
  }
}
```

完结撒花 :tada:
