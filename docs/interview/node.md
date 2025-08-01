# Node.js

## `path.join`

`path.join` 是简单拼接路径片段，给什么就直接拼起来，不做特殊处理。

```js
const path = require('path');

path.join('/foo', 'bar', 'baz'); // '/foo/bar/baz'
path.join('/foo', 'bar', 'baz/..'); // '/foo/bar'
path.join('foo', 'bar', 'baz'); // 'foo/bar/baz' (相对路径)
```

`path.join` 对 `.` 和 `..` 相对路径的处理：

- `.` 表示的是当前目录，因此会忽略不管。

- `..` 表示的是往上一层目录，因此会把上一层的目录吞掉（被抵消了）。

```js
path.join('/foo', './bar', './baz'); // 输出: '/foo/bar/baz' (中间的 ./ 被忽略)

path.join('/foo/bar', '../baz'); // 输出: '/foo/baz' (bar 被 .. 抵消了)

path.join('/foo/bar/baz', '../../qux'); // 输出: '/foo/qux' (向上回溯两级)

path.join('/foo', './bar', '../baz', 'qux/..', 'quux');
// 处理步骤:
// 1. /foo + ./bar → /foo/bar (.被忽略)
// 2. /foo/bar + ../baz → /foo/baz (bar被..抵消)
// 3. /foo/baz + qux/.. → /foo/baz (qux被..抵消)
// 4. /foo/baz + quux → /foo/baz/quux
// 最终输出: '/foo/baz/quux'
```

边界情况的结果：

```js
path.join('foo', '../../bar'); // 输出: '../bar'，一个 .. 被抵消了

path.join('/foo', '../../bar'); // 输出: '/bar' (在绝对路径中会正确计算)

path.join('..', 'foo', 'bar'); // 输出: '../foo/bar'
```

## `path.resolve`