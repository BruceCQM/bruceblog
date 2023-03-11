# 打包上线

## jsonp 解决跨域

项目目前暂时只需对获取政策详情接口做跨域处理。

`public/index.html` 中声明数据处理回调函数：

```html
<html lang="">
  <head>
    ...
    <script>
      var jsonp = function (url) {
        const script = document.createElement('script')
        script.setAttribute('src', url)
        document.getElementsByTagName('head')[0].appendChild(script)
      }
      var policyDetailHandler = function (data) {
        console.log('policyDetailHandler is called...')
        window.policyDetailData = data
      }
      // const policyDetailURL = 'https://apis.juhe.cn/springTravel/query?key=ea3295121216b176e1a6b8af7fcd3dcf&from=10028&to=10017&callback=policyDetailHandler'
      // jsonp(policyDetailURL)
    </script>
  </head>
  ...
</html>
```

Travel 组件中选择完毕出发城市和目的城市就会发送请求获取详情数据，使用 jsonp 要保证在进入 PolicyDetail 组件之前已经得到数据。这一点挺麻烦的，试了很久，一开始想用 Promise 解决，并且是在点击查看政策详情按钮时才发送请求获取数据，可是无论怎么尝试，**数据回调函数的调用始终都在 PolicyDetail 组件创建完成之后**。因此没办法，只能**把详情数据的获取提前到选择完成出发地和目的地，这样就能保证在点击按钮前往政策详情页时已经获取到数据了，并且数据直接保存到 window 对象上**。

旁门左道的 jsonp 只能搭配旁门左道的代码啊！

```js
// 每次选择地点都进行查询，为了能让政策页面拿到数据
async checkPolicy() {
  if(this.twoCitys.length === 2) {
    const fromId = this.twoCitys[0].value
    const toId = this.twoCitys[1].value
    const policyDetailURL = `https://apis.juhe.cn/springTravel/query?key=ea3295121216b176e1a6b8af7fcd3dcf&from=${fromId}&to=${toId}&callback=policyDetailHandler`
    window.jsonp(policyDetailURL)
  }
},
// 前往出行政策详情页
goPolicy() {
  if(this.twoCitys.length === 2) {
    this.$router.push('/policy')
  } else {
    this.$notify({ type: 'warning', message: '请选择出发地和目的地！' })
  }
}
```

## 项目打包

配置 [publicPath](https://cli.vuejs.org/zh/config/#publicpath) 指定具体子路径：

> 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/

我部署在 `http://brucecai55520.gitee.io/covid19/#/` ，因此 publicPath 设置为 `/covid19/`

```js
// vue.config.js
module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://apis.juhe.cn',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/covid19/' : '/',
}
```

运行命令打包项目：

```bash
npm run build
```

最后将打包生成的文件上传到 Gitee，并部署到 Gitee Pages 即可。

完结撒花~ :tada::rose:
