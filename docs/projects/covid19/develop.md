# 主页布局

## Home 组件

Home 组件用于承载主页所有子组件

```vue
<template>
  <div>Home</div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style></style>
```

## Header 组件

> 展示顶部 banner 图片

- `padding-top: 32.5%` ：以自身宽度为基准
- `background-size: cover` ：保持图像的纵横比并将图像缩放成将完全覆盖背景定位区域的最小大小

```vue
<template>
  <div class="header"></div>
</template>

<script>
export default {}
</script>

<style>
.header {
  width: 100%;
  height: 0;
  padding-top: 32.5%;
  background: url(../assets/banner.jpg);
  background-size: cover;
}
</style>
```

## Covid19Info 组件

> 展示病毒基本信息

- `props` 数据若是对象或数组，则默认值是一个函数，函数再返回一个对象或数组

```vue
<template>
  <div class="info">
    <p class="title">
      <i></i>
      病毒信息
    </p>
    <div class="content">
      <p>{{ covidInfo.note1 }}</p>
      <p>{{ covidInfo.note2 }}</p>
      <p>{{ covidInfo.note3 }}</p>
      <p>{{ covidInfo.remark1 }}</p>
      <p>{{ covidInfo.remark2 }}</p>
      <p>{{ covidInfo.remark3 }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Covid19Info',
  props: {
    covidInfo: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
}
</script>

<style scoped>
/* see Gitee */
</style>
```

Home 组件发送网络请求，并把数据传递给 Covid19Info 组件

```vue
<template>
  <div>
    <Header />
    <Covid19Info :covidInfo="covidInfo" />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Covid19Info from '@/components/Covid19Info.vue'

export default {
  components: {
    Header,
    Covid19Info,
  },
  data() {
    return {
      covidInfo: {
        note1: '',
        note2: '',
        note3: '',
        remark1: '',
        remark2: '',
        remark3: '',
      },
    }
  },
  async created() {
    const { data } = await this.$api.getNocv({
      key: '填写自己注册的key',
    })
    if (data.code === 200) {
      const desc = data.newslist[0].desc
      // 病毒信息
      this.covidInfo.note1 = desc.note1
      this.covidInfo.note2 = desc.note2
      this.covidInfo.note3 = desc.note3
      this.covidInfo.remark1 = desc.remark1
      this.covidInfo.remark2 = desc.remark2
      this.covidInfo.remark3 = desc.remark3
    }
  },
}
</script>
```

## Covid19Num 组件

> 展示全国统计数据

