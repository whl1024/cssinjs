# cssinjs

一个轻量级、高性能的CSS-in-JS库，专为现代前端开发设计。具有零运行时开销、完整的TypeScript支持、样式缓存优化等特性。

## ✨ 特性

- 🎯 **零运行时开销** - 在构建时生成CSS，运行时只需要类名
- 🔧 **完整的TypeScript支持** - 提供完整的类型定义和智能提示
- ⚡ **高性能缓存** - 智能样式缓存和去重机制，避免重复生成
- 🎨 **丰富的CSS特性** - 支持嵌套选择器、伪类、媒体查询、关键帧动画
- 🌈 **主题友好** - 框架层主题支持，完全由使用者控制
- 📱 **响应式设计** - 内置媒体查询支持
- 🔌 **框架无关** - 可以与Vue、React、Angular等任意框架集成
- 🏃‍♂️ **SSR友好** - 支持服务端渲染
- 🛠 **开发友好** - 开发模式提供详细的调试信息

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
import { css, keyframes, injectGlobal } from '@whl1024/cssinjs'

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
```

## 📚 文档

- [入门指南](./docs/getting-started.md) - 基础使用方法和概念
- [API 参考](./docs/api-reference.md) - 完整的API文档
- [高级功能](./docs/advanced-features.md) - 高级功能和用法
- [配置选项](./docs/configuration.md) - 配置和工具函数
- [框架集成](./docs/framework-integration.md) - 与各种框架的集成示例
- [性能优化](./docs/performance.md) - 性能监控和优化技巧
- [迁移指南](./docs/migration.md) - 从其他库迁移的指南

## 📄 项目结构

```
cssinjs/
├── lib/
│   ├── index.ts         # 主入口文件
│   ├── css.ts           # 核心 CSS 处理
│   ├── parser.ts        # CSS 解析器
│   ├── variables.ts     # CSS 变量管理
│   ├── manager.ts       # 样式管理器
│   ├── types.ts         # 类型定义
│   └── utils.ts         # 工具函数
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