import nav from './nav'
import sidebar from './sidebar'

const base = '/bruceblogpages/';
const githubFavicon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 0C7.16 0 0 7.16 0 16C0 23.08 4.58 29.06 10.94 31.18C11.74 31.32 12.04 30.84 12.04 30.42C12.04 30.04 12.02 28.78 12.02 27.44C8 28.18 6.96 26.46 6.64 25.56C6.46 25.1 5.68 23.68 5 23.3C4.44 23 3.64 22.26 4.98 22.24C6.24 22.22 7.14 23.4 7.44 23.88C8.88 26.3 11.18 25.62 12.1 25.2C12.24 24.16 12.66 23.46 13.12 23.06C9.56 22.66 5.84 21.28 5.84 15.16C5.84 13.42 6.46 11.98 7.48 10.86C7.32 10.46 6.76 8.82 7.64 6.62C7.64 6.62 8.98 6.2 12.04 8.26C13.32 7.9 14.68 7.72 16.04 7.72C17.4 7.72 18.76 7.9 20.04 8.26C23.1 6.18 24.44 6.62 24.44 6.62C25.32 8.82 24.76 10.46 24.6 10.86C25.62 11.98 26.24 13.4 26.24 15.16C26.24 21.3 22.5 22.66 18.94 23.06C19.52 23.56 20.02 24.52 20.02 26.02C20.02 28.16 20 29.88 20 30.42C20 30.84 20.3 31.34 21.1 31.18C27.42 29.06 32 23.06 32 16C32 7.16 24.84 0 16 0V0Z" fill="#24292E"/></svg>';
const giteeFavicon = '<svg height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" fill="#c71d23" r="16"/><path d="m24.0987698 14.2225144h-9.0863697c-.4362899.000207-.7900048.3538292-.790326.7901191l-.0005173 1.9752185c-.0003277.4363707.353328.7902117.7896987.790326.0000712 0 .0001424 0 .0002135-.0002135l5.5317648-.0000461c.4363708-.0000102.7901221.3537352.7901257.790106 0 .0000022 0 .0000044-.0000066.0000066v.1975077.1975318c0 1.3091122-1.0612451 2.3703573-2.3703573 2.3703573h-7.5067195c-.4363081-.0000218-.790009-.353713-.7900429-.7900211l-.0002069-7.5059917c-.0001014-1.3091122 1.0611145-2.3703865 2.3702267-2.3704226.0000217 0 .0000435 0 .0000653.0000653h11.0602463c.4361793-.0004902.7898484-.35394.7906091-.79011894l.0012251-1.97521881c.0007606-.43637034-.3527683-.79033806-.7891389-.79060871-.0001634-.0000001-.0003268-.00000015-.0004901.00048976h-11.0617654c-3.27278051 0-5.92589329 2.65311278-5.92589329 5.9258933v11.0612755c0 .4363707.35374837.7901191.7901191.7901191h11.65447149c2.9454379 0 5.3331872-2.3877493 5.3331872-5.3331872v-4.5430682c0-.4363707-.3537484-.7901191-.7901191-.7901191z" fill="#fff"/></g></svg>';
const juejinFavicon = `
<svg width="36" height="28" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M17.5875 6.77268L21.8232 3.40505L17.5875 0.00748237L17.5837 0L13.3555 3.39757L17.5837 6.76894L17.5875 6.77268ZM17.5863 17.3955H17.59L28.5161 8.77432L25.5526 6.39453L17.59 12.6808H17.5863L17.5825 12.6845L9.61993 6.40201L6.66016 8.78181L17.5825 17.3992L17.5863 17.3955ZM17.5828 23.2891L17.5865 23.2854L32.2133 11.7456L35.1768 14.1254L28.5238 19.3752L17.5865 28L0.284376 14.3574L0 14.1291L2.95977 11.7531L17.5828 23.2891Z" fill="#1E80FF"/>
</svg>`
const sfFavicon = `
<svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>sf icon</title>
    <g id="--个人设置" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="个性名片" transform="translate(-550.000000, -461.000000)" fill-rule="nonzero">
            <g id="Group-6" transform="translate(352.000000, 136.000000)">
                <g id="card" transform="translate(21.000000, 309.000000)">
                    <g id="sf-icon" transform="translate(177.000000, 16.000000)">
                        <rect id="Rectangle" fill="#00965E" x="0" y="0" width="16" height="16" rx="3.57142857"></rect>
                        <path d="M5.63714286,6.10857143 C6.39279589,6.09255421 7.13885005,6.28005459 7.79714286,6.65142857 L7.79714286,6.77714286 L7.26857143,7.92 C6.8629335,7.63426481 6.37902884,7.48061261 5.88285714,7.48 C5.22,7.48 5.08285714,7.81142857 5.08285714,8.08857143 C5.08285714,8.54 5.50857143,8.7 6.04857143,8.90285714 L6.41714286,9.04571429 C7.41714286,9.46285714 7.96,9.90285714 7.96,11.0457143 C7.96,12.8828571 6.33714286,13.1428571 5.36857143,13.1428571 C4.50046516,13.1611408 3.65066396,12.8919367 2.95142857,12.3771429 L2.95142857,12.2485714 L3.5,11.1514286 C3.93172456,11.5520705 4.48467525,11.7973796 5.07142857,11.8485714 C5.50285714,11.8485714 5.96571429,11.6714286 5.96571429,11.1714286 C5.96571429,10.7314286 5.57142857,10.5685714 5.07428571,10.3628571 C4.89714286,10.2914286 4.69714286,10.2085714 4.48571429,10.1028571 C3.66285714,9.69428571 3.11428571,9.20857143 3.11428571,8.16571429 C3.11428571,6.30857143 4.88,6.10857143 5.63714286,6.10857143 Z M11.5371429,2.83142857 C12.0555743,2.81764837 12.5709437,2.9150717 13.0485714,3.11714286 L13.0485714,3.27428571 L12.6514286,4.45714286 C12.4762389,4.35948399 12.28043,4.30465751 12.08,4.29714286 C11.6428571,4.29714286 11.4542857,4.60571429 11.4542857,5.33142857 L11.4542857,6.22285714 C11.4538434,6.24506316 11.4620379,6.2665739 11.4771429,6.28285714 L11.5050704,6.29972583 L11.5050704,6.29972583 L11.5371429,6.30571429 L12.6371429,6.30571429 L12.6371429,6.30571429 L12.6142857,7.75714286 L12.3637568,7.75680966 C12.1617076,7.75614327 11.9054144,7.75414411 11.6897709,7.74814661 L11.5371429,7.74285714 C11.5150373,7.74297216 11.493722,7.75109229 11.4771429,7.76571429 C11.4614802,7.78164536 11.4531927,7.80340008 11.4542857,7.82571429 C11.4628571,8.29285714 11.4702232,9.04727679 11.4762333,9.83871094 L11.4817857,10.6332143 C11.4885714,11.6842857 11.4928571,12.6528571 11.4942857,12.9457143 L9.45714286,12.9571429 L9.45737143,12.324 C9.45741714,12.2650057 9.457472,12.203168 9.45753783,12.138795 L9.45807909,11.7245979 C9.45866423,11.3581888 9.45961509,10.9438025 9.46116023,10.5199534 L9.46331429,10.0092571 C9.46742857,9.15874286 9.47428571,8.332 9.48571429,7.83714286 C9.48456058,7.81471903 9.47544229,7.79344301 9.46,7.77714286 L9.43207243,7.76027417 L9.43207243,7.76027417 L9.4,7.75428571 C9.11428571,7.75428571 8.85714286,7.76857143 8.70571429,7.76857143 L8.72857143,6.31714286 L9.4,6.31714286 C9.42210557,6.31702784 9.4434209,6.30890771 9.46,6.29428571 C9.47589772,6.27828893 9.48509435,6.25683012 9.48571429,6.23428571 C9.48571429,6.20571429 9.45714286,5.07714286 9.45714286,5.05714286 C9.45714286,3.21714286 10.6,2.83142857 11.5371429,2.83142857 Z" id="Combined-Shape" fill="#FFFFFF"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
`
const CSDNFavicon = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve">  <image id="image0" width="32" height="32" x="0" y="0"
    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABMlBMVEX8VTH8dFf9pZL9xLf+
