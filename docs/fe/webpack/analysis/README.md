# Webpack 配置文件分析文档

## 📋 配置文件概览

本项目使用 **Taro 框架**的配置系统，主要配置文件包括：
- `config/index.js` - 主配置文件（478行）
- `config/extend.js` - 业务扩展配置（230行）
- `config/dev.js` - 开发环境配置
- `config/prod.js` - 生产环境配置

---

## 🏗️ 配置文件架构

```
config/
├── index.js      # 主配置（基础配置 + 优化策略）
├── extend.js     # 业务扩展配置（路由、别名、chunk拆分）
├── dev.js        # 开发环境覆盖配置
└── prod.js       # 生产环境覆盖配置
```

**配置合并顺序**：
```
基础配置 (index.js)
  → 环境配置 (dev.js/prod.js)
    → 扩展配置 (extend.js)
```

---

## 📦 核心功能模块

### 1. 外部依赖配置 (Externals)

**位置**: `config/index.js` 第 19-37 行

**作用**: 将大型依赖库从打包产物中排除，改为从 CDN 或全局变量加载

```javascript
// 线上环境使用 CDN，本地开发使用 npm 包
externals = {
  nervjs: '_nervGlobal',           // React 替代方案
  '@tarojs/taro': '_taroGlobal',   // Taro 核心
  '@mu/madp-fetch': '_fetchGlobal', // 网络请求库
  '@mu/zui': '_zuiGlobal',         // UI 组件库
  // ... 更多依赖
}
```

**控制开关**: `USE_LOCAL=true` 时禁用 externals，使用本地 npm 包

---

### 2. 代码分割策略 (SplitChunks)

**位置**: `config/index.js` 第 93-164 行

**策略**: 按优先级将代码拆分为多个 chunk，优化加载性能

#### Chunk 分组优先级（从低到高）

| 优先级 | Chunk 名称 | 匹配规则 | 用途 |
|--------|-----------|---------|------|
| 300 | `chunk-vendor` | 所有 node_modules | 通用第三方库 |
| 350 | `chunk-common` | 所有 node_modules | 公共依赖 |
| 360 | `chunk-common-temp` | `.temp` 文件 | 临时文件 |
| 500 | `chunk-mu` | `@mu/*` 包 | 企业内部库 |
| 550 | `chunk-components` | `@mu/(zui|lui)` | UI 组件库 |
| 600 | `chunk-madp` | `@mu/madp*` | 基础平台库 |
| 700 | `chunk-taro` | Taro 核心 + MobX + 加密库 | 框架核心 |
| 800 | `chunk-components-taro` | Taro 组件 | Taro 组件库 |

#### 扩展配置中的额外分组 (`extend.js`)

- `chunk-ldf` (510) - LDF/LDS 相关业务库
- `chunk-zui` (590) - ZUI 组件及相关工具
- `lazy_vconsole` (1000) - 调试工具（延迟加载）

**优化目标**:
- ✅ 减少初始加载体积
- ✅ 提高缓存命中率
- ✅ 支持按需加载

---

### 3. 路径别名 (Alias)

**位置**: `config/index.js` 第 240-253 行 + `extend.js` 第 10-30 行

**作用**: 简化导入路径，提高代码可读性

```javascript
// 基础别名
'@src'      → src/
'@api'      → src/api/
'@comp'     → src/components/
'@store'    → src/domain/stores/
'@models'   → src/domain/models/
'@services' → src/domain/services/

// 扩展别名 (extend.js)
'@global/*' → src/* (全局别名)
'@credit-card' → src/components/credit-card
'@layout'   → src/layout
```

---

### 4. 环境变量注入

**位置**: `config/index.js` 第 254-261 行

```javascript
env: {
  TRACK_MODULE_ID: '""',                    // 埋点模块ID
  BUILD_ENV: JSON.stringify(process.env.ENV), // 构建环境
  BUILD_TYPE: JSON.stringify(process.env.BT),  // 构建类型
  APP: JSON.stringify(getAPPType()),          // 应用类型
  USE_LOCAL: JSON.stringify(process.env.USE_LOCAL), // 是否使用本地依赖
  MODULE_VERSION: JSON.stringify(require('../package.json').version), // 版本号
}
```

**使用方式**: 在代码中通过 `process.env.BUILD_ENV` 访问

---

### 5. Babel 配置

**位置**: `config/index.js` 第 202-222 行

**关键配置**:
- **Presets**: `babel-preset-env` - 根据目标浏览器自动转换
- **Plugins**:
  - `transform-decorators-legacy` - 支持装饰器（MobX 需要）
  - `transform-class-properties` - 支持类属性
  - `transform-runtime` - 减少重复代码

**H5 特殊处理** (第 442-456 行):
- 添加 `@mu/babel-plugin-transform-madpapi` 插件
- 自动转换 MADP API 调用为 H5 兼容形式

---

### 6. H5 特定配置

**位置**: `config/index.js` 第 302-439 行

#### 6.1 输出配置
```javascript
output: {
  filename: 'js/[name].[hash:8].js',           // 主文件命名
  chunkFilename: 'js/[name].[contenthash:8].js', // chunk 命名
  sourceMapFilename: 'sourcemap/[file].map',   // SourceMap 位置
}
```

#### 6.2 图片处理
- **不转 base64**: `limit: 1` - 所有图片都作为文件输出
- **图片压缩**: 使用 `image-webpack-loader`（仅生产环境）

#### 6.3 Webpack 插件

