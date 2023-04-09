# 周录记 2023

## 0403-0409

### 文章

1、解决国内 GitHub 无法访问的问题

[github 不能访问，解决方案](https://blog.51cto.com/u_15812342/5723921){link=card}

:::tip GitHub 无法访问，主要有三种解决方法：

- 使用 [github520](https://github.com/521xueweihan/GitHub520)
- 配置 github 的 IP 到 host 文件中
- kExUe 上网解决一切问题

:::

2、DNS 做了什么

文章详细介绍了 DNS 的相关内容，从而让我们理解 github520 背后的工作原理。

[搞懂 DNS 做了什么，再试试 GitHub520 项目的加速效果](https://blog.csdn.net/a419240016/article/details/106514040){link=card}

3、GitHub 如何配置 SSH Keys

[Github 配置 ssh key 的步骤（大白话+包含原理解释）](https://blog.csdn.net/weixin_42310154/article/details/118340458){link=card}

:::tip
GitHub 配置了 SSH Keys 后，即可使用 ssh 链接与 GitHub 仓库进行远程交互，而无需 HTTPS 链接。

ssh 链接的好处是，当你无法访问 GitHub 时，也能通过 ssh 链接向仓库推送代码。
:::

4、GitHub 配置 personal access token

现在 GitHub 不再使用密码认证，转而使用 personal access token 进行认证，文章介绍了如何配置使用 personal access token。

[github 配置使用 personal access token 认证](https://www.jianshu.com/p/ab5977d763e9){link=card}

5、如何制作 GitHub 小徽章

文章介绍了如何制作与使用类似 <img src="https://img.shields.io/badge/stars-3k-blue" style="display:inline-block;position:relative;top:5px" /> 的小图标。

[Github 上的小徽章制作与应用指南](https://www.cnblogs.com/singerw/p/14127815.html){link=card}
[如何在你的 GitHub 仓库介绍上加上小图标？](https://www.bilibili.com/read/cv16327331){link=card}

5、怎么获取网页 logo 图标的 URL 链接

[怎么获取网页 logo 图标的 URL 链接](https://baijiahao.baidu.com/s?id=1700106073888091496){link=card}

:::tip 获取网站 favicon 图标链接

- 网站首页后拼接 `/favicon.ico`，一般都会出来
- 点击 F12，寻找带有 `icon` 值的 `link` 标签

:::

![link标签](./images/weekly2023/link-icon.png)

6、用 CSS 画 `√、×` 等符号

文章介绍了如何用纯 CSS 去画出勾 √、叉 ×、三角形 △、大于号 ＞ 几类常见符号。

[简单的使用 css 画勾、叉、三角、大于号](https://blog.csdn.net/Luxuriant_tree/article/details/83181888){link=card}

7、CSS 实现超长文字溢出省略号

[CSS-文字溢出的省略号显示](https://blog.csdn.net/m0_72650596/article/details/127027051){link=card}

:::tip CSS 实现超长文字溢出省略号

超长文字溢出主要分为两类：单行溢出和多行溢出。

单行溢出比较常见：

```CSS
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

多行溢出只适用于 webkit 内核的浏览器：

```CSS
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
```

:::

8、CSS3 阴影效果使用

文章详细介绍了 CSS3 阴影属性 `box-shadow` 的使用方法。

```CSS
box-shadow: 1px 1px 1px #999;
```

[CSS3 阴影实现方法及技巧全解](https://www.w3cschool.cn/css3/css3-shadow.html){link=card}

9、`flv.js` API 中文文档

高手翻译的 `flv.js` API 中文文档。
[flv.js 中文 API 文档](https://www.jianshu.com/p/b58356b465c4){link=card}

官网 GitHub。
[flv.js API](https://github.com/bilibili/flv.js/blob/master/docs/api.md){link=card}

### 视界

1、老板管理手册

红极一时的老板管理手册。

[全网都在疯传的《老板管理手册》(转)](https://zhuanlan.zhihu.com/p/537042061){link=card}