0cf+zsP9uar8knv8Xjz8g2n+29P////+9vX9rpz8Wzj8Wjf9vrD+/v7+4tz8ZUX8XTv+187+5+L9
sJ/9wLL+7er9vK78VjP9zsT+6+f8iG/8VzT9mYT+9fP+z8X9pJD+4dv8ZEP8b1H+6+b8jnb8ZkX+
+Pf+9PH8aUr8Xz38cFL9sqL9nYj+8u/+7+z8WTb8f2T9taX8h239v7H8Z0f+zsT+/f3+0sn++/v9
y7/9tqb8eVz9q5r8YUD++/r8Y0L8bE38iXH8VjL+1s78YT/8gGX+9PL8Zkb+8/D9m4b8YkD8WDX9
w7b+9vT8hGr++vr+6OP+2dH+1Mv+4Nr++ff+7+v8fmP9sKD+8/H+7ur9qpn9qpj9wrb+zMH9u639
oY38el78VzOb/PDuAAAAAWJLR0QLH9fEwAAAAAd0SU1FB+cEEAM2G2MzlgUAAAEASURBVDjLY2AY
dICRiZmFlY2dA4c0Jxc3BPDw8mGR5hcQ5IYDIWEMeRFRkISYgLiEJIghhS4vLQMUlZUDMeUVFLm5
ldAVKAPlVVShHDV1QQ00eU0tbm5tHThXVw/dAH2gAQZ4/C9vyM1tZIxHgQnQAFN8IcgEVGCGT4E5
UIEFPgWW3NxW0vgUWHNz2+CTZ7AFWiGCT4EdUIE9PgXsQAUO+BQ4OnFzGzojCbi4uqGqEAAa4e4B
53p6cYujKvD2AcW2rx+I7W8SYMXNHYhmSVAwKJkIhoSGhUeA01QIujM8I7mRgVEUhkM9omPg0rFx
utj8wh8Un6BknZiUnJLKMJgAAK9gG/sHs2daAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTA0LTE2
VDAzOjU0OjI3KzAwOjAwSk898gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0wNC0xNlQwMzo1NDoy
NyswMDowMDsShU4AAAAASUVORK5CYII=" />
</svg>
`

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
      { icon: { svg: juejinFavicon }, link: 'https://juejin.cn/user/4152185650162680' },
      { icon: { svg: sfFavicon }, link: 'https://segmentfault.com/u/ning_643b67be37ac3/articles' },
      { icon: { svg: CSDNFavicon }, link: 'https://blog.csdn.net/weixin_45138590?type=blog' },
      // { icon: 'facebook', link: 'https://www.facebook.com' },
      // { icon: 'youtube', link: 'https://www.youtube.com/' },
    ],
    // 最后更新时间
    lastUpdatedText: 'Last updated',
    // 设置底部的版权声明，只有左边侧边栏不存在才会展示
    footer: {
      message: 'If there is any reprint or CV, please mark the original address of this website',
      copyright: 'Copyright © 2023-present BruceBlog'
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