```vue
<template>
  <div class="case-num">
    <div class="container">
      <div class="title">
        <span
          >截至
          {{ formatDate(covidNum.modifyTime) }}
          全国数据统计</span
        >
      </div>
    </div>
    <div class="num">
      <ul class="count">
        <li>
          <div class="create-item">
            <div class="create-count">
              <b>
                较昨日<em style="color: rgb(247, 76, 49)">{{ numAddSymbol(covidNum.currentConfirmedIncr) }}</em>
              </b>
            </div>
            <strong style="color: rgb(247, 76, 49)">{{ covidNum.currentConfirmedCount }}</strong>
            <span>现存确诊</span>
          </div>
        </li>
        <li>
          <div class="create-item">
            <div class="create-count">
              <b>
                较昨日<em style="color: rgb(247, 130, 7)">{{ numAddSymbol(covidNum.confirmedIncr) }}</em>
              </b>
            </div>
            <strong style="color: rgb(247, 130, 7)">{{ covidNum.confirmedCount }}</strong>
            <span>累计确诊</span>
          </div>
        </li>
        <li>
          <div class="create-item">
            <div class="create-count">
              <b>
                较昨日<em style="color: rgb(162, 90, 78)">+{{ covidNum.suspectedIncr }}</em>
              </b>
            </div>
            <strong style="color: rgb(162, 90, 78)">{{ covidNum.suspectedCount }}</strong>
            <span>累计境外输入</span>
          </div>
        </li>
        <li>
          <div class="create-item">
            <div class="create-count">
              <b>
                较昨日<em style="color: rgb(174, 33, 44)">+{{ covidNum.curedIncr }}</em>
              </b>
            </div>
            <strong style="color: rgb(174, 33, 44)">{{ covidNum.curedCount }}</strong>
            <span>累计治愈</span>
          </div>
        </li>
        <li>
          <div class="create-item">
            <div class="create-count">
              <b>
                较昨日<em style="color: rgb(93, 112, 146)">+{{ covidNum.deadIncr }}</em>
              </b>
            </div>
            <strong style="color: rgb(93, 112, 146)">{{ covidNum.deadCount }}</strong>
            <span>累计死亡</span>
          </div>
        </li>
        <li>
          <div class="create-item">
            <div class="create-count">
              <b>
                较昨日<em style="color: rgb(40, 183, 163)">{{ numAddSymbol(covidNum.seriousIncr) }}</em>
              </b>
            </div>
            <strong style="color: rgb(40, 183, 163)">{{ covidNum.seriousCount }}</strong>
            <span>现存无症状</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Covid19Num',
  props: {
    covidNum: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  methods: {
    numAddSymbol(count) {
      return count >= 0 ? '+' + count : count
    },
    numAddZero(num) {
      return num >= 10 ? num : '0' + num
    },
    formatDate(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = this.numAddZero(date.getMonth() + 1)
      const day = this.numAddZero(date.getDate())
      const hour = this.numAddZero(date.getHours())
      const minute = this.numAddZero(date.getMinutes())
      const second = this.numAddZero(date.getSeconds())

      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    },
  },
}
</script>

<style scoped>
/* see Gitee */
</style>
```

Home 组件发送网络请求并传递数据：

```vue
<template>
  <div>
    <Covid19Num :covidNum="covidNum" />
  </div>
</template>

<script>
import Covid19Num from '@/components/Covid19Num.vue'
export default {
  components: {
    Covid19Num,
  },
  data() {
    return {
      covidNum: {
        // 现存确诊
        currentConfirmedCount: 0,
        // 累计确诊
        confirmedCount: 0,
        // 累计境外输入
        suspectedCount: 0,
        // 累计治愈
        curedCount: 0,
        // 累计死亡
        deadCount: 0,
        // 现存无症状
        seriousCount: 0,
        // 较昨日
        currentConfirmedIncr: 0,
        confirmedIncr: 0,
        suspectedIncr: 0,
        curedIncr: 0,
        deadIncr: 0,
        seriousIncr: 0,
        // 截止日期
        modifyTime: 0,
      },
    }
  },
  async created() {
    const { data } = await this.$api.getNocv({
      key: 'your key',
    })
    if (data.code === 200) {
      const desc = data.newslist[0].desc
      // 今日数据
      this.covidNum.currentConfirmedCount = desc.currentConfirmedCount
      this.covidNum.confirmedCount = desc.confirmedCount
      this.covidNum.suspectedCount = desc.suspectedCount
      this.covidNum.curedCount = desc.curedCount
      this.covidNum.deadCount = desc.deadCount
      this.covidNum.seriousCount = desc.seriousCount
      // 较昨日新增
      this.covidNum.currentConfirmedIncr = desc.currentConfirmedIncr
      this.covidNum.confirmedIncr = desc.confirmedIncr
      this.covidNum.suspectedIncr = desc.suspectedIncr
      this.covidNum.curedIncr = desc.curedIncr
      this.covidNum.deadIncr = desc.deadIncr
      this.covidNum.seriousIncr = desc.seriousIncr
      // 截至日期
      this.covidNum.modifyTime = desc.modifyTime
    }
  },
}
</script>
```

## 封装 Tabs 标签页

自行封装 Tabs 标签页，学习组件封装

在 `components` 目录下创建 `tabs` 文件夹，`tabs` 文件夹包含 `Tabs.vue`、`Tab.vue`、`Content.vue` 以及 `index.js` 。

