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

## 0410-0416

### 文章

1、git 回退指定版本

[GIT 回退到指定版本的两种方法（reset/revert）](https://blog.csdn.net/L1147484597/article/details/128480953){link=card}

:::tip git 回退指定版本
git 回退到指定版本的两种方法：`git reset` 和 `git revert`。

- `git reset --hard 目标版本号`：会覆盖目标版本之后的所有版本
- `git revert -n 目标版本号`：仅仅撤销目标版本的提交，生成一个新的版本

:::

### 视界

1、工作之余如何学习提升自我？

> 你要做的是，结合自己的目标和实际工作，确定自己的学习方向，在打实基础之外，学习有可能应用到你工作中的知识点

学以致用，不要为学而学，消费是生产的第一动力，实践是学习的第一目标。

[冴羽答读者问：如何学习更有计划性、提升更稳更快？](https://segmentfault.com/a/1190000042178486){link=card}

## 0417-0423

### 文章

1、JS 正则表达式完整教程

大佬写的 JS 正则表达式教程，非常详实细致，可以说看完就是学会了。

[JS 正则表达式完整教程（略长）](https://juejin.cn/post/6844903487155732494){link=card}

2、`flv.js` 优化方案

文章介绍了前端直播常见的技术方案、`flv.js` 的基本原理及其优化方案。

[flv.js 的追帧、断流重连及实时更新的直播优化方案](https://www.cnblogs.com/xiahj/p/flvExtend.html){link=card}

3、TS 入门教程文章

文章详细介绍了 Typescript，是入门 TS 的不二首选。

[2023 typescript 史上最强学习入门文章(2w 字)](https://juejin.cn/post/7018805943710253086){link=card}

4、冴羽系列博客

冴羽大佬写的系列博客，包括 JavaScript 深入系列、JavaScript 专题系列、underscore 系列、ES6 系列等等，写得十分清晰详实。

[冴羽系列博客](https://github.com/mqyqingfeng/Blog){link=card}

## 0522-0528

### 文章

1、小程序页面栈溢出报错 `navigateTo fail page limit exceeded`

小程序页面栈最多十层，反复使用 `navigateTo` 跳转页面，压入页面栈，会导致报错。

[小程序页面跳转，页面栈提示”navigateTo fail page limit exceeded“错误，解决办法](https://blog.csdn.net/qq_35310623/article/details/108082712){link=card}

2、`rpx` 和 `px` 单位的区别

`px` 是固定单位，`1px` 就是 1 像素；`rpx` 是自适应单位，根据屏幕的实际尺寸变化，`1rpx` 可能等于不同的像素。

[微信小程序中rpx和px的区别？](https://blog.csdn.net/weixin_43356308/article/details/115081242){link=card}

3、`!.` 是什么意思？

`!.` 是 TS 中的语法，称为非空断言操作符。它和 JS 的可选链操作符 `?.` 完全没有关系。

`!.` 是告诉 TS，这个值我保证不为空，TS 你可以不用进行检查。

因此，不建议使用 `!.`，因为实际上你并不能保证值不为空。

[Non-null Assertion Operator (Postfix!)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#non-null-assertion-operator-postfix-){link=card}

[js中‘!.’是什么意思？](https://www.zhihu.com/question/459179143){link=card}

4、何为 Docker？

文章介绍了 Docker 的基本知识，比较通俗易懂。

Docker 其实是一个容器。容器：搭建一套给程序运行的环境。只隔离应用程序运行时环境，共享操作系统。与虚拟机相比，更轻量级、占用资源更少。

[什么是Docker？看这一篇干货文章就够了！](https://zhuanlan.zhihu.com/p/187505981){link=card}

5、SSH 登录 GitHub 报错 `Connection to xxx port 22: ...`

最近使用 ssh 登录 GitHub 时报错：

:::error
kex_exchange_identification: read: Software caused connection abort
banner exchange: Connection to xxx port 22: Software caused connection abort
fatal: Could not read from remote repository.
Please make sure you have the correct access rights and the repository exists.
:::

修改 ssh 的默认端口为 443 即可。

[坑：ssh: connect to host github.com port 22: Connection refused](https://zhuanlan.zhihu.com/p/521340971){link=card}

## 0529-0604

### 文章

1、日常开发提升技术的 13 条建议

文章总结了平常开发过程当中 13 条提升自我技术的建议，小处着手，实用。

![日常开发提升技术的 13 条建议](./images/weekly2023/advice13.png)

[我差点把同事卷跑了。。。](https://mp.weixin.qq.com/s/JQo9inrZ6eoBazDnxvkD8A){link=card}