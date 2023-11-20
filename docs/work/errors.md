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

[React踩坑记录：Error: Minified React error #31](https://blog.csdn.net/weixin_40920953/article/details/126049965){link=card}

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