- 插槽的使用
- 父子组件通信：`this.$parent`、`this.$children`
- 组件属性：`this.$slots.default`
- Vue 中使用 JSX 语法

### Tabs 标签页计划使用形式

```html
<Tabs @tab-click="handleTabClick">
  <Tab label="国内疫情" name="china">
    <div id="chinaMap"></div>
  </Tab>
  <Tab label="世界疫情" name="world">
    <div id="worldMap"></div>
  </Tab>
</Tabs>
```

### Tabs 组件

```vue
<template>
  <div>
    <ul class="tabs-header">
      <slot></slot>
    </ul>
    <Content :tabsArr="tabsArr"></Content>
  </div>
</template>

<script>
import Content from './Content.vue'

export default {
  name: 'Tabs',
  components: {
    Content,
  },
  data() {
    return {
      currentTab: '',
      tabsArr: [],
    }
  },
  mounted() {
    this.currentTab = this.$children[0].name || ''
  },
  methods: {
    getCurrentTab(name) {
      this.currentTab = name
      this.$emit('tab-click', name)
    },
  },
}
</script>

<style scoped>
.tabs-header {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: 2px solid #ededed;
}
</style>
```

### Tab 组件

```vue
<template>
  <li class="tab" :class="{ active: isActive }" @click="changeTab">
    {{ label }}
  </li>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    label: {
      type: String,
      default: 'tab',
    },
    name: {
      type: String,
      default: 'hello',
    },
  },
  computed: {
    isActive() {
      return this.$parent.currentTab === this.name
    },
  },
  methods: {
    changeTab() {
      this.$parent.getCurrentTab(this.name)
    },
  },
  mounted() {
    this.$parent.tabsArr.push(this)
  },
}
</script>

<style scoped>
.tab {
  flex: 1;
  list-style: none;
  line-height: 40px;
  position: relative;
  text-align: center;
}

.tab.active {
  border-bottom: 2px solid blue;
}
</style>
```

### Content 组件

```vue
<script>
export default {
  name: 'Content',
  props: {
    tabsArr: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
  render() {
    return (
      <div>
        {this.tabsArr.map((item) => {
          // return item.isActive ? item.$slots.default : ''
          return <div style={{ display: item.isActive ? 'block' : 'none' }}>{item.$slots.default}</div>
        })}
      </div>
    )
  },
}
</script>

<style></style>
```

### Tabs 插件定义

```js
// tabs/index.js
import Tabs from './Tabs.vue'
import Tab from './Tab.vue'

export default (Vue) => {
  Vue.component(Tabs.name, Tabs)
  Vue.component(Tab.name, Tab)
}
```

### 使用插件 Tabs

```js
// main.js
import Tabs from '@/components/tabs'
Vue.use(Tabs)
```

## 封装 echarts 插件

安装 echarts：

```bash
npm install echarts
```

定义 echarts 插件：

