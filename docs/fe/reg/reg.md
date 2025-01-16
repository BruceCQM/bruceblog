# 正则表达式

## `$&` 追加内容

```js
const replaceUrl = (url) => {
  const reg = new RegExp('test=router&.*putId=one.*', 'g');
  const res = url.replace(reg, `$&&myId=two`);
}

// 输出：http://www.test.com?test=router&putId=one&myId=two
replaceUrl('http://www.test.com?test=router&putId=one');
```

`$&` 是一个特殊的替换模式符号，表示正则表达式匹配到的内容，它的目的是保留原始的匹配部分。

`$&&myId=two` 标识在匹配到的内容后面追加查询参数 `&myId=two`。如果不使用 `$&`，那么替换操作会覆盖掉匹配的内容，而不是在其基础上进行扩展。