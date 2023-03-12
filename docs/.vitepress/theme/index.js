import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import TotalVisitors from './components/TotalVisitors.vue'
import Copyright from './components/Copyright.vue'
import './custom.scss'

export default {
  ...DefaultTheme,
  /**
   * 在页面指定位置注入自定义插槽
   * 官方文档：[https://vitepress.dev/guide/extending-default-theme#layout-slots]
   */
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 左上角标题后插入TotalVisitors
      'nav-bar-title-after': () => h(TotalVisitors),
      // 每篇文档底部插入Copyright
      'doc-after': () => h(Copyright),
    })
  },
  /**
   * 增强Vue的app实例的功能
   * app: app实例
   * router: router路由实例
   * 官方文档：[https://vitepress.dev/guide/custom-theme#theme-interface]
   */
  enhanceApp: ({ app, router, siteData }) => {
    // provide&inject 是vue组件通信的简便方式，DEV判断当前是否为开发环境
    app.provide('DEV', process.env.NODE_ENV === 'development')
  }
}