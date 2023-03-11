import nav from './nav'
import sidebar from './sidebar'

export default {
  // 自定义网站 favicon
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  // 根路径，和仓库名一致
  base: '/bruceblog/',
  // 左上角标题
  title: 'BruceBlog',
  // 爬虫爬取的内容
  description: '前端学习-面试题-资源导航-Vue-React-Node',
  // 设置展示最后修改时间
  lastUpdated: true,
  // markdown 相关配置
  markdown: {
    // 代码块行号
    lineNumbers: true,
  },
  // 默认主题相关配置 [https://vitepress.dev/reference/default-theme-config]
  themeConfig: {
    // 配置左上角的 logo
    logo: '/logo.png',
    // 导航栏
    nav,
    // 侧边栏
    sidebar,
    // 标题深度，[2,3] 表示提取 h2 和 h3 标题
    outline: [2, 3],
    // 目录标题
    outlineTitle: 'Have a brief look',
    // 设置社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/BruceCQM' },
      { icon: 'twitter', link: 'https://twitter.com' },
      { icon: 'facebook', link: 'https://www.facebook.com' },
      { icon: 'youtube', link: 'https://www.youtube.com/' },
    ],
    // 最后更新时间
    lastUpdatedText: 'Last updated',
    // 设置底部的版权声明，只有左边侧边栏不存在才会展示
    footer: {
      message: 'If there is any reprint or CV, please mark the original address of this website',
      copyright: 'Copyright © 2019-present BruceBlog'
    },
    // 设置编辑页面链接
    editLink: {
      pattern: 'https://github.com/BruceCQM/bruceblog',
      text: 'Edit this page on GitHub'
    },
    // 设置上下篇文字
    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    }
  },
}