# 支付宝小程序编译运行错误

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

