# 准备工作

## 初始化项目

运行命令，基于 vue-cli 创建 vue2 项目：

```bash
vue create my-covid19
```

整理 `src` 目录结构：

```
src
.
│
├── assets: 存放静态资源
│ └── logo.png
│
│── component: 存放一般组件
│
│── plugins: 插件模块如 echarts
│
│── router: 路由模块
│
│── utils: 工具模块如 axios
│
│── views: 存放路由组件
│
│── App.vue
│── main.js
```

创建 `vue.config.js` 文件，配置关闭 ESLint 代码检查功能：

```js
// vue.config.js
module.exports = {
  lintOnSave: false,
}
```

创建 `js.config.json` 文件，为 `src/` 目录路径起别名为 `@/`，方便后续导入模块：

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

## 封装配置 axios

安装 axios：

```bash
npm install axios
```

`utils` 目录下创建 `request.js` 模块：

```js
// utils/request.js
import axios from 'axios'

const api = {
  // 疫情每日新增数据
  getNocv(params) {
    return axios.get('http://api.tianapi.com//ncov/index', {
      params,
    })
  },
  // 中国所有省市疫情数据
  getNocvCity() {
    return axios.get('http://iwenwiki.com/wapicovid19/all.php')
  },
  // 单个省市的疫情数据
  getNocvSingleCity(params) {
    return axios.get('http://iwenwiki.com/wapicovid19/guonei.php', {
      params,
    })
  },
  // 世界各国疫情数据
  getNocvWorld(params) {
    return axios.get('http://api.tianapi.com/ncovabroad/index', {
      params,
    })
  },
  // 疫情出行政策各个城市ID数据
  getTravelPolicy(params) {
    return axios.get('/api/springTravel/citys', {
      params,
    })
  },
  // 具体出行政策数据
  getPolicyDetail(params) {
    return axios.get('/api/springTravel/query', {
      params,
    })
  },
}

export default api
```

将 axios 网络请求模块挂载到 Vue 原型，后续组件实例可通过 `this.$api.getXxx` 的形式调用接口发送请求：

```js
// main.js
import Vue from 'vue'
import api from '@/utils/request'

Vue.prototype.$api = api
```

## 配置代理

疫情出行政策使用的是聚合数据提供的 API，但是该接口存在跨域问题，因此需要配置代理解决跨域

在 `vue.config.js` 文件配置代理：

```js
module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      // 以 /api 开头的请求路径走代理
      '/api': {
        // 代理目标基础路径
        target: 'http://apis.juhe.cn',
        // 修改 host 字段
        changeOrigin: true,
        // 把路径中的 /api 替换为空串
        pathRewrite: { '^/api': '' },
      },
    },
  },
}
```

说明：

- 配置代理解决跨域只在开发环境中有效果，生产环境该方法无效
- 由于聚合数据服务器没有使用 CORS 解决跨域，因此只能在前端这块自行解决生产环境下的跨域问题
- 后续会使用 jsonp 解决跨域

## 封装路由模块

安装 vue-router：

```bash
npm install vue-router
```

`router` 目录创建 `index.js` 文件，创建路由模块：

```js
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/city/:city',
    name: 'city',
    component: () => import('@/views/City.vue'),
    props: true,
  },
  {
    path: '/policy',
    name: 'policy',
    component: () => import('@/views/PolicyDetail.vue'),
  },
]

export default new VueRouter({
  routes,
})
```

挂载路由模块：

```js
// main.js
import Vue from 'vue'
import App from './App.vue'
import api from '@/utils/request'
import router from '@/router'

Vue.config.productionTip = false
Vue.prototype.$api = api

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
```
