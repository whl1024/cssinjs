# 高级功能

[![npm version](https://img.shields.io/npm/v/@whl1024/cssinjs.svg)](https://www.npmjs.com/package/@whl1024/cssinjs)

本文档介绍 cssinjs 库的高级功能和用法。

## 🎯 样式组合与工厂函数

### 样式组合

```typescript
import { compose, css } from '@whl1024/cssinjs'

// 基础样式
const baseButtonStyles = {
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontWeight: 500
}

const primaryStyles = {
  backgroundColor: '#007bff',
  color: 'white'
}

const largeStyles = {
  padding: '12px 24px',
  fontSize: 18
}

// 条件样式组合（返回类名）
const className = compose([
  baseButtonStyles,
  isPrimary && primaryStyles,
  isLarge && largeStyles
])

// 直接使用返回的类名
<button className={className}>Button</button>
```

### 样式工厂函数

```typescript
import { styleFactory } from '@whl1024/cssinjs'

// 创建可复用的样式生成器
const createButtonVariant = styleFactory(
  (variant: string, size: string) => ({
    backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d',
    color: 'white',
    padding: size === 'large' ? '12px 24px' : '8px 16px',
    fontSize: size === 'large' ? 18 : 14,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  })
)

// 使用工厂函数生成样式
const primaryLargeButton = createButtonVariant('primary', 'large')
```

### 类名组合

```typescript
// 组合多个 css() 调用的类名
const baseClass = css({ padding: 16, borderRadius: 4 })()
const colorClass = css({ backgroundColor: '#007bff', color: 'white' })()
const sizeClass = css({ fontSize: 18, padding: '12px 24px' })()

// 手动组合类名字符串
const combinedClasses = [baseClass, colorClass, sizeClass]
  .filter(Boolean)
  .join(' ')
```

## 🎨 CSS 变量系统

### 基础 CSS 变量创建

```typescript
import { 
  cssVariables, 
  configureCSSVariables, 
  createThemeProxy,
  injectThemeVariables,
  getThemeVariables
} from '@whl1024/cssinjs'

// 创建 CSS 变量
const themeVars = cssVariables({
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  fontSize: 16,
  spacing: 8,
  borderRadius: 4
})

// 在根元素应用
injectGlobal({
  ':root': themeVars
})
```

### 配置 CSS 变量系统

```typescript
// 配置 CSS 变量系统
configureCSSVariables({
  prefix: 'my-app',        // 变量前缀: --my-app-xxx
  autoInject: true,        // 自动注入到页面
  target: ':root'          // 目标选择器
})
```

### 主题对象代理

```typescript
// 定义主题对象
const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545'
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32
  },
  fonts: {
    sizes: { sm: 12, md: 16, lg: 20, xl: 24 },
    weights: { normal: 400, medium: 500, bold: 700 }
  }
}

// 创建主题代理（自动注入 CSS 变量）
const themeProxy = createThemeProxy(theme)

// 在样式中使用（返回 CSS 变量引用）
const themedStyle = css({
  backgroundColor: themeProxy.colors.primary,    // var(--css-var-colors-primary)
  padding: themeProxy.spacing.md,               // var(--css-var-spacing-md)
  fontSize: themeProxy.fonts.sizes.lg,          // var(--css-var-fonts-sizes-lg)
  fontWeight: themeProxy.fonts.weights.bold     // var(--css-var-fonts-weights-bold)
})
```

### 手动主题变量管理

```typescript
// 手动注入主题变量
const variables = injectThemeVariables(theme, {
  prefix: 'custom-theme',
  target: '.theme-container'
})

// 获取主题变量映射（不自动注入）
const variableMap = getThemeVariables(theme, 'app-theme')
console.log(variableMap)
// {
//   '--app-theme-colors-primary': '#007bff',
//   '--app-theme-spacing-md': '16px',
//   ...
// }
```

## 🔍 复杂嵌套与选择器

### 高级选择器用法

```typescript
const complexStyle = css({
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  
  // 直接子元素
  '& > h2': {
    margin: 0,
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 600,
    color: '#333'
  },
  
  // 嵌套选择器
  '& .content': {
    lineHeight: 1.6,
    
    '& p': {
      marginBottom: 12,
      '&:last-child': {
        marginBottom: 0
      }
    },
    
    '& a': {
      color: '#007bff',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  },
  
  // 伪类和伪元素
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#007bff'
  },
  
  // 属性选择器
  '&[data-variant="primary"]': {
    borderColor: '#007bff'
  },
  
  // 状态选择器
  '&:disabled, &[aria-disabled="true"]': {
    opacity: 0.6,
    cursor: 'not-allowed'
  }
})
```

### 响应式和媒体查询

```typescript
const responsiveStyle = css({
  padding: 24,
  fontSize: 16,
  
  // 媒体查询
  '@media (max-width: 768px)': {
    padding: 12,
    fontSize: 14,
    
    '& > h2': {
      fontSize: 20
    }
  },
  
  // 深色模式
  '@media (prefers-color-scheme: dark)': {
    backgroundColor: '#2d3748',
    color: '#fff',
    
    '& .content a': {
      color: '#63b3ed'
    }
  },
  
  // 打印样式
  '@media print': {
    boxShadow: 'none',
    backgroundColor: 'transparent'
  },
  
  // 高分辨率屏幕
  '@media (-webkit-min-device-pixel-ratio: 2)': {
    // Retina 显示屏优化
  }
})
```

## 🚀 性能优化技巧

### 样式缓存策略

```typescript
// ✅ 推荐：静态样式定义在组件外部
const staticStyles = css({
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer'
})

function Component({ dynamic }) {
  // ❌ 避免：每次渲染都创建静态样式
  // const style = css({ border: 'none' })
  
  // ✅ 推荐：只在需要时创建动态样式
  const dynamicStyle = useMemo(() => css({
    backgroundColor: dynamic ? '#007bff' : '#6c757d'
  }), [dynamic])
  
  return <div className={`${staticStyles()} ${dynamicStyle()}`} />
}
```

### 条件样式优化

```typescript
// ✅ 推荐：使用对象展开减少重复计算
const createButtonStyle = (props: ButtonProps) => css({
  padding: 16,
  borderRadius: 4,
  
  // 条件样式
  ...(props.variant === 'primary' && {
    backgroundColor: '#007bff',
    color: 'white'
  }),
  
  ...(props.size === 'large' && {
    padding: 24,
    fontSize: 18
  }),
  
  ...(props.disabled && {
    opacity: 0.6,
    cursor: 'not-allowed'
  })
})
```

## 🎯 高级动画技巧

### 复杂动画序列

```typescript
import { keyframes } from '@whl1024/cssinjs'

// 多阶段动画
const complexAnimation = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateY(20px) scale(0.9)'
  },
  '25%': {
    opacity: 0.5,
    transform: 'translateY(10px) scale(0.95)'
  },
  '50%': {
    opacity: 0.8,
    transform: 'translateY(5px) scale(0.98)'
  },
  '75%': {
    opacity: 0.9,
    transform: 'translateY(2px) scale(0.99)'
  },
  '100%': {
    opacity: 1,
    transform: 'translateY(0) scale(1)'
  }
})

// 弹性动画
const bounceIn = keyframes({
  '0%': {
    opacity: 0,
    transform: 'scale(0.3)'
  },
  '50%': {
    opacity: 1,
    transform: 'scale(1.05)'
  },
  '70%': {
    transform: 'scale(0.9)'
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1)'
  }
})

const animatedComponent = css({
  animation: `${complexAnimation} 0.6s ease-out`,
  
  '&.bounce-enter': {
    animation: `${bounceIn} 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)`
  }
})
```

### 动画状态管理

```typescript
const createAnimationState = (state: 'idle' | 'loading' | 'success' | 'error') => {
  const spinAnimation = keyframes({
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  })
  
  const pulseAnimation = keyframes({
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 }
  })
  
  return css({
    transition: 'all 0.3s ease',
    
    ...(state === 'loading' && {
      animation: `${spinAnimation} 1s linear infinite`
    }),
    
    ...(state === 'success' && {
      animation: `${pulseAnimation} 0.5s ease-in-out 2`
    }),
    
    ...(state === 'error' && {
      animation: 'shake 0.5s ease-in-out'
    })
  })
}
```

## 🛠 实用工具函数

### 样式辅助函数

```typescript
// 创建响应式样式辅助函数
const createResponsiveStyle = (values: {
  mobile?: any
  tablet?: any
  desktop?: any
}) => ({
  ...values.mobile,
  
  '@media (min-width: 768px)': values.tablet,
  '@media (min-width: 1024px)': values.desktop
})

// 使用示例
const responsiveText = css(createResponsiveStyle({
  mobile: { fontSize: 14, lineHeight: 1.4 },
  tablet: { fontSize: 16, lineHeight: 1.5 },
  desktop: { fontSize: 18, lineHeight: 1.6 }
}))
```

### 主题切换实用函数

```typescript
// 创建主题切换辅助函数
const createThemeVariant = (lightTheme: any, darkTheme: any) => css({
  ...lightTheme,
  
  '@media (prefers-color-scheme: dark)': darkTheme,
  
  '[data-theme="dark"] &': darkTheme
})

// 使用示例
const themedCard = createThemeVariant(
  { backgroundColor: '#fff', color: '#333' },
  { backgroundColor: '#2d3748', color: '#fff' }
)
```

## 📚 下一步

- 查看 [配置选项](./configuration.md) 了解库的配置
- 学习 [框架集成](./framework-integration.md) 了解与框架的集成
- 查看 [性能优化](./performance.md) 获取性能优化技巧