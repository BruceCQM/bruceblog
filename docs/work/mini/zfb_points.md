# 支付宝小程序错误

## react-loadable 编译报错

报错：

```js
错误 组件编译 组件src/xxx/index.tsx编译失败！
SyntaxError: /xxx/index.tsx: Unexpected token

import Loadable from 'react-loadable';
const Component = Loadable({
  loader: () => import(/* webpackChunkName: "lazy_component" */'./component'),
  loading,
})
```

支付宝小程序不能使用 react-loadable 来进行组件的动态加载，这是 h5 的写法。

支付宝小程序不能动态加载，就只能直接 import 组件使用。

## CE100.03: 文件xxx被定义为component类型，不允许被其他文件import导入

### 一、问题现象

支付宝小程序开发者工具在编译过程中，出现如下报错：

```bash
error [CE1000.03] : unknown

文件（./asyncbag/components/npm/my-component/dist/weapp/code/index.js） 被定义为 component 类型，不允许被其他文件 import 导入：

./asyncbag/components/npm/my-component/dist/weapp/index.js
```

### 二、背景概念

#### 1. Barrel 文件（桶文件）

Barrel 文件是一种专门用于集中 re-export 的 `index.ts/tsx`，把同一目录下多个模块汇聚到一个入口，方便外部统一导入。

本项目中 `src/components/index.tsx` 就是一个 barrel 文件：

```typescript
export { default as MyComponent } from './my-component';
export { default as MyComponent2 } from './my-component2';
// ...
```

#### 2. 支付宝小程序 component 类型

Taro 编译时，凡是继承了 `Taro.Component` 的类，都会生成带 `"component": true` 的 JSON 文件，该 JS 文件即被标记为 **component 类型**。

支付宝小程序的规则：**component 类型的文件不能被普通 JS 文件用 `require/import` 引入，只能通过 `usingComponents` 注册使用。**

### 三、根本原因

#### Barrel 文件代码

feature 分支在 `src/components/index.tsx`（barrel 文件）中新增了一行：

```typescript
export { default as BaseComponent } from './base';  // ← 新增
```

同时，外部 wrapper 组件从 barrel 文件导入 `BaseComponent` 用于继承：

```typescript
import { BaseComponent, MyComponent } from '../../../../../components'; // ← 经过 barrel
```

#### 非法依赖链的形成

上述写法形成了如下依赖链：

```
wrapper（component 类型）
    ↓ import（经过 barrel）
components/index.js（barrel，普通 JS 文件）
    ↓ require
my-component/index.js（component 类型）  ← 违规！
my-component2/index.js（component 类型）   ← 违规！
```

支付宝编译器检测到：**一个 component 类型文件（wrapper）继承的组件依赖了 barrel，而 barrel 又用普通 `require` 引用了其他 component 类型文件**，判定为非法，触发 `CE1000.03`。

### 四、修复方案

#### 修改 1：从 barrel 文件移除 BaseComponent 导出

```typescript
// src/components/index.tsx
// 删除这一行：
export { default as BaseComponent } from './base';
```

#### 修改 2：所有从 barrel 导入 BaseComponent 的文件改为直接路径导入

涉及两种情况：

**情况一：只导入 BaseComponent**

```typescript
// 修改前
import { BaseComponent } from '../../../../../components/index';

// 修改后
import BaseComponent from '../../../../../components/base';
```

**情况二：同时导入 BaseComponent 和其他 UI 组件**

```typescript
// 修改前
import { BaseComponent, MyComponent } from '../../../../../components';

// 修改后
import BaseComponent from '../../../../../components/base';
import { MyComponent } from '../../../../../components';
```


### 五、修复后依赖链

```
wrapper（component 类型）
    ↓ import（直接路径，不经过 barrel）
components/base/index.js（component 类型）  ✓ component 引用 component，合法

wrapper（component 类型）
    ↓ import（使用关系，走 usingComponents）
components/index.js（barrel）
    ↓ require
my-component/index.js（component 类型）  ✓ 使用关系，合法
```

**继承关系走直接路径**，使用关系走 barrel，两条链路各自独立，编译器不再报错。

### 六、编码规范（避免再次踩坑）

> **凡是要用 `extends` 继承的基类，必须直接从基类文件导入，不能经过 barrel 文件。**

| 场景 | 正确写法 | 错误写法 |
|------|----------|----------|
| 继承基类 | `import BaseComponent from '../components/base'` | `import { BaseComponent } from '../components'` |
| 使用 UI 组件 | `import { MyComponent } from '../components'` | 无限制 |

基类（抽象类、无 `render` 的父类）不应放入 barrel 文件导出，只允许通过直接路径引用。

```js
// components/base 基类组件
export default class BaseComponent extends Taro.Component {}

// 其它组件导入，继承基类组件（正确写法）
// 通过直接路径引用，不能通过 barrel 文件导入
import BaseComponent from '../../../../../components/base'; 
class UserEducation extends BaseComponent {}
```

## 真机预览，分包加签失败

支付宝开发者工具，点击真机预览，出现如下报错：

```
{"traceId":"xxxx","errorCode":"CREATE_DEBUG_VERSION_ERROR","msg":"真机预览失败 分包加签失败","type":"netBiz","stat":"failed","error":"真机预览失败 分包加签失败"}
```

这个问题是由于某个文件编译之后路径过长导致的。

高版本的开发者工具看不到具体是哪个文件路径过长，需要安装低版本开发者工具（例如[2.9.1版本](https://opendocs.alipay.com/mini/ide/stable_log?pathHash=e4b6a05a)）查看。

具体报错如下：

```
{"code": "AB0311010110215", "msg": "Request URL: https://openhome.alipay.com/platform/generateMiniDebugForMulti.jso

n\n生成调试版失败，原因真机预览失败 file name &#39:xxxxxxxxxx/xxxx/xxxx.png&#39; is too long ( &gt; 100 bytes)"}

直机预览失败 file name

生成调试版失败，原因真机预览失败 file name &#39;xxxxxxxxxx/xxxx/xxxx.png&#39; is too long ( &gt; 100 bytes)
```

解决方案：

1. 将图片转换为在线链接。
2. 把图片放到外层目录，从而缩短路径的长度。

## 支付宝小程序系统加载异常报错页面

![支付宝小程序系统加载异常报错页面](../images/mini/alipay_mini_error.png)

报错原因：支付宝小程序编译后标签嵌套层级过深。

解决方法：把内部的 MYView 标签修改为 Taro 原生的 View 标签。MYView 标签是在 View 标签基础上做了包裹的，导致层级变深。

支付宝小程序底层使用的是类似 WebView 的渲染引擎，对 DOM 树的嵌套深度有限制。当组件编译后生成的标签层级超过这个限制时，就会触发渲染异常，直接显示系统错误页面，而不是正常的页面内容。

常见触发场景：

- UI 组件库嵌套过深 ：比如多层 view 嵌套，或者组件库内部本身就生成了很深的 DOM 结构。
- 列表渲染嵌套 ： a:for / a:if 多层嵌套组合使用。
- 复杂的表单或弹窗组件 ：内部包含多层容器包裹。

解决思路：

1. 减少不必要的嵌套 ：审查模板结构，去掉多余的 view 包裹层
2. 拆分组件 ：将深层嵌套的结构拆分为多个子组件，每个子组件独立渲染，降低单棵 DOM 树的深度
3. 使用虚拟列表 ：如果是因为长列表渲染导致的，可以使用支付宝小程序的 a:list 或虚拟列表方案
4. 简化组件库使用 ：检查是否使用了过于复杂的组合组件，尝试用更轻量的方式实现
