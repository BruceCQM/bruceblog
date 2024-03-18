# 那些年，被各种 Error 折磨的瞬间

## React Error

### React error #31

![react_error_31](./images/errors/react_error_31.png)

错误原因：

React 的 render 函数只能渲染指定的返回值类型，包括 `string`、`number`、`JSX 对象`，以及它们组成的数组。

若返回了普通的对象，如 `{name: 'React'}`，则会报该错误。

```js
const obj = { name: 'react' };

function demo() {
  return (<>{obj}</>);
}
```

解决方法：渲染结构返回正确的类型。

[Error: Minified React error #31](https://legacy.reactjs.org/docs/error-decoder.html/?invariant=31&args%5B%5D=object%20with%20keys%20%7Btitle%7D&args%5B%5D=){link=card}

一个实际生产环境遇到该报错的案例，深入源码层面寻找剖析错误根源。

[React#31 error，让我熬夜让我秃](https://zhuanlan.zhihu.com/p/367874784){link=card}

### React error #62

![react_error_31](./images/errors/react_error_62.png)

错误原因：JSX 对象的 style，即行内样式书写有误。style 应为对象，不能是字符串。

```js
function demo() {
  return (
    <div style="color: red">
      demo text
    </div>
  );
}
```

解决方法：正确书写行内样式。

```js
function demo() {
  return (
    <div style={{ color: "red" }}>
      demo text
    </div>
  );
}
```

[Error: Minified React error #62](https://legacy.reactjs.org/docs/error-decoder.html/?invariant=62){link=card}

### React error #130

![react_error_130](./images/errors/react_error_130.png)

错误原因：JSX 节点没正确引入，是个 `undefined`。

```js
// 这里TabPane最终是个undefined
const { TabPane } = Tabs.TabPane;

function demo() {
  return (
    <TabPane>
      demo text
    </TabPane>
  );
}
```

解决方法：正确引入，确保是个正确的 JSX 节点。

```js
const { TabPane } = Tabs;

function demo() {
  return (
    <TabPane>
      demo text
    </TabPane>
  );
}
```

[Error: Minified React error #130](https://legacy.reactjs.org/docs/error-decoder.html/?invariant=130&args%5B%5D=undefined&args%5B%5D=){link=card}

### React error #185

错误原因：写了死循环，导致栈溢出。

在 `render` 方法或 `componentWillUpdate`、`componentDidUpdate` 钩子中调用 `setState` 可能会出现该错误。

```jsx
class demo extends React.Component {
  state = {
    loading: true,
  };

  render() {
    const { loading } = this.state;
    this.setState({ loading: !loading });
    return (<div>2322</div>);
  }
}
```

解决方法：不要再 `render` 等方法里调用 `setState`。

## Git

### 根据远程分支创建本地分支报错

```bash
git checkout -b dev origin/dev
```

错误提示：
```bash

fatal: 'origin/dev' is not a commit and a branch 'dev' cannot be created from it
```
错误原因：远程没有 `dev` 这个分支。

解决方法：`git pull` 拉取最新远程代码，再执行创建分支命令。

### `fatal: Authentication failed for ''`

错误原因：git 账号改了密码，需要重新输入密码，但用户名或密码输错了。

解决方法：

1. 检查密码

先检查用户名和密码是否正确，本人就是用户名输错了。

2. git 命令

输入以下命令，删除本地 git 凭据，这样下次 git 就会要求输入用户名和密码。

```bash
git config --system --unset credential.helper
```

再输入以下命令，重新生成本地凭据文件，通常是 `~/.git-credentials`。

```bash
git config --global credential.helper store
```

最后再执行 `git pull` 命令，会提示输入账号密码。

3. 修改 Windows 用户凭据

入口：控制面板-用户账户-管理你的凭据-Windows凭据。

找到对应的 git 网站，编辑用户名和密码，保存即可。

![用户账户](./images/errors/user_account.png)

![管理凭据](./images/errors/manage_credentials.png)

![Windows凭据](./images/errors/windows_credentials.png)

### ssh 登录 GitHub 报错：Connection to xxx port 22: Software caused connection abort

修改 GitHub 的端口为 443。

```bash
# edit this file, if there not, create one
vim ~/.ssh/config

# add the content below to the file
# then it will use port 443 when ssh connect to github
Host github.com
Hostname ssh.github.com
Port 443

# test if it works
# if it works, it shows tip: Hi xxxxx! You've successfully authenticated, but GitHub does not provide shell access
ssh -T git@github.com
```

[ssh: connect to host github.com port 22: Connection refused](https://zhuanlan.zhihu.com/p/521340971){link=card}

## NPM

### npm ERR! code ELIFECYCLE

![npm_err_ELIFECYCLE](./images/errors/npm_err_ELIFECYCLE.png)

错误原因：`node_modules` 中下载的依赖包的版本，和 `package-lock.json` 中记录的版本发生冲突。

解决方法：清空缓存，删除 `node_modules` 和 `package-lock.json`，重新安装依赖包。

```bash
npm cache clean --force
# 强制删除 node_mudules 及其内容
rm -rf node_modules
rm package-lock.json
npm install
```

:::tip rm 命令
`rm` 命令是 Linux 中用于删除文件或目录的命令。有如下的参数。
- `-r` 递归删除目录及其内容。
- `-f` 强制删除文件，不给提示。
- `-i` 交互模式，在删除前给出提示。
- `-v` 显示删除的详细信息。
:::

### PostCSS plugin postcss-resolve-url requires PostCSS 8

![postcss](./images/errors/postcss.png)

错误原因：postcss 版本不对。

解决方法：重新安装对应版本。

```bash
npm install @postcss8.4.6 -D
```

### 安装依赖报错：npm WARN tar ENOENT: no such file or directory 

错误原因：依赖包有问题。

解决方法：删除 `package-lock.json`，重新安装依赖包。

```bash
rm package-lock.json
npm install
```

### eslint 编译报错 Cannot read property ‘range’ of null

具体看看文章，当时自己怎么解决的忘记了。

[彻底解决 Cannot read property ‘range‘ of null 错误的几个方案和后期造成的一劳永逸的方案](https://wanglaibin.blog.csdn.net/article/details/103904790){link=card}

[【解决方案】ESLINT 报错: Cannot read property 'range' of null](https://blog.csdn.net/u013243347/article/details/104426531){link=card}

## 小黑窗命令

### rm 删除命令报错

在 Windows cmd窗口运行 `rm -rf` 命令报错：`rm 不是内部或外部命令，也不是可运行的程序`。

错误原因：`rm -rf` 是 Linux 命令，在 Windows 中不支持。

解决方法：Windows 里使用 `rimraf` 命令。

### rimraf 命令报错

在 Windows cmd窗口运行 `rimraf` 命令报错：`rimraf 不是内部命令`

错误原因：`rimraf` 是 Node.js 包，在 Windows 中不支持。

解决方法：使用 `npm install -g rimraf` 命令全局安装，再输入命令。