```js
// plugins/echarts.js
import echarts from 'echarts'
// 国家名称中英文映射对象
import nameMap from './name.js'
// 引入地图资源
import '../../node_modules/echarts/map/js/china'
import '../../node_modules/echarts/map/js/world'
import '../../node_modules/echarts/map/js/province/anhui'

// 绘制最基本的折线图
const line = function (id) {
  var dom = document.getElementById(id)
  var myChart = echarts.init(dom)
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
  myChart.setOption(option)
}

const chinaMap = function (id, data) {
  const dom = document.getElementById(id)
  const myEcharts = echarts.init(dom)
  const option = {
    // 提示信息
    tooltip: {
      // 事件类型
      triggerOn: 'click',
      // 鼠标是否可进入提示框浮层中，默认为false，如需详情内交互，如添加链接，按钮，可设置为 true。
      enterable: true,
      // data 为点击区域的数据
      formatter(data) {
        return `<div>
          <a href='/covid19/#/city/${data.name}' style='color: #fff'>
            <p>${data.name}</p>
            <p>现存确诊:${data.value}</p>
          </a>
        </div>`
      },
    },
    // 数据的视觉映射，把数据映射到对应颜色
    visualMap: [
      {
        orient: 'vertical', // 分段方向:horizontal水平
        type: 'piecewise', // 分段型
        pieces: [
          // 配置颜色区间
          { min: 0, max: 0, color: '#FFFFFF' },
          { min: 1, max: 10, color: '#FDFDCF' },
          { min: 10, max: 100, color: '#FE9E83' },
          { min: 100, max: 500, color: '#E55A4E' },
          { min: 500, max: 10000, color: '#4F070D' },
        ],
      },
    ],
    // 配置资源
    series: [
      {
        // 地图的级别，中国级别的地图匹配的就是省份的数据，选中区域会显示
        name: '省',
        type: 'map', // 配置图表类型
        map: 'china', // 中国地图
        roam: true, // 是否允许缩放
        zoom: 1.1, // 地图缩放比例
        // 配置字体
        label: {
          // normal是必须字段
          normal: {
            // 是否显示文字
            show: true,
            // 文字样式
            textStyle: {
              fontSize: 8,
            },
          },
        },
        // 配置地图样式
        itemStyle: {
          // normal为必须字段
          normal: {
            areaColor: 'rgba(0,255,236,0)',
            borderColor: 'rgba(0,0,0,0.2)',
          },
          // 选中的区域颜色及阴影效果
          emphasis: {
            areaColor: 'rgba(255,180,0,0.8)',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            // 阴影模糊程度
            shadowBlur: 15,
            // 阴影颜色
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            // 选中区域边框
            borderWidth: 1,
          },
        },
        data,
        // 数据的格式
        // data: [
        //   // name 为地区，value 为数量，后面是不同数量对应的颜色，配置了视觉映射就不需要了
        //   { name: '内蒙古', value: 10, itemStyle: { normal: { areaColor: '#f00' } } }
        // ]
      },
    ],
  }
  myEcharts.setOption(option)
}

const worldMap = function(id, data) {
  ...
  const option = {
    ...
    series: [{
      ...
      map: 'world'
      nameMap: nameMap,
      ...
    }]
    ...
  }
}
const cityMap = function(id, cityName, data) {
  ...
  const option = {
    ...
    series: [{
      ...
      map: cityName // 省市地图必须是中文
      nameMap: nameMap,
      ...
    }]
    ...
  }
}

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$charts', {
      get() {
        return {
          line,
          chinaMap,
          worldMap,
          cityMap,
        }
      },
    })
  },
}
```

使用 echarts 插件：

```js
// main.js
import Echarts from '@/plugins/echarts'
Vue.use(Echarts)
```

## Map 组件

> 展示国内外疫情地图

```vue
<template>
  <div>
    <p class="title"><i></i>疫情地图</p>
    <Tabs @tab-click="handleTabClick">
      <Tab label="国内疫情" name="china">
        <div id="chinaMap"></div>
      </Tab>
      <Tab label="世界疫情" name="world">
        <div id="worldMap"></div>
      </Tab>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: 'Map',
  async mounted() {
    // 多重结构赋值
    const {
      data: { retdata },
    } = await this.$api.getNocvCity()

    const { data: worldData } = await this.$api.getNocvWorld({
      key: 'your key',
    })

    const allCitysNum = []
    retdata.forEach((item) => {
      const temp = {
        name: item.xArea,
        value: Number(item.curConfirm),
      }
      allCitysNum.push(temp)
    })

    const allCountryNum = []
    worldData.newslist.forEach((item) => {
      const temp = {
        name: item.provinceName,
        value: item.currentConfirmedCount,
      }
      allCountryNum.push(temp)
    })

    this.$charts.chinaMap('chinaMap', allCitysNum)
    this.$charts.worldMap('worldMap', allCountryNum)
  },
  methods: {
    handleTabClick(tab) {
      console.log(tab)
    },
  },
}
</script>

<style scoped>
#chinaMap,
#worldMap {
  width: 375px;
  height: 400px;
}
#worldMap {
  width: 375px;
  height: 400px;
}
/* see Gitee */
</style>
```

