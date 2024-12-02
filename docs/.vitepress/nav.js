export default [
  {
    text: '随笔杂谈',
    link: '/magazine/articles'
  },
  {
    text: '资源集中营',
    link: '/resources/navigation/nav'
  },
  {
    text: '前端学习',
    items: [
      {
        text: '扎马步',
        items: [
          { text: 'HTML / CSS', link: '/fe/css/css' },
          { text: 'JavaScript', link: '/fe/js/what_is_js' },
          { text: 'Vue', link: '/fe/vue/vue_core_basis' },
          { text: 'React', link: '/fe/react/react_basis' },
          { text: 'Nodejs', link: '/fe/nodejs/node_basis' },
          { text: 'Git', link: '/fe/git/git' },
          { text: 'Webpack', link: '/fe/webpack/webpack_quick' },
          { text: 'Vscode', link: '/fe/ide/vscode' },
        ]
      },
      {
        text: '项目',
        items: [
          { text: 'COVID-19', link: '/projects/covid19/headline' },
          { text: 'Echarts', link: '/projects/echarts/headline' },
        ]
      },
    ]
  },
  {
    text: '宝典',
    link: '/interview/javascript'
  },
  {
    text: '知也无涯',
    items: [
      { text: 'Python', link: '/lang/python/crawler' }
    ]
  },
  {
    text: '高效搬砖',
    items: [
      { text: '那些年, Antd 坑我的地方', link: '/work/antd' },
      { text: 'Error 虐我千百遍', link: '/work/errors' },
      { text: '富文本编辑器', link: '/work/editor' },
      { text: 'Mobx 那些事儿', link: '/work/mobx' },
      { text: '开发工具', link: '/work/tools' },
      { text: '问题碎碎记', link: '/work/problems' },
      {
        text: '微信小程序',
        items: [
          { text: '小程序开发之坑', link: '/work/wx/wx_points' },
          { text: '微信小程序地图开发', link: '/work/wx/wx_map' },
        ]
      },
    ]
  },
]