| 插件 | 作用 | 配置位置 |
|------|------|---------|
| `ScriptExtHtmlWebpackPlugin` | 将 runtime.js 内联到 HTML | index.js:359 |
| `PreloadWebpackPlugin` | 预加载关键资源 | index.js:364, extend.js:176-190 |
| `vconsole-webpack-plugin` | 移动端调试工具 | index.js:371 |
| `HtmlWebpackPlugin` | HTML 模板处理 | extend.js:161 |
| `BundleAnalyzerPlugin` | 打包分析（需 `report` 参数） | index.js:431 |

#### 6.4 路由配置 (`extend.js` 第 78-83 行)
```javascript
customRoutes: {
  '/pages/index/index': '/index',  // Taro 路由 → H5 路由
  '/pages/bill/index': '/bill',
}
```

---

### 7. 小程序配置

**位置**: `config/index.js` 第 262-301 行

#### 7.1 编译包含列表
指定需要编译的 npm 包（小程序不支持直接使用 node_modules）

```javascript
compile: {
  include: [
    'taro-ui',
    '@mu/zui',
    '@tarojs/components',
    // ... 更多包
  ]
}
```

#### 7.2 PostCSS 配置
- **autoprefixer**: 自动添加浏览器前缀
- **pxtransform**: px 转 rpx（小程序单位）
- **url**: 资源路径处理（<10KB 转 base64）

---

### 8. 优化配置详解

#### 8.1 Runtime Chunk
```javascript
runtimeChunk: 'single'  // 将 webpack runtime 单独提取
```
**好处**: 修改业务代码时，runtime 文件不变，提高缓存效率

#### 8.2 Module IDs
```javascript
moduleIds: 'hashed'  // 使用 hash 作为模块 ID
```
**好处**: 避免模块顺序变化导致 ID 变化，保持缓存稳定

#### 8.3 代码压缩
- **TerserPlugin**: JS 压缩（生产环境）
- **CSSO**: CSS 压缩
- **HTML 压缩**: 通过 HtmlWebpackPlugin

---

## 🔧 工具函数

### `getAPPType()` (第 41-50 行)
从命令行参数获取应用类型：`app=mucfc npm run dev:h5`

### `getExtendConfig()` (第 55-64 行)
动态加载 `config/extend.js` 扩展配置

### `sassImporter()` (第 73-86 行)
自定义 Sass 导入解析器：
- `~package` → `node_modules/package`
- `@styles/xxx` → `src/styles/xxx`

---

## 🎯 配置执行流程

```
1. 读取基础配置 (index.js)
   ├── 设置 externals（根据 USE_LOCAL）
   ├── 配置优化策略 (splitChunks)
   ├── 设置别名和路径
   └── 配置 Babel/Sass/PostCSS

2. 合并环境配置 (dev.js/prod.js)
   ├── 设置 NODE_ENV
   ├── 配置开发服务器（dev）
   └── 配置生产构建（prod）

3. 应用扩展配置 (extend.js)
   ├── 添加业务别名
   ├── 配置路由映射
   ├── 扩展 chunk 分组
   └── 自定义 webpack 插件

4. 执行构建
   └── Taro CLI 处理配置并启动 webpack
```

---

## 📊 性能优化策略总结

### 1. **代码分割**
- 按库类型拆分 chunk
- 框架库单独打包（高优先级）
- 业务库按需加载

### 2. **缓存优化**
- 文件名使用 hash/contenthash
- runtime 单独提取
- 模块 ID 使用 hash

### 3. **资源优化**
- 图片压缩（生产环境）
- CSS 压缩
- JS 压缩（Terser）

### 4. **加载优化**
- 预加载关键资源（preload）
- 异步 chunk 按需加载
- 外部依赖使用 CDN

---

## 🚀 常用命令

```bash
# 开发环境（H5）
npm run dev:h5                    # 使用 CDN 依赖
npm run dev:h5-local              # 使用本地 npm 包

# 生产构建
npm run build:h5                  # 标准构建
npm run build:h5-report           # 构建 + 分析报告

# 指定环境
ENV=st1 npm run dev:h5            # 开发环境：st1
BT=offline npm run build:h5       # 构建类型：offline
```

---

## ⚠️ 注意事项

1. **Babel 6 兼容性**: 项目使用 Babel 6，不支持可选链 (`?.`) 和空值合并 (`??`)
2. **小程序编译**: 需要在 `compile.include` 中声明使用的 npm 包
3. **路径别名**: 使用 `@global/*` 时注意与 `@src/*` 的区别
4. **Chunk 优先级**: 修改 splitChunks 时注意优先级，避免冲突
5. **扩展配置**: `extend.js` 中的配置会覆盖基础配置，需谨慎修改

---

## 🔍 调试技巧

### 查看打包分析
```bash
npm run build:h5-report
# 会在浏览器打开 bundle 分析页面
```

### 查看实际配置
在 `webpackChain` 函数中添加 `console.log(chain.toString())` 查看最终配置

### 调试 SourceMap
生产环境使用 `hidden-source-map`，不会暴露到浏览器，但可用于错误追踪

---

## 📝 配置维护建议

1. **新增依赖**:
   - 如果是 `@mu/*` 包，会自动进入 `chunk-mu`
   - 如果是 Taro 相关，会自动进入 `chunk-taro`
   - 其他情况进入 `chunk-vendor`

2. **修改别名**:
   - 基础别名在 `index.js`
   - 业务别名在 `extend.js`

3. **调整 chunk 分组**:
   - 在 `extend.js` 的 `optimization.splitChunks.cacheGroups` 中添加

4. **添加环境变量**:
   - 在 `index.js` 的 `env` 对象中添加

---

## 📚 相关文档

- [Taro 配置文档](https://taro-docs.jd.com/docs/config)
- [Webpack SplitChunks](https://webpack.js.org/plugins/split-chunks-plugin/)
- [Babel 配置](https://babeljs.io/docs/en/configuration)

