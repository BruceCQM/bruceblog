# React UI 组件库

## Ant Design 配置按需引入和自定义主题

> 以下配置是 `3.x` 版本，`4.x` 版本见[官网](https://3x.ant.design/index-cn)

1. 安装依赖：

```
npm install react-app-rewired customize-cra babel-plugin-import less less-loader
```

2. 修改 `package.json`

```js
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
}
```

3. 根目录下创建 `config-overrides.js`

```js
//配置具体的修改规则
const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { '@primary-color': 'green' },
    },
  })
)
```

4. 备注：不用在组件里引入样式，`import 'antd/dist/antd.css'` 删掉