## City 组件

> 国内疫情地图点击某个省份后，该省份具体的疫情数据地图

```vue
<template>
  <div class="city-container">
    <h3 class="title">{{ city }}疫情地图</h3>
    <div id="city"></div>
  </div>
</template>

<script>
export default {
  name: 'City',
  props: {
    city: {
      type: String,
      default: '',
    },
  },
  async mounted() {
    const {
      data: { retdata },
    } = await this.$api.getNocvSingleCity({
      city: this.city,
    })
    const cityNum = []
    retdata.subList.forEach((item) => {
      const temp = {
        name: item.city,
        value: item.confirm,
      }
      cityNum.push(temp)
    })
    this.$charts.cityMap('city', this.city, cityNum)
  },
}
</script>

<style scoped>
#city {
  width: 100%;
  height: 500px;
}
.city-container {
  text-align: center;
}
.title {
  font-size: 0.16rem;
  padding: 0.1rem 0 0.08rem 0.16rem;
  border-bottom: 1px solid #ccc;
}
</style>
```

## MySwiper 组件

> 展示轮播图

安装 vue-awesome-swiper：

- npm：[https://www.npmjs.com/package/vue-awesome-swiper](https://www.npmjs.com/package/vue-awesome-swiper)
- GitHub：[https://github.com/surmon-china/vue-awesome-swiper](https://github.com/surmon-china/vue-awesome-swiper)

```bash
# 新版本有问题，建议使用 5.x 版本的
npm install swiper vue-awesome-swiper --save
npm install swiper@5 vue-awesome-swiper --save
```

```vue
<template>
  <div class="chart">
    <h3 class="title">全国疫情趋势图</h3>
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="(item, index) in swiperData" :key="index">
        <img :src="item.image" alt="" />
      </swiper-slide>
    </swiper>
    <ul class="navigator">
      <li class="navigatorItem" :class="{ active: currentIndex === index }" v-for="(item, index) in swiperData" :key="index" @click="handleActiveClick(index)">
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  name: 'MySwiper',
  components: {
    Swiper,
    SwiperSlide,
  },
  directives: {
    swiper: directive,
  },
  data() {
    let that = this
    return {
      currentIndex: 0,
      swiperOptions: {
        // autoplay: true,
        autoplay: {
          delay: 1500,
          stopOnLastSlide: false,
          disableOnInteraction: true,
        },
        pagination: {
          el: '.swiper-pagination',
        },
        on: {
          slideChangeTransitionEnd() {
            that.currentIndex = this.activeIndex
          },
        },
      },
      // 数据暂时使用固定图片代替
      swiperData: [
        {
          image: 'https://img1.dxycdn.com/2020/0220/014/3397684583507458039-135.png',
          title: '新增疑似/新增确诊',
        }
        ...
      ],
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    },
  },
  methods: {
    handleActiveClick(index) {
      this.swiper.slideTo(index, 1000, false)
      this.currentIndex = index
    },
  },
}
</script>

<style scoped>
/* see Gitee */
</style>
```

## 疫情出行政策

### Vant 的使用

安装 Vant：

```bash
npm install vant -S
```

配置自动按需引入组件：

- 安装 babel-plugin-import 插件

```bash
npm install babel-plugin-import -D
```

- 在 `babel.config.js` 进行配置

```js
module.exports = {
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true,
      },
      'vant',
    ],
  ],
}
```

将引入 vant 组件的代码封装为一个模块：

```js
// plugins/vant.js
import Vue from 'vue'
import { Cascader, Field, Popup, Button, Notify, Icon, NoticeBar, Cell, CellGroup, Dialog } from 'vant'

Vue.use(Cascader)
Vue.use(Field)
Vue.use(Popup)
Vue.use(Button)
Vue.use(Notify)
Vue.use(Icon)
Vue.use(NoticeBar)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Dialog)
```

入口文件导入：

```js
// main.js
import '@/plugins/vant'
```

### Travel 组件

> 选择出发城市和目的城市

```vue
<template>
  <div class="travel">
    <h3 class="title">疫情出行政策</h3>
    <div class="cascader">
      <van-field v-model="departure" is-link readonly label="出发地" placeholder="请选择出发地" @click="departureShow = true" />
      <van-popup v-model="departureShow" round position="bottom">
        <van-cascader v-model="fromCascaderValue" title="请选择出发地" :options="options" @close="departureShow = false" @finish="onFinishDeparture" />
      </van-popup>

      <van-field v-model="destination" is-link readonly label="目的地" placeholder="请选择目的地" @click="destinationShow = true" />
      <van-popup v-model="destinationShow" round position="bottom">
        <van-cascader v-model="toCascaderValue" title="请选择目的地" :options="options" @close="destinationShow = false" @finish="onFinishDestination" />
      </van-popup>
      <van-button type="primary" round block @click="goPolicy"> 查看出行政策 </van-button>
    </div>
  </div>
</template>

<script>
import cityId from '@/plugins/cityId'

export default {
  name: 'Travel',
  data() {
    return {
      departureShow: false,
      destinationShow: false,
      departure: '',
      destination: '',
      fromCascaderValue: '',
      toCascaderValue: '',
      // 选项列表，children 代表子选项，支持多级嵌套
      options: cityId,
      // 出发地和目的地数组
      twoCitys: [],
    }
  },
  methods: {
    // 选择出发地完成
    onFinishDeparture({ selectedOptions }) {
      this.departureShow = false
      this.departure = selectedOptions.map((option) => option.text).join('/')
      this.twoCitys.splice(0, 1, selectedOptions[1])
      this.checkPolicy()
    },
    // 选择目的地完成
    onFinishDestination({ selectedOptions }) {
      this.destinationShow = false
      this.destination = selectedOptions.map((option) => option.text).join('/')
      this.twoCitys.splice(1, 1, selectedOptions[1])
      this.checkPolicy()
    },
    // 每次选择地点都进行查询，为了能让政策页面拿到数据
    async checkPolicy() {
      if (this.twoCitys.length === 2) {
        const fromId = this.twoCitys[0].value
        const toId = this.twoCitys[1].value
        const policyDetailURL = `https://apis.juhe.cn/springTravel/query?key=ea3295121216b176e1a6b8af7fcd3dcf&from=${fromId}&to=${toId}&callback=policyDetailHandler`
        // 使用 jsonp 解决跨域
        window.jsonp(policyDetailURL)
      }
    },
    // 前往出行政策详情页
    goPolicy() {
      if (this.twoCitys.length === 2) {
        this.$router.push('/policy')
      } else {
        this.$notify({ type: 'warning', message: '请选择出发地和目的地！' })
      }
    },
  },
  /**
   * 调用接口获取城市ID
   * 由于接口有调用次数限制，因此选择把数据保存到 cityId.js 文件中
   * 导入使用即可，但可能存在ID变化本地未更新的问题
   */
  //#region
  /*
  async created() {
    const { data } = await this.$api.getTravelPolicy({
      key: '2fc84fc60f639068c374a9d644ae2da2'
    })
    if(data.error_code === 0) {
      const allPlaces = []
      data.result.forEach(provinceItem => {
        const cityArr = []
        provinceItem.citys.forEach(cityItem => {
          const cityTemp = {
            text: cityItem.city,
            value: cityItem.city_id
          }
          cityArr.push(cityTemp)
        })
        const provinceTemp = {
          text: provinceItem.province,
          value: provinceItem.province_id,
          children: cityArr
        }
        allPlaces.push(provinceTemp)
      })
      this.options = allPlaces
    }
  }
  */
  //#endregion
}
</script>

