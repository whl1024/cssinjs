# cssinjs

[![npm version](https://img.shields.io/npm/v/@whl1024/cssinjs.svg)](https://www.npmjs.com/package/@whl1024/cssinjs)
[![npm downloads](https://img.shields.io/npm/dm/@whl1024/cssinjs.svg)](https://www.npmjs.com/package/@whl1024/cssinjs)
[![license](https://img.shields.io/npm/l/@whl1024/cssinjs.svg)](https://github.com/whl1024/cssinjs/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

一个轻量级、高性能的CSS-in-JS库，专为现代前端开发设计。具有零运行时开销、完整的TypeScript支持、样式缓存优化等特性。

> 📦 **[在 NPM 上查看](https://www.npmjs.com/package/@whl1024/cssinjs)**

## ✨ 特性

- 🔧 **完整的TypeScript支持** - 提供完整的类型定义和智能提示
- 🎨 **丰富的CSS特性** - 支持嵌套选择器、伪类、媒体查询、关键帧动画
- 🌈 **主题友好** - 框架层主题支持，完全由使用者控制
- 📱 **响应式设计** - 内置媒体查询支持
- 🔌 **框架无关** - 可以与Vue、React、Angular等任意框架集成
- 🛠 **开发友好** - 开发模式提供详细的调试信息
- 🧰 **实用工具** - 内置样式合并、类名组合、条件样式等实用工具

## 📦 安装

```bash
npm install @whl1024/cssinjs
# 或
yarn add @whl1024/cssinjs
# 或
pnpm add @whl1024/cssinjs
```

## 🚀 快速开始

```typescript
import { css, keyframes, mergeStyles, composeClasses } from '@whl1024/cssinjs'

// 创建样式
const buttonStyle = css({
  backgroundColor: '#007bff',
  color: 'white',
  padding: 16,
  borderRadius: 4,
  border: 'none',
  cursor: 'pointer',
  
  '&:hover': {
    backgroundColor: '#0056b3'
  }
})

const className = buttonStyle() // 返回生成的类名

// 新功能：样式合并
const mergedStyle = css(mergeStyles(
  { padding: 16, border: 'none' },
  { backgroundColor: 'blue', color: 'white' }
))

// 新功能：类名组合
const base = css({ padding: 16 })
const primary = css({ backgroundColor: 'blue' })
const combined = composeClasses(base, primary)()
```

## 📚 文档

- [入门指南](./docs/getting-started.md) - 基础使用方法和概念
- [API 参考](./docs/api-reference.md) - 完整的API文档
- [高级功能](./docs/advanced-features.md) - 高级功能和用法
- [配置选项](./docs/configuration.md) - 配置和工具函数
- [框架集成](./docs/framework-integration.md) - 与各种框架的集成示例

## 📄 项目结构

```
cssinjs/
├── lib/
│   ├── index.ts         # 主入口文件
│   ├── css.ts           # 核心 CSS 处理（新增工具函数）
│   ├── parser.ts        # CSS 解析器
│   ├── variables.ts     # CSS 变量管理
│   ├── manager.ts       # 样式管理器（优化缓存）
│   ├── types.ts         # 类型定义
│   ├── utils.ts         # 工具函数（性能优化）
│   └── errors.ts        # 错误处理模块（新增）✨
└── docs/                # 详细文档
```

## 🔗 相关链接

- [GitHub仓库](https://github.com/whl1024/cssinjs)
- [NPM包](https://www.npmjs.com/package/@whl1024/cssinjs)
- [在线文档](https://github.com/whl1024/cssinjs#readme)
- [示例项目](https://github.com/whl1024/cssinjs/tree/main/examples)

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！

---

如需更详细的文档，请查看 [docs](./docs/) 目录。