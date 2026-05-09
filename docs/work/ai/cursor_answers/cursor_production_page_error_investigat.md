# Production page error investigation
_Exported on 2026/3/13 at GMT+8 16:19:21 from Cursor (2.6.19)_

---

**User**

https://m-zl.mucfc.com/3CMBAPP/muwa/taro_base1.js 我发现我们的生产页面出现这个报错，Cannot read properties of undefined (reading 'call')，错误文件是https://m-zl.mucfc.com/3CMBAPP/muwa/taro_base1.js:1:38320 

这是怎么回事？我现在看这压缩后的代码，完全不知道是哪里的代码出问题

---

**Cursor**

我来帮你分析这个生产环境的报错。`Cannot read properties of undefined (reading 'call')` 这个错误通常与 webpack 模块加载机制有关。让我先获取一下压缩后的代码，看看能否定位问题。

现在让我看看 webpack 的模块加载核心部分，以及报错位置 `1:38320` 附近更精确的代码。

这个位置是 `_pendingCallbacks.shift().call(this)` —— 这是 Nerv（Taro 1.x 使用的类 React 渲染引擎）的组件回调执行逻辑。但让我再确认一下，因为 `1:38320` 可能是列号。让我更仔细看看 webpack 的模块加载入口处的 `.call`。

现在我看到了关键信息。让我来查看项目的构建配置，了解 `taro_base1.js` 是怎么生成的。

现在情况清晰了。让我再看看 `index.html` 和构建配置中的关键细节。

现在我有了完整的理解。让我给你详细分析。

---

## 问题分析

### 报错含义

`Cannot read properties of undefined (reading 'call')` 发生在 `taro_base1.js:1:38320`，对应的代码是 webpack 模块加载器的核心代码：

```javascript
e[r].call(o.exports, o, o.exports, n)
```

这行是 webpack 的 `__webpack_require__` 函数，其中 `e` 是模块数组/对象，`r` 是模块 ID。当 `e[r]` 为 `undefined` 时，就会报 `Cannot read properties of undefined (reading 'call')`。

### 根本原因

`taro_base1.js` 是一个**外部 CDN 上的公共基础库包**（不是你项目构建产物），它通过 `externals` 机制将 `nervjs`、`react`、`@tarojs/taro` 等基础依赖打包在一起，暴露为 `_nervGlobal` 等全局变量。

这个错误的本质是：**webpack 在加载某个模块时，发现该模块 ID 在模块注册表中不存在（即 `e[r]` 为 `undefined`）**。

### 可能的具体原因（按概率排序）

**1. 模块版本不匹配（最常见）**

你的项目 `npm install` 后本地的 `nervjs`、`@tarojs/*` 等包的版本，与线上 `taro_base1.js` 中打包的版本不一致。当业务代码引用了某个基础库中不存在的子模块或导出时，webpack 找不到对应的模块 ID，就会报这个错。

例如：本地 `@tarojs/taro` 是 `1.3.45`，但 `taro_base1.js` 是基于 `1.3.40` 打包的，某个新增的内部模块在旧版本中不存在。

**2. Service Worker 缓存了旧版本的 `taro_base1.js`**

你的配置中有 Service Worker 缓存 muwa 脚本：

```javascript
urlPattern: /muwa\/.*\.js/
```

如果线上 `taro_base1.js` 已经更新，但用户浏览器的 SW 缓存了旧版本，就会导致新的业务代码去调用旧基础库中不存在的模块。

**3. 脚本加载顺序/时序问题**

`index.html` 中所有 muwa 脚本都使用了 `defer`：

```html
<script defer src="../muwa/taro_base1.js"></script>
<script defer src="../muwa/madp_base1.sc.js"></script>
```

`defer` 脚本按顺序执行，但如果 `taro_base1.js` 加载失败（网络问题、CDN 故障）导致全局变量 `_nervGlobal` 未注册，后续依赖它的脚本就会报错。