<style scoped>
.travel {
  width: 100%;
  background-color: #fff;
}
.cascader {
  padding: 10px;
  box-sizing: border-box;
}
.travel .title {
  font-size: 0.16rem;
  margin: 0 0 0.08rem 0.16rem;
}
</style>
```

### PolicyDetail 组件

> 政策详情展示

```vue
<template>
  <div class="policy-detail">
    <div class="top-ban"></div>
    <div class="policy-main">
      <van-notice-bar class="notice-bar" left-icon="volume-o" scrollable text="出行请提前了解当地防控要求并做好个人防护。" />
      <div class="policy-desc">
        <!-- 出发地政策 -->
        <div class="city-policy">
          <div class="city-header">
            <van-icon name="location" color="red" />
            <span class="city-name">{{ fromInfo.city_name }}</span>
          </div>
          <div class="city-desc">
            <p class="policy-header">进入政策</p>
            <div>
              {{ fromInDesc.length > 90 ? fromInDesc.slice(0, 90) : fromInDesc }}
              <span class="more-click" @click="showMore($event, 1)"> ...更多 </span>
            </div>
            <p class="policy-header">外出政策</p>
            <div>
              {{ fromOutDesc.length > 90 ? fromOutDesc.slice(0, 90) : fromOutDesc }}
              <span class="more-click" @click="showMore($event, 2)"> ...更多 </span>
            </div>
          </div>
        </div>
        <!-- 目的地政策 -->
        <div class="city-policy">
          <div class="city-header">
            <van-icon name="location" color="red" />
            <span class="city-name">{{ toInfo.city_name }}</span>
          </div>
          <div class="city-desc">
            <p class="policy-header">进入政策</p>
            <div>
              {{ toInDesc.length > 90 ? toInDesc.slice(0, 90) : toInDesc }}
              <span class="more-click" @click="showMore($event, 3)"> ...更多 </span>
            </div>
            <p class="policy-header">外出政策</p>
            <div>
              {{ toOutDesc.length > 90 ? toOutDesc.slice(0, 90) : toOutDesc }}
              <span class="more-click" @click="showMore($event, 4)"> ...更多 </span>
            </div>
          </div>
        </div>
        <!-- 政策尾部说明文字 -->
        <div class="desc-footer">以上政策整理自当地政府等公开发布的信息，如有更新或错漏， 请以最新政策为准，建议在出行前咨询当地防疫部门、机场、火车站等</div>
        <!-- 健康码 -->
        <div class="qr">
          <p class="qr-title">请准备好进出凭证</p>
          <!-- 健康码单元格 -->
          <van-cell-group>
            <van-cell :title="fromInfo.city_name" :value="fromInfo.health_code_name" is-link icon="qr" @click="showFromPopup" />
            <van-cell :title="toInfo.city_name" :value="toInfo.health_code_name" is-link icon="qr" @click="showToPopup" />
          </van-cell-group>
          <!-- 出发地健康码弹出框 -->
          <van-dialog v-model="fromShow" message="center" confirm-button-text="我知道了" confirm-button-color="#576b95" theme="round-button" :title="fromInfo.health_code_desc">
            <div class="qr-image">
              <img :src="fromInfo.health_code_picture" alt="健康凭证" />
            </div>
          </van-dialog>
          <!-- 目的地健康码弹出框 -->
          <van-dialog v-model="toShow" message="center" confirm-button-text="我知道了" confirm-button-color="#576b95" theme="round-button" :title="toInfo.health_code_desc">
            <div class="qr-image">
              <img :src="toInfo.health_code_picture" alt="健康凭证" />
            </div>
          </van-dialog>
        </div>
      </div>
    </div>
    <div class="footer-right">以上政策仅供参考，可能存在更新迟延或错误，请以相关部门最新官方通知为准。</div>
  </div>
