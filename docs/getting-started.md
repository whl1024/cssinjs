# 入门指南

[![npm version](https://img.shields.io/npm/v/@whl1024/cssinjs.svg)](https://www.npmjs.com/package/@whl1024/cssinjs)

> 📦 **[在 NPM 上安装](https://www.npmjs.com/package/@whl1024/cssinjs)**: `npm install @whl1024/cssinjs`

本指南将帮助您快速上手 cssinjs 库的基本功能。

## 🎯 核心概念

### 什么是 CSS-in-JS？

CSS-in-JS 是一种将样式直接写在 JavaScript 中的技术。cssinjs 库提供了一种类型安全、高性能的 CSS-in-JS 解决方案。

### 主要优势

- **类型安全**：完整的 TypeScript 支持
- **零运行时开销**：构建时生成 CSS
- **样式隔离**：自动生成唯一类名
- **动态样式**：支持基于 props 的条件样式

## 🚀 基础使用

### 创建静态样式

```typescript
import { css } from '@whl1024/cssinjs'

const buttonStyle = css({
  backgroundColor: '#007bff',
  color: 'white',
  padding: 16,
  borderRadius: 4,
  border: 'none',
  cursor: 'pointer',
  
  // 伪类支持
  '&:hover': {
    backgroundColor: '#0056b3'
  },
  
  // 嵌套选择器
  '& .icon': {
    marginRight: 8
  },
  
  // 媒体查询
  '@media (max-width: 768px)': {
    padding: 12,
    fontSize: 14
  }
})

const className = buttonStyle() // 返回生成的类名: css-abc123
```

### 自定义类名

```typescript
// 带前缀的自定义类名
const primaryButton = css({
  color: 'white',
  backgroundColor: '#007bff',
  padding: 16,
  borderRadius: 4
}, {
  classNamePrefix: 'btn',
  className: 'primary'
})

const className = primaryButton() // 返回: btn-primary

// 完全自定义类名（无前缀）
const customButton = css({
  color: 'red'
}, {
  className: 'my-custom-button',
  classNamePrefix: ''  // 空前缀
})

const className = customButton() // 返回: my-custom-button
```

### 动态样式

```typescript
// 基于 props 的动态样式
const dynamicButtonStyle = css((props: { 
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
}) => ({
  color: 'white',
  padding: props.size === 'lg' ? 20 : props.size === 'sm' ? 8 : 12,
  fontSize: props.size === 'lg' ? 18 : props.size === 'sm' ? 12 : 14,
  backgroundColor: 
    props.variant === 'primary' ? '#007bff' : 
    props.variant === 'danger' ? '#dc3545' : '#6c757d',
  borderRadius: 4,
  border: 'none',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  opacity: props.disabled ? 0.6 : 1,
  
  '&:hover': !props.disabled ? {
    opacity: 0.9
  } : undefined
}))

const primaryLargeButton = dynamicButtonStyle({ 
  variant: 'primary', 
  size: 'lg' 
})
```

## 🎬 动画和关键帧

### 创建关键帧动画

```typescript
import { keyframes } from '@whl1024/cssinjs'

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(20px)' },
  '50%': { opacity: 0.5, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' }
})

const slideIn = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' }
})

const animatedStyle = css({
  animation: `${fadeIn} 0.5s ease-out, ${slideIn} 0.3s ease-in`,
  
  // 动画状态样式
  '&.animate-enter': {
    animation: `${fadeIn} 0.5s ease-out`
  },
  
  '&.animate-leave': {
    animation: `${fadeIn} 0.3s ease-in reverse`
  }
})
```

## 🌍 全局样式

### 注入全局样式

```typescript
import { injectGlobal } from '@whl1024/cssinjs'

injectGlobal({
  // 重置样式
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  },
  
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.6,
    color: '#333',
    backgroundColor: '#fff'
  },
  
  // 全局工具类
  '.sr-only': {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0
  },
  
  // 响应式工具类
  '@media (max-width: 768px)': {
    '.hide-mobile': {
      display: 'none'
    }
  }
})
```

## 📱 响应式设计

### 媒体查询

```typescript
const responsiveCard = css({
  padding: 24,
  backgroundColor: 'white',
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  
  // 平板设备
  '@media (max-width: 1024px)': {
    padding: 20
  },
  
  // 手机设备
  '@media (max-width: 768px)': {
    padding: 16,
    borderRadius: 4
  },
  
  // 小屏手机
  '@media (max-width: 480px)': {
    padding: 12,
    margin: '0 -8px'
  }
})
```

## 🔄 条件样式

### 基于条件的样式

```typescript
const conditionalStyle = css((props: {
  isActive: boolean
  theme: 'light' | 'dark'
  size: number
}) => ({
  padding: props.size,
  backgroundColor: props.theme === 'dark' ? '#333' : '#fff',
  color: props.theme === 'dark' ? '#fff' : '#333',
  
  // 条件样式
  ...(props.isActive && {
    borderLeft: '4px solid #007bff',
    backgroundColor: props.theme === 'dark' ? '#444' : '#f8f9fa'
  }),
  
  '&:hover': {
    backgroundColor: props.theme === 'dark' ? '#555' : '#e9ecef'
  }
}))
```

## 🎨 样式组合

### 合并多个样式

```typescript
import { compose } from '@whl1024/cssinjs'

const baseButton = css({
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
})

const primaryButton = css({
  backgroundColor: '#007bff',
  color: 'white'
})

const largeButton = css({
  padding: '16px 24px',
  fontSize: 18
})

// 组合样式（返回类名字符串）
const className = compose([baseButton, primaryButton, largeButton])
// 直接使用
<button className={className}>Button</button>
```

## 💡 最佳实践

### 1. 样式组织

```typescript
// ✅ 推荐：将相关样式分组
const cardStyles = {
  container: css({
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }),
  
  header: css({
    padding: '16px 20px',
    borderBottom: '1px solid #eee'
  }),
  
  content: css({
    padding: 20
  }),
  
  footer: css({
    padding: '12px 20px',
    backgroundColor: '#f8f9fa'
  })
}
```

### 2. 性能优化

```typescript
// ✅ 推荐：将静态样式提取到组件外部
const staticButtonStyle = css({
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer'
})

function Button({ variant, children }) {
  // ❌ 避免：在组件内部创建静态样式
  // const style = css({ border: 'none' })
  
  // ✅ 推荐：只在需要时创建动态样式
  const dynamicStyle = css({
    backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d'
  })
  
  return <button className={`${staticButtonStyle()} ${dynamicStyle()}`}>
    {children}
  </button>
}
```

### 3. TypeScript 类型

```typescript
// ✅ 推荐：定义样式属性的类型
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const buttonStyle = css((props: ButtonProps) => ({
  // 样式定义...
}))
```

## 🔧 调试技巧

### 开发模式

```typescript
import { configure } from '@whl1024/cssinjs'

// 启用开发模式
configure({
  developmentMode: true,
  classNamePrefix: 'debug'
})

// 浏览器控制台会显示详细信息
// [CSS-in-JS] 新样式已创建: debug-a1b2c3d4 (23 字节)
// [CSS-in-JS] 样式缓存命中: debug-x9y8z7w6
```

## 📚 下一步

- 查看 [API 参考](./api-reference.md) 了解完整的 API
- 学习 [高级功能](./advanced-features.md) 获得更多功能
- 查看 [框架集成](./framework-integration.md) 了解如何与不同框架集成