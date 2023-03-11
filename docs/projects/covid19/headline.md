# COVID-19 新冠疫情实时数据和政策展示

项目线上演示地址：[http://brucecai55520.gitee.io/covid19](http://brucecai55520.gitee.io/covid19)

接口主要使用的是天行数据和聚合数据提供的 API，前者没有跨域问题，后者有

- 病毒信息、国内疫情数据、新闻热点：[https://www.tianapi.com/apiview/169](https://www.tianapi.com/apiview/169)
- 国内所有省份疫情数据（即那个疫情地图的数据）：[http://iwenwiki.com/wapicovid19/all.php](http://iwenwiki.com/wapicovid19/all.php)
- 国外疫情数据：[https://www.tianapi.com/apiview/176](https://www.tianapi.com/apiview/176)
- 疫情出行政策（包括城市 ID 的获取、具体政策详情等）：[https://www.juhe.cn/docs/api/id/566](https://www.juhe.cn/docs/api/id/566)

项目要点记录：

- 封装 axios
- `src`路径起别名
- 配置代理
- `background-size` 属性
- `props` 对象和数组默认值写法
- 组件封装
- `this.$slots.default`
- [Vue.use()](https://cn.vuejs.org/v2/api/#Vue-use)：插件的定义和使用
- render 写 JSX 语法 - [渲染函数&JSX](https://cn.vuejs.org/v2/guide/render-function.html#JSX)
- echarts 的基本使用
- echarts 地级市地图的 `map` 必须为中文
- echarts 世界地图名称映射关系，只有名称和它内置的一样才能正确显示地图。而获取的数据的地点名称和它内置的不同，因此需要做一个映射
- vue-awesome-swiper 轮播图插件的使用
- vant 组件库按需引入
- axios 合并发送请求
- text-overflow ；display: -wekit-box- ； white-space: nowrap&pre-wrap 属性
- flex: none 含义
- 点击更多展示所有文字思路：先判断字符串长度是否大于 90，是则截取前 90 个字符展示，同时显示更多按钮；点击按钮则把内容替换为完整的文字
- window.location.href 代替 a 标签
- parentNode 和 parentElement 区别
- flex 实现图片居中
- 打包路径问题 publicPath，不然部署有 Provisional headers are shown 错误；还有国内地图点击的跳转路径也是
- 聚合数据 API 生产环境无法使用，跨域问题，jsonp 的使用
- 报错：`Mixed Content: The page at 'https://brucecai55520.gitee.io/covid19/#/' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://iwenwiki.com/wapicovid19/all.php'. This request has been blocked; the content must be served over HTTPS.` HTTPS 页面里动态的引入 HTTP 资源,比如引入一个 js 文件,会被直接 block 掉的。部署 Gitee Pages 时不能使用 HTTPS，要使用 HTTP
