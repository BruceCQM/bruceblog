import { h } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import TotalVisitors from './components/TotalVisitors.vue'
import Copyright from './components/Copyright.vue'
import BackToTop from './components/BackToTop.vue'
import EssayLink from '../../components/EssayLink.vue'
import './custom.scss'

export default {
  ...DefaultTheme,
  /**
   * 在页面指定位置注入自定义插槽
   * 官方文档：[https://vitepress.dev/guide/extending-default-theme#layout-slots]
   */
  Layout: () => {
    const { frontmatter } = useData();
    const customClassName = {
      class: frontmatter.value?.layoutClass || ''
    }

    /**
     * h() 方法会把第二个参数对象展开作为页面最外层div的属性
     * 因此以 class 作为键名，即可设置最外层的自定义类名
     */
    return h(DefaultTheme.Layout, customClassName, {
      // 左上角标题后插入TotalVisitors
      'nav-bar-title-after': () => h(TotalVisitors),
      // 每篇文档底部插入Copyright
      'doc-after': () => h(Copyright),
      'aside-bottom': () => h(BackToTop),
      'layout-bottom': () => h(EssayLink),
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