</template>

<script>
export default {
  name: 'PolicyDetail',
  computed: {
    fromInDesc() {
      return this.fromInfo.high_in_desc + this.fromInfo.low_in_desc
    },
    fromOutDesc() {
      return this.fromInfo.out_desc
    },
    toInDesc() {
      return this.toInfo.high_in_desc + this.toInfo.low_in_desc
    },
    toOutDesc() {
      return this.toInfo.out_desc
    },
  },
  data() {
    return {
      fromInfo: {},
      toInfo: {},
      fromShow: false,
      toShow: false,
    }
  },
  methods: {
    showMore(event, id) {
      let desc = ''
      switch (id) {
        case 1:
          desc = this.fromInDesc
          break
        case 2:
          desc = this.fromOutDesc
          break
        case 3:
          desc = this.toInDesc
          break
        case 4:
          desc = this.toOutDesc
          break
      }
      event.target.parentNode.innerText = desc
    },
    showFromPopup() {
      this.fromShow = true
    },
    showToPopup() {
      this.toShow = true
    },
  },
  created() {
    /*
    // 没有使用 jsonp 处理跨域，只用了代理，生产环境无法解决跨域
    const { data } = await this.$api.getPolicyDetail({
      key: '2fc84fc60f639068c374a9d644ae2da2',
      from: this.twoCitys[0].value,
      to: this.twoCitys[1].value
    })
    if(data.error_code === 0) {
      this.fromInfo = data.result.from_info
      this.toInfo = data.result.to_info
    }
    */

    this.fromInfo = window.policyDetailData.result.from_info
    this.toInfo = window.policyDetailData.result.to_info
  },
}
</script>

