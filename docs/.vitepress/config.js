import nav from './nav'
import sidebar from './sidebar'

const base = '/bruceblogpages/';
const githubFavicon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 0C7.16 0 0 7.16 0 16C0 23.08 4.58 29.06 10.94 31.18C11.74 31.32 12.04 30.84 12.04 30.42C12.04 30.04 12.02 28.78 12.02 27.44C8 28.18 6.96 26.46 6.64 25.56C6.46 25.1 5.68 23.68 5 23.3C4.44 23 3.64 22.26 4.98 22.24C6.24 22.22 7.14 23.4 7.44 23.88C8.88 26.3 11.18 25.62 12.1 25.2C12.24 24.16 12.66 23.46 13.12 23.06C9.56 22.66 5.84 21.28 5.84 15.16C5.84 13.42 6.46 11.98 7.48 10.86C7.32 10.46 6.76 8.82 7.64 6.62C7.64 6.62 8.98 6.2 12.04 8.26C13.32 7.9 14.68 7.72 16.04 7.72C17.4 7.72 18.76 7.9 20.04 8.26C23.1 6.18 24.44 6.62 24.44 6.62C25.32 8.82 24.76 10.46 24.6 10.86C25.62 11.98 26.24 13.4 26.24 15.16C26.24 21.3 22.5 22.66 18.94 23.06C19.52 23.56 20.02 24.52 20.02 26.02C20.02 28.16 20 29.88 20 30.42C20 30.84 20.3 31.34 21.1 31.18C27.42 29.06 32 23.06 32 16C32 7.16 24.84 0 16 0V0Z" fill="#24292E"/></svg>';
const giteeFavicon = '<svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" fill="#c71d23" r="16"/><path d="m24.0987698 14.2225144h-9.0863697c-.4362899.000207-.7900048.3538292-.790326.7901191l-.0005173 1.9752185c-.0003277.4363707.353328.7902117.7896987.790326.0000712 0 .0001424 0 .0002135-.0002135l5.5317648-.0000461c.4363708-.0000102.7901221.3537352.7901257.790106 0 .0000022 0 .0000044-.0000066.0000066v.1975077.1975318c0 1.3091122-1.0612451 2.3703573-2.3703573 2.3703573h-7.5067195c-.4363081-.0000218-.790009-.353713-.7900429-.7900211l-.0002069-7.5059917c-.0001014-1.3091122 1.0611145-2.3703865 2.3702267-2.3704226.0000217 0 .0000435 0 .0000653.0000653h11.0602463c.4361793-.0004902.7898484-.35394.7906091-.79011894l.0012251-1.97521881c.0007606-.43637034-.3527683-.79033806-.7891389-.79060871-.0001634-.0000001-.0003268-.00000015-.0004901.00048976h-11.0617654c-3.27278051 0-5.92589329 2.65311278-5.92589329 5.9258933v11.0612755c0 .4363707.35374837.7901191.7901191.7901191h11.65447149c2.9454379 0 5.3331872-2.3877493 5.3331872-5.3331872v-4.5430682c0-.4363707-.3537484-.7901191-.7901191-.7901191z" fill="#fff"/></g></svg>';

export default {
  // 自定义网站 favicon
  head: [
    // 打包后使用
    ['link', { rel: 'icon', href: `${base}favicon.ico` }],
    // 本地开发用
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  // 根路径，和仓库名一致
  base,
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
      {
        icon: 'github',
        link: 'https://github.com/BruceCQM'
      },
      {
        icon: { svg: giteeFavicon, },
        link: 'https://gitee.com/brucecai55520'
      },
      // { icon: 'twitter', link: 'https://twitter.com' },
      // { icon: 'facebook', link: 'https://www.facebook.com' },
      // { icon: 'youtube', link: 'https://www.youtube.com/' },
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
    },
    // 仅移动端生效
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    algolia: {
      appId: 'D174SMAAP9',
      apiKey: 'ff5a5ad8bd3ceb6f5c330b0fde865725',
      indexName: 'brucepages',
      placeholder: '快乐搜索吧',
      translations: {
        button: {
          buttonText: '搜索',
          buttonAriaLabel: '搜索'
        },
        modal: {
          searchBox: {
            resetButtonTitle: '清除查询条件',
            resetButtonAriaLabel: '清除查询条件',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消'
          },
          startScreen: {
            recentSearchesTitle: '搜索历史',
            noRecentSearchesText: '没有搜索历史',
            saveRecentSearchButtonTitle: '保存至搜索历史',
            removeRecentSearchButtonTitle: '从搜索历史中移除',
            favoriteSearchesTitle: '收藏',
            removeFavoriteSearchButtonTitle: '从收藏中移除'
          },
          errorScreen: {
            titleText: '无法获取结果',
            helpText: '你可能需要检查你的网络连接'
          },
          footer: {
            selectText: '选择',
            navigateText: '切换',
            closeText: '关闭',
            searchByText: '搜索提供者'
          },
          noResultsScreen: {
            noResultsText: '无法找到相关结果',
            suggestedQueryText: '你可以尝试查询',
            reportMissingResultsText: '你认为该查询应该有结果？',
            reportMissingResultsLinkText: '点击反馈'
          }
        }
      }
    }
  },
}