# VuePress 从 0 开始搭建个人网站

> BruceBlog 从无到有的全过程
>
> [VuePress 官网传送门](https://vuepress.vuejs.org/zh/)

## 体验 VuePress

1. 创建并进入新目录

```bash
mkdir bruceblog
cd bruceblog
```

2. 初始化 npm

```bash
npm init
```

3. 安装 VuePress

```bash
npm install -D vuepress
```

4. 在根目录下创建 docs 文件夹

```bash
mkdir docs
```

5. 在 docs 目录下新建 README.md 文档，并写入一些内容

6. 在 `package.json` 文件添加 `scripts`

```json
{
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  }
}
```

7. 启动本地服务器

```bash
npm run dev
```

8. 浏览器打开服务器所给地址

## 目录结构

以下为 BruceBlog 部分目录结构，比较重要的是 `.vuepress` 目录的结构。官方目录结构请移步 [→](https://vuepress.vuejs.org/zh/guide/directory-structure.html)

```
.
├── docs
│   ├── .vuepress
│   │   ├── public
|   |   |   └── img
│   │   ├── styles
│   │   │   └── index.styl
│   │   ├── nav.js
│   │   ├── sidebar.js
│   │   └── config.js
|   |
│   ├── notes
│   │   ├── vue
|   │   │   ├── images
|   │   │   ├── sidebar.js
|   │   │   ├── vuex.md
|   │   │   ├── vue3.md
|   │   │   └── ...
|   |   |
|   |   ├── react
|   │   │   ├── images
|   │   │   ├── sidebar.js
|   │   │   ├── react-cli.md
|   │   │   └── ...
|   │   │
|   │   ├── ...
|   |   |
│   │   └── README.md
|   |
│   └── README.md
│
├── .gitignore
|
└── package.json
```

## `config.js` 文件配置

每个配置的作用都写在注释当中。

官方文档：[配置](https://vuepress.vuejs.org/zh/config/)、[插件](https://vuepress.vuejs.org/zh/plugin/)、[默认主题配置](https://vuepress.vuejs.org/zh/theme/default-theme-config.html)

```js
module.exports = {
  // 插件：置顶按钮、图片缩放
  plugins: ['@vuepress/back-to-top', '@vuepress/medium-zoom'],
  // 自定义网站 favicon
  head: [['link', { rel: 'icon', href: '/img/logo.png' }]],
  // 根路径，和仓库名一致
  base: '/bruceblog/',
  // 左上角标题
  title: 'BruceBlog',
  // markdown 相关配置
  markdown: {
    // 代码块行号
    lineNumbers: true,
  },
  // 默认主题相关配置
  themeConfig: {
    // 配置左上角的 logo
    logo: '/img/logo.png',
    // 导航栏
    nav: require('./nav.js'),
    // 侧边栏
    sidebar: require('./sidebar.js'),
    // sidebar: 'auto',
    // 标题深度，2 表示提取 h2 和 h3 标题
    sidebarDepth: 2,
    // 启用页面滚动效果
    smoothScroll: true,
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    prevLinks: true,
    // 导航栏显示 gitee 仓库
    repo: 'https://gitee.com/brucecai55520/bruceblog',
    repoLabel: 'Gitee',
  },
}
```

## 首页

`docs/README.md`文档：

```yaml
---
home: true
heroImage: /img/logo.png
heroText: BruceBlog
tagline: 一名前端er的学习笔记
actionText: Get Started →
actionLink: /notes/
features:
  - title: 前端知识
    details: HTML、CSS、JavaScript、Vue、React...
  - title: 计算机基础
    details: 计算机网络、数据结构、操作系统...
  - title: 杂七杂八
    details: 前端面试常见的面试题、资源推荐...
footer: Oh this is BruceBlog
---
```

[官方文档](https://vuepress.vuejs.org/zh/theme/default-theme-config.html)

## 导航栏

这里没有直接把配置写在 `config.js` 文件中，而是提取成一个模块，便于后续维护，也避免 `config.js` 文件过于臃肿。

注意事项：

- 所有路径以 `/` 开头，`/` 代表 docs 目录
- 若没有指明具体文件，只有文件夹，则默认会寻找该文件夹下的 READMED.md 文档，如 `'/notes/'` → `'/notes/README.md'`

```js
// .vuepress/nav.js
module.exports = [
  {
    text: 'Resources',
    link: '/notes/xxx/xxxx',
  },
  {
    text: '前端学习',
    items: [
      { text: 'Vue', link: '/notes/vue/vue基础' },
      { text: 'React', link: '/notes/react/react基础' },
    ],
  },
]
```

[官方文档](https://vuepress.vuejs.org/zh/theme/default-theme-config.html#%E5%AF%BC%E8%88%AA%E6%A0%8F)

## 侧边栏

BruceBlog 为不同页面显示不同的侧边栏，并且每个页面的侧边栏封装为一个模块便于后续维护。

以 Vue 页面的侧边栏为例：

```js
// .vuepress/sidebar.js
module.exports = {
  '/notes/vue': require('../notes/vue/sidebar'),
  '/notes/react': require('../notes/react/sidebar'),
}
```

```js
// notes/vue/sidebar.js
module.exports = [
  {
    title: 'Vue核心基础',
    path: '/notes/vue/vue核心基础',
  },
  {
    title: 'Vuex',
    path: '/notes/vue/vuex',
  },
  {
    title: 'Vue Router',
    path: '/notes/vue/vue-router',
  },
  {
    title: 'Vue3',
    path: '/notes/vue/vue3',
  },
]
```

[官方文档](https://vuepress.vuejs.org/zh/theme/default-theme-config.html#%E4%BE%A7%E8%BE%B9%E6%A0%8F)

## 修改默认样式

在 `.vuepress/styles/index.styl` 文件可以方便地添加自定义样式

```css
blockquote {
  border-left: 0.2rem solid #3eaf7c;
  font-weight: 700;
}
```

[官方文档](https://vuepress.vuejs.org/zh/config/#styling)

## Emoji

输入

```
:tada: :smile:
```

输出

:tada: :smile:

[Emoji 大全](https://www.webfx.com/tools/emoji-cheat-sheet/)

## 搭建过程踩的坑

- h1 标题不会生成目录，因此若想标题出现在目录，请用 h2 和 h3 标题
- 使用 `![]()` 插入图片时，要填写标准的相对路径，如 `./images/xxx.png`，不要省略前面的 `./`，否则图片无法正常显示
- 在非代码块中（包括行内代码）不要使用紧贴的大括号，两个同向的大括号之间加个空格

```js
// 报错写法
style={{ key: value }}
// 不报错写法
style={ { key: value } }
```

- 侧边栏对应的文件路径要书写正确，否则侧边栏无法展示
- 若一个目录有 `README.md` 和 `sidebar.js` ，则其子目录文件夹不能再有
- 总之，如果页面展示出现问题，多看看控制台的报错，一般都会有提示

## 部署

本人选择部署到 Gitee Pages，官方只有部署到 GitHub Pages 的[教程](https://vuepress.vuejs.org/zh/guide/deploy.html)，不过也是大同小异。

1. 在 `docs/.vuepress/config.js` 中设置正确的 `base`。

若发布到 `https://<USERNAME>.gitee.io/` ，可省略此步，因为 `base` 默认为 `"/"` 。

若发布到 `https://<USERNAME>.gitee.io/<REPO>/` ，`<REPO>` 为仓库名，则将 `base` 设置为 `"/<REPO>/"` 。

```js
module.exports = {
  // 仓库名为 bruceblog
  base: '/bruceblog/',
}
```

2. 在 `bruceblog` 目录下运行打包命令

```bash
npm run build
```

3. 打包完成后，会生成 `dist` 文件夹，进入该文件夹

```bash
cd docs/.vuepress/dist
```

4. 初始化 git，并添加暂存区，提交本地库

```bash
git init
git add -A
git commit -m 'init bruceblog' -a
```

5. 为远程仓库起别名

```bash
git remote add origin 远程仓库地址
```

6. 拉取远程仓库分支，与本地分支合并

本人额外创建了一个分支，`master` 分支保存原始的 markdown 文档，`pages`分支则用于上传打包后的文件，并使用 `pages` 分支部署 Gitee Pages。

```bash
git pull origin pages
```

7. 推送本地分支到远程分支

```bash
git push origin master:pages
```

8. 选择部署分支，并开启 Gitee Pages 服务

至此，BruceBlog 的搭建大功告成！:tada::smile:

## 更新网站内容

> VuePress 每次打包生成的 dist 都不相同，因此尽量有比较大改动时才更新网站，这不像 docsify 那么方便自由

- 本地拷贝一份 `.git` 文件夹备用，删除旧的 `dist` 文件夹
- 重新打包生成新的 `dist` 文件夹
- 把备用 `.git` 文件夹拷贝到新的 `dist` 文件夹中
- 将修改添加暂存区，提交本地库，并推送到远程分支
- 如此，既能更新远程 `pages` 分支内容，也能同步 git 的历史操作记录
