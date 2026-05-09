# AI 相关

## cursor rules

[Cursor Rules 详细教程，花5分钟写规则，让Cursor不再瞎改代码，AI编程必备](https://zhuanlan.zhihu.com/p/1906795650714146104){link=static}

[Awesome CursorRules - 收集和整理了各种优质的 CursorRules](https://juejin.cn/post/7480350360964448293){link=static}

cursor/rules 文件以 `.mdc` 结尾。内容示例：

```md
---
alwaysApply: true
---

# 代码质量规范

## 注释规范

### JSDoc 注释要求
- **必须**: 所有公共接口都要有 JSDoc 注释
- **必须**: 复杂业务逻辑要有详细说明
- **必须**: 注释要说明"为什么"而不只是"是什么"
- **必须**: 不能删除已有代码的注释

### 注释示例

/**
 * 计算用户的信用评分
 * 
 * 基于用户的收入、职业、学历等因素计算信用评分。
 * 评分范围：0-1000，分数越高信用越好。
 * 
 * @param userInfo 用户基本信息
 * @param incomeInfo 收入信息
 * @returns 信用评分，范围0-1000
 * @throws {Error} 当必要信息缺失时抛出错误
 */
function calculateCreditScore(userInfo: UserInfo, incomeInfo: IncomeInfo): number {
  // 业务逻辑实现
}

## 命名规范

### 文件命名
- **文件**: kebab-case (apply-store.ts)
- **目录**: kebab-case (user-management)

### 代码命名
- **类**: PascalCase (ApplyStore)
- **函数/变量**: camelCase (updatePersonalInfo)
- **常量**: UPPER_SNAKE_CASE (MOCK_CONFIG)
- **接口**: PascalCase (UserInfo)
- **枚举**: PascalCase (UserStatus)

## 代码组织

### 文件组织原则
- **必须**: 一个文件一个主要的导出
- **必须**: 相关功能放在同一目录

### 导入导出规范
- 使用具名导出而不是默认导出
- 按照依赖层级组织导入
- 使用路径别名简化导入路径

## 代码审查要点

### 审查清单
1. 类型安全性 - 是否有any类型，类型定义是否完整
2. DDD 边界清晰 - 是否违反架构边界
3. MobX 使用正确 - 装饰器使用是否规范
4. 多端兼容性 - 是否考虑了平台差异
5. 性能影响 - 是否有性能问题

### 代码规范检查
- ESLint 配置检查
- TypeScript 编译检查
- 代码重复度检查# 代码质量规范
```

```md
---
description: CSS 和样式规范
globs: *.css, *.scss, *.less, *.styled.ts
alwaysApply: false
---

# CSS 和样式规范

## 样式架构原则
- **组件化样式**：每个组件的样式应该封装在组件内部
- **样式隔离**：避免全局样式污染，选择器命名使用BEM规范
- **主题一致性**：使用设计系统和主题变量保持视觉一致性
- **响应式设计**：优先考虑移动端，采用移动优先的响应式设计
- **性能优化**：避免不必要的样式重绘和重排
```