<style scoped>
/* see Gitee */
</style>
```

## 疫情热点新闻

### HotNews 组件

Home 组件传入新闻数据：

```vue
<HotNews :newsList="newsList"></HotNews>

this.newsList = data.newslist[0].news
```

```vue
<template>
  <div class="news">
    <h3 class="title">疫情新闻热点</h3>
    <div class="card">
      <ul>
        <NewsItem v-for="item in newsList" :key="item.id" :newsObj="item"></NewsItem>
      </ul>
    </div>
  </div>
</template>

<script>
import NewsItem from '@/components/NewsItem.vue'

export default {
  name: 'HotNews',
  components: {
    NewsItem,
  },
  props: {
    newsList: {
      type: Array,
      default: function () {
        return []
      },
    },
  },
}
</script>

<style scoped>
/* see Gitee */
</style>
```

### NewsItem 组件

```vue
<template>
  <li class="item" @click="goSource">
    <div class="tag">{{ newsObj.pubDateStr }}</div>
    <div class="content">
      <div class="title">
        {{ newsObj.title }}
      </div>
      <p>{{ newsObj.summary }}</p>
    </div>
    <span href="javascript:;">></span>
  </li>
</template>

<script>
export default {
  name: 'NewsItem',
  props: {
    newsObj: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  methods: {
    goSource() {
      window.location.href = this.newsObj.sourceUrl
    },
  },
}
</script>

<!-- 这里的样式自己一步一步试出来的，要仔细看 -->
<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  padding: 0.15rem 0.16rem;
  border-bottom: 1px solid #f1f1f1;
}
.tag {
  display: flex;
  flex: none; /* 很重要 */
  justify-content: center;
  width: 0.5rem;
  height: 0.17rem;
  margin-top: 0.02rem;
  padding: 0 0.04rem;
  background-color: #f74c31;
  border-radius: 0.03rem;
  color: #fff;
  font-weight: 700;
}
.content {
  display: flex;
  flex: auto;
  flex-direction: column;
  justify-content: center;
  margin: 0 0.07rem;
}
.content .title {
  color: #333;
  font-size: 0.16rem;
  font-weight: 700;
}
.content p {
  overflow: hidden;
  width: 2rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #999;
}
.item span {
  margin: 0 0.06rem;
}
</style>
```
