# Bug 修复：taro_base1.js Cannot read properties of undefined (reading 'call')

## 问题描述

生产环境首页出现 JS 报错，导致页面异常：

```
TypeError: Cannot read properties of undefined (reading 'call')
```

**报错文件**：`https://example.com/taro_base1.js:1:38320`

**错误堆栈**：

```
TypeError: Cannot read properties of undefined (reading 'call')
  at nt.clearCallBacks (taro_base1.js:1:38320)
  at Ke (taro_base1.js:1:37140)
  at tt (taro_base1.js:1:37536)
```

**复现场景**：用户已登录 → 弹窗队列执行到欺骗弹窗→ localStorage 中存在 `cheatDialogShow` 且 `type === 'HELLO119'` → 弹窗弹出后点击「我知道了」按钮 → 触发报错。

## 根本原因

### 报错位置

`taro_base1.js` 是 Nervjs（Taro 1.x 的类 React 渲染引擎）的打包产物。报错位置还原后对应 Nervjs `Component` 基类的 `clearCallBacks` 方法：

```javascript
// Nervjs Component 基类
nt.prototype.clearCallBacks = function() {
  for (
    var e = this._pendingCallbacks.length;
    this._dirty ? this._pendingCallbacks.length : e;
  ) {
    this._pendingCallbacks.shift().call(this); // ← 报错在这里
    e--;
  }
};
```

当 `this._pendingCallbacks.shift()` 返回 `undefined` 时，对其调用 `.call(this)` 就会抛出 `Cannot read properties of undefined (reading 'call')`。

### 业务代码触发路径

```
DialogManage (showFlag === '3')
  → renderAntiFraudDialog()
    → openAntiFraudDialog()
      → LoginPlugin.handlerRiskTip(ref, onClose)
        → ref.showModal({ onClose, success, ... })
          → Alert.showAlert(options)
            → Alert.initAlert(opt)
              → 用户点击确认 → onConfirm() → 嵌套 setState 触发 bug
```

### 直接原因：嵌套 setState 回调引发竞态条件

`alert.tsx` 的 `initAlert` 方法中，`onConfirm` 和 `onCancel` 使用了 **async 函数 + 双层嵌套 setState 回调** 的写法：

```typescript
// ❌ 修改前：3 层嵌套 setState
onConfirm: async () => {
  this.setState(
    { isOpened: false },                                    // 第 1 层 setState
    () => this.setState({ isShow: false }, opt.onConfirm),  // 第 2 层 setState（在 clearCallBacks 循环中触发）
  );
},
```

**问题机制**：

1. 用户点击确认按钮，触发 `onConfirm`
2. 第 1 层 `setState({ isOpened: false }, callback)` 将 `callback` 推入 `_pendingCallbacks` 队列
3. Nervjs 执行组件更新（`Ke` 函数），更新完成后调用 `clearCallBacks()` 遍历执行队列中的回调
4. `clearCallBacks` 的 `for` 循环中，`shift()` 取出 callback 并执行
5. callback 内部又调用了第 2 层 `setState({ isShow: false }, opt.onConfirm)`，这会**在循环执行过程中再次向 `_pendingCallbacks` 数组推入新元素**，并触发新的组件更新
6. 由于 `_dirty` 状态在循环中发生变化，循环条件 `this._dirty ? this._pendingCallbacks.length : e` 的判断出现不一致
7. 最终 `shift()` 从已被清空的数组中取值，返回 `undefined`，触发 `.call(this)` 报错

简言之：**`setState` 回调中嵌套调用 `setState`，导致 Nervjs 内部的 `_pendingCallbacks` 队列在清理过程中被并发修改，产生了竞态条件。**

## 解决方案

### 修改文件

`example.tsx` — `initCheat` 方法

### 修改前

```typescript
onConfirm: async () => {
  this.setState(
    { isOpened: false },
    () => this.setState({ isShow: false }, opt.onConfirm),
  );
},
onCancel: async () => {
  this.setState(
    { isOpened: false },
    () => this.setState({ isShow: false }, opt.onCancel),
  );
},
```

### 修改后

```typescript
onConfirm: () => {
  this.setState({ isOpened: false, isShow: false }, () => {
    if (typeof opt.onConfirm === 'function') {
      opt.onConfirm();
    }
  });
},
onCancel: () => {
  this.setState({ isOpened: false, isShow: false }, () => {
    if (typeof opt.onCancel === 'function') {
      opt.onCancel();
    }
  });
},
```

### 修改要点

| 修改点 | 说明 |
|--------|------|
| 合并 `setState` | 将 `{ isOpened: false }` 和 `{ isShow: false }` 合并为一次 `setState` 调用，消除嵌套，从根源上避免在 `clearCallBacks` 循环中再次修改 `_pendingCallbacks` |
| 去掉 `async` | 原函数体内没有 `await`，`async` 标记不必要，且会将函数返回值包装为 Promise，增加不确定性 |
| 增加 `typeof` 防御检查 | 在执行 `opt.onConfirm` / `opt.onCancel` 前检查其是否为函数，防止非函数值意外被调用 |

## 经验总结

1. **避免在 `setState` 回调中嵌套 `setState`**：这是 Nervjs（以及早期 React）中容易引发竞态的反模式。如果需要同时更新多个状态，应合并为一次 `setState` 调用。
2. **生产环境压缩代码的排查思路**：通过错误堆栈中的字符偏移量（如 `1:38320`）定位到压缩代码的具体位置，再结合框架源码还原逻辑，是排查此类问题的有效方法。
3. **竞态条件难以稳定复现**：此类 bug 依赖特定的执行时序，在开发环境中不一定能触发，但在生产环境的特定机型/性能条件下会暴露。