**4. CDN 缓存问题**

`taro_base1.js` 的 URL 没有带版本号或 hash，CDN 可能缓存了旧版本文件。

---

## 排查建议

1. **确认版本一致性**：联系 muwa 基础库的维护团队，确认当前线上 `taro_base1.js` 对应的 `nervjs` 和 `@tarojs/*` 版本，与你项目 `package-lock.json` 中的版本是否一致。

2. **本地复现**：用 `USE_LOCAL=true` 模式启动开发服务器，看是否能复现。如果本地不报错但线上报错，基本可以确认是版本不匹配。

3. **检查 SW 缓存**：在浏览器 DevTools → Application → Service Workers 中注销 SW，清除缓存后刷新页面，看是否还报错。

4. **查看完整调用栈**：在浏览器控制台中，展开错误的完整 stack trace，找到是哪个业务模块触发了这个模块加载，这样可以定位到具体是哪个 `import` 导致的问题。

5. **对比线上文件**：可以用 `curl` 下载 `taro_base1.js`，搜索其中注册的模块 ID 列表，与报错时缺失的模块 ID 对比。

你能提供一下完整的错误堆栈信息吗？这样我可以帮你更精确地定位到是哪个模块的引用出了问题。

---

**User**

它的堆栈是这样的：
TypeError: Cannot read properties of undefined (reading 'call')
at nt.clearCallBacks (https://m-zl.mucfc.com/3CMBAPP/muwa/taro_base1.js:1:38320)|
at Ke (https://m-zl.mucfc.com/3CMBAPP/muwa/taro_base1.js:1:37140)|
at tt (https://m-zl.mucfc.com/3CMBAPP/muwa/taro_base1.js:1:37536)

另外，报错的代码是这里吧，this._pendingCallbacks.shift().call(this)，你再检查下

---

**Cursor**

你说得对，让我重新仔细看一下那个位置的代码。

好的，现在完全确认了。让我把关键代码格式化出来，给你做详细分析。

---

## 确认报错位置

你说得对，报错确实是在 `this._pendingCallbacks.shift().call(this)` 这一行。这是 **Nervjs**（Taro 1.x 使用的类 React 渲染引擎）中 `Component` 基类的 `clearCallBacks` 方法。

把压缩代码还原后，关键代码如下：

```javascript
// nt 就是 Nerv 的 Component 基类
nt.prototype.setState = function(state, callback) {
  state && this._pendingStates.push(state);
  if (isFunction(callback)) {
    this._pendingCallbacks.push(callback);
  }
  if (!this._disable) {
    et(this); // 触发更新调度
  }
};

nt.prototype.clearCallBacks = function() {
  for (
    var e = this._pendingCallbacks.length;
    this._dirty ? this._pendingCallbacks.length : e;
  ) {
    // ⚠️ 报错在这里！
    this._pendingCallbacks.shift().call(this);
    e--;
  }
};
```

## 调用链

从堆栈可以看到完整的调用链：

```
tt (更新调度器，遍历脏组件队列)
  → Ke (执行单个组件的更新渲染)
    → clearCallBacks (执行 setState 的回调)
```

`Ke` 函数的末尾调用了 `e.clearCallBacks()`，也就是组件渲染完成后，执行 `setState(state, callback)` 中传入的 `callback`。

## 报错原因

`this._pendingCallbacks.shift()` 取出的值是 `undefined`，然后对 `undefined` 调用 `.call(this)` 就报错了。

这说明 **你的业务代码中某个组件调用 `setState` 时，传入的 `callback` 参数不是一个函数**。例如：

```typescript
// ❌ 这样会导致报错
this.setState({ foo: 'bar' }, undefined);
this.setState({ foo: 'bar' }, null);
this.setState({ foo: 'bar' }, someVariable); // someVariable 恰好是 undefined
```

注意看 `setState` 的代码：`h(t)` 即 `isFunction(callback)`，正常情况下非函数值会被过滤掉，不会被 push 进 `_pendingCallbacks`。但有一种边界情况：**如果 `callback` 是一个在运行时变成 `undefined` 的变量，且 `isFunction` 检查被绕过**（比如通过 `forceUpdate` 直接 push）。

不过更可能的情况是：**`clearCallBacks` 中的循环条件有 bug**。看这个循环：

```javascript
for (var e = length; this._dirty ? this._pendingCallbacks.length : e; ) {
  this._pendingCallbacks.shift().call(this);
  e--;
}
```

当 `this._dirty` 为 `true` 时，循环条件是 `this._pendingCallbacks.length`，会持续执行直到数组为空。但如果在某个 callback 执行过程中又触发了新的 `setState`，导致 `_pendingCallbacks` 被清空或状态异常，就可能出现 `shift()` 返回 `undefined` 的情况。

## 排查建议

这个问题出在**你的业务组件的 `setState` 回调**中。建议这样排查：

1. **全局搜索项目中所有 `setState` 带第二个参数的调用**：

找到了！就是这里。让我看看 `opt.onConfirm` 和 `opt.onCancel` 的来源。

找到根本原因了！问题就在 `alert.tsx` 的第 113 行和第 119 行。

## 根本原因

问题出在 `alert.tsx` 的 `initAlert` 方法中，第 113 行和第 119 行：

```113:113:src/layout/main/components/login-plugin/alert.tsx
          () => this.setState({ isShow: false }, opt.onConfirm),
```

```119:119:src/layout/main/components/login-plugin/alert.tsx
          () => this.setState({ isShow: false }, opt.onCancel),
```

`setState` 的第二个参数要求是一个**函数**。但 `opt.onConfirm` / `opt.onCancel` **不一定是函数**。

看 `showAlert` 方法的第三个分支（第 73-91 行），当外部调用者传入的 `options` 对象没有 `onConfirm` 或 `onCancel`，也没有 `success` 回调时：

```81:85:src/layout/main/components/login-plugin/alert.tsx
        onCancel: options.onCancel || (options.success && (() => options.success({ cancel: true }))) || (() => {
          // 空函数，作为默认回调
        }),
        onConfirm: options.onConfirm || (options.success && (() => options.success({ confirm: true }))) || (() => {
          // 空函数，作为默认回调
        }),
```

这里有兜底的空函数，看起来没问题。**但是**，如果调用者显式传了 `onConfirm: undefined` 或 `onConfirm: null`，由于 JavaScript 的 `||` 运算符，`undefined || false || (() => {})` 确实会走到空函数。

然而真正的问题在 `initAlert` 中：

```110:114:src/layout/main/components/login-plugin/alert.tsx
      onConfirm: async () => {
        this.setState(
          { isOpened: false },
          () => this.setState({ isShow: false }, opt.onConfirm),
        );
      },
```

这里 `opt.onConfirm` 是一个 `async` 函数（第 110 行定义的）。当这个 `async` 函数被执行时，`this.setState({ isOpened: false }, callback)` 的 callback 里又调用了 `this.setState({ isShow: false }, opt.onConfirm)`。

**关键问题**：Nervjs 的 `setState` 源码中，`isFunction(callback)` 检查通过后会把 callback push 进 `_pendingCallbacks`。但 `opt.onConfirm` 本身就是这个 `async () => { this.setState(...) }` 函数——它在执行时会**再次触发 setState**，导致在 `clearCallBacks` 循环执行过程中，`_pendingCallbacks` 数组被并发修改，循环条件 `this._dirty ? this._pendingCallbacks.length : e` 在 `_dirty` 状态切换时出现不一致，最终 `shift()` 返回了 `undefined`。

简单来说：**`setState` 的 callback 中嵌套调用 `setState`，且外层是 `async` 函数，导致了 Nervjs 内部的 `_pendingCallbacks` 队列在清理过程中被并发修改，产生了竞态条件。**

## 修复方案

把嵌套的 `setState` 回调改为顺序执行，避免在 `clearCallBacks` 循环中再次修改 `_pendingCallbacks`：

让我确认一下修改后的完整代码：

修复完成。总结一下问题和修复：

---

## 问题总结

**报错位置**：Nervjs 的 `Component.clearCallBacks()` 方法中的 `this._pendingCallbacks.shift().call(this)`

**根因**：`alert.tsx` 的 `initAlert` 方法中，`onConfirm` 和 `onCancel` 使用了 **`async` 函数 + 嵌套双层 `setState` 回调** 的写法：

```javascript
// 原来的写法：3 层嵌套 setState
async () => {
  this.setState({ isOpened: false },          // 第 1 层
    () => this.setState({ isShow: false },    // 第 2 层（在 clearCallBacks 循环中触发）
      opt.onConfirm                           // 第 3 层
    )
  );
}
```

在 `clearCallBacks` 的 `for` 循环执行 callback 的过程中，callback 内部又调用了 `setState`，导致 `_pendingCallbacks` 数组被并发修改，加上 `_dirty` 状态在循环中变化，使得循环条件判断异常，`shift()` 从已空的数组中取值返回 `undefined`，最终触发 `.call(this)` 报错。

## 修复内容

1. **去掉 `async`**：`onConfirm`/`onCancel` 不需要是 async 函数
2. **合并 setState**：将 `isOpened: false` 和 `isShow: false` 合并到一次 `setState` 调用中，避免嵌套
3. **增加类型检查**：在回调中用 `typeof opt.onConfirm === 'function'` 做防御性检查，避免非函数值被传入

---

**User**

现在在测试环境不知道怎么复现这个错误，帮我看看怎么复现。这个应该是反欺诈弹窗的内容renderAntiFraudDialog

---

**Cursor**

让我先看看 `dialog-manage` 和相关的反欺诈弹窗代码。

现在完整的调用链清楚了。让我梳理一下完整的触发路径和复现方法。

---

## 完整调用链分析

反欺诈弹窗的触发路径是：

```
DialogManage.render()
  → showFlag === '3' → renderAntiFraudDialog()
    → openAntiFraudDialog()
      → LoginPlugin.handlerRiskTip(ref, onClose)
        → ref.showModal({ onClose, success: resolve, ... })
          → LoginPluginUI.showModal(opts)
            → Alert.showAlert(opts)
```

在 `Alert.showAlert` 中，传入的 `options` 对象是：

```javascript
{
  showCancel: false,
  mainImage: '...',
  confirmText: '我知道了',
  confirmColor: '#3477ff',
  onClose: () => this.callBackFn0('4'),  // ← 有 onClose
  success: resolve,
  type: 'text',
  tips: '招联全力保护您的信息安全',
}
```

注意这里传的是 `onClose` 而不是 `onConfirm`。进入 `showAlert` 的第二个分支（第 57 行）：

```57:70:src/layout/main/components/login-plugin/alert.tsx
    } else if (options.onClose && typeof (options.onClose) === 'function') {
      opt = {
        title: options.title,
        type: options.type,
        content: options.content,
        mainImage: options.mainImage,
        confirmText: options.confirmText,
        onCancel: () => {
          // 空函数，作为默认回调
        },
        onConfirm: options.onClose,
        beaconId: options.beaconId,
        beaconContent: options.beaconContent,
      };
```

这个分支里 `opt.onConfirm = options.onClose`（是函数，没问题），`opt.onCancel` 是空函数。然后进入 `initAlert(opt)`，走到修改前的代码：

```javascript
onConfirm: async () => {
  this.setState(
    { isOpened: false },
    () => this.setState({ isShow: false }, opt.onConfirm),  // opt.onConfirm 是函数
  );
},
```

所以 `opt.onConfirm` 确实是函数，问题不在于它是 `undefined`。**报错的根因确实是嵌套 `setState` 回调在 Nervjs 的 `clearCallBacks` 循环中引发竞态**——在 callback 执行过程中又 push 了新的 callback，导致数组状态异常。

## 复现方法

要在测试环境复现，你需要模拟反欺诈弹窗的触发条件。根据代码逻辑：

### 前置条件

1. **用户已登录**（`userStore.loginSuccess === true`）
2. **弹窗流程走到 `showFlag === '3'`**（前面的弹窗 0/1/2 都已完成回调）
3. **localStorage 中存在 `antiFraud_dialogShow` 数据**，且满足：
   - `riskTip === 'RCSFB110'`
   - `setTime` 在 2 天以内

### 具体复现步骤

**第一步**：在浏览器控制台手动写入 localStorage 数据：

```javascript
localStorage.setItem('antiFraud_dialogShow', JSON.stringify({
  riskTip: 'RCSFB110',
  setTime: Date.now()
}));
```

**第二步**：刷新首页，等待弹窗队列依次执行到 `showFlag === '3'`。

**第三步**：反欺诈弹窗弹出后，点击「我知道了」按钮触发 `onConfirm`，此时就会走到嵌套 `setState` 的逻辑，有概率触发报错。

> 注意：这个 bug 是**竞态条件**，不一定每次都能复现。Nervjs 的 `clearCallBacks` 循环在 `_dirty` 为 `true` 时使用 `_pendingCallbacks.length` 作为循环条件，嵌套 `setState` 在循环中修改了数组，只有在特定时序下才会出问题。如果想提高复现概率，可以在 callback 中加一些同步耗时操作，或者用 Chrome DevTools 的 Performance 面板降低 CPU 速度（4x/6x slowdown）。

### 如果前面的弹窗拦住了

如果测试环境中 `showFlag` 一直停在 `'0'`/`'1'`/`'2'`，可以直接在控制台强制跳到 `'3'`。找到 `DialogManageStore` 的实例，或者在 React DevTools 中找到对应组件，手动调用：

```javascript
// 在控制台中，先设置 localStorage
localStorage.setItem('antiFraud_dialogShow', JSON.stringify({
  riskTip: 'RCSFB110',
  setTime: Date.now()
}));

// 然后通过 MobX 的全局 store 直接设置 showFlag
// 具体路径取决于你的 store 暴露方式，可能类似：
__mobx_store__.dialogManageStore.setShowFlag('3');
```

不过，既然我们已经从代码层面定位了根因并修复了，其实不需要一定复现。你可以直接部署修复后的代码到测试环境，然后按上述步骤验证**修复后不再报错**即可。

---

**User**

你太厉害了！真的是这个问题！反欺诈弹窗复现出这个报错了，然后按照你的修改之后，就没有这个报错了

---

**Cursor**

太好了，能帮你定位并修复这个问题我很高兴！

回顾一下，这个 bug 的本质是 Nervjs 的 `clearCallBacks` 循环中，嵌套 `setState` 回调导致 `_pendingCallbacks` 数组被并发修改引发的竞态条件。这类问题在压缩后的代码里确实很难排查，关键线索就是堆栈中的 `clearCallBacks` → `shift().call(this)` 指向了 `setState` 回调机制。

修复的核心思路也很简单：
1. **合并 `setState`**——把两次嵌套的状态更新合并为一次，消除了竞态的根源
2. **加了 `typeof` 防御检查**——避免非函数值意外进入回调队列
3. **去掉不必要的 `async`**——这里没有 `await`，`async` 只会增加不确定性

如果需要提交，随时告诉我。

---

**User**

请梳理总结一下这个问题，说明问题、根本原因、解决方案，并且附上对应的代码。
输出一个markdown的总结文档。

---

**Cursor**

文档已输出到 `docs/bugfix-clearCallBacks-crash.md`，涵盖了问题描述、完整调用链、根因分析（含 Nervjs 源码级解释）、修改前后的代码对比，以及经验总结。你可以直接用于提交记录或团队分享。

