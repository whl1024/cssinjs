# API 参考

本文档提供 cssinjs 库的完整 API 参考。

## 📦 核心 API

### `css(styles, options?)`

创建 CSS 样式类。

#### 参数

- `styles` - CSS 样式对象或函数
- `options?` - 可选配置对象

#### 返回值

返回一个函数，调用该函数返回生成的类名字符串。

#### 基础用法

```typescript
import { css } from '@whl1024/cssinjs'

// 静态样式
const buttonStyle = css({
  backgroundColor: '#007bff',
  color: 'white',
  padding: 16,
  border: 'none',
  borderRadius: 4
})

const className = buttonStyle() // 返回: 'css-abc123'
```

#### 动态样式

```typescript
// 基于 props 的动态样式
const dynamicStyle = css((props: { color: string; size: number }) => ({
  backgroundColor: props.color,
  padding: props.size,
  border: 'none'
}))

const className = dynamicStyle({ color: '#007bff', size: 16 })
```

#### 选项参数

```typescript
interface CSSOptions {
  classNamePrefix?: string  // 类名前缀
  className?: string        // 自定义类名
  debug?: boolean          // 调试模式
}

const styledButton = css({
  padding: 16
}, {
  classNamePrefix: 'btn',
  className: 'primary'
})

const className = styledButton() // 返回: 'btn-primary'
```

### `keyframes(animation)`

创建 CSS 关键帧动画。

#### 参数

- `animation` - 关键帧对象

#### 返回值

返回一个函数，调用该函数返回动画名称。

#### 用法

```typescript
import { keyframes } from '@whl1024/cssinjs'

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 }
})

const animatedStyle = css({
  animation: `${fadeIn()} 0.5s ease-in`
})
```

#### 复杂动画

```typescript
const complexAnimation = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translateY(20px) scale(0.9)'
  },
  '50%': {
    opacity: 0.8,
    transform: 'translateY(10px) scale(0.95)'
  },
  '100%': {
    opacity: 1,
    transform: 'translateY(0) scale(1)'
  }
})
```

### `injectGlobal(styles)`

注入全局样式。

#### 参数

- `styles` - 全局样式对象

#### 用法

```typescript
import { injectGlobal } from '@whl1024/cssinjs'

injectGlobal({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  },
  
  body: {
    fontFamily: 'system-ui, sans-serif',
    lineHeight: 1.6
  },
  
  // 媒体查询
  '@media (max-width: 768px)': {
    body: {
      fontSize: 14
    }
  }
})
```

## 🎨 高级 API

### `compose(...styles)`

合并多个样式对象。

#### 参数

- `...styles` - 样式对象数组

#### 返回值

返回合并后的样式类名字符串。

#### 用法

```typescript
import { compose } from '@whl1024/cssinjs'

const baseButton = { border: 'none', borderRadius: 4 }
const primaryButton = { backgroundColor: '#007bff', color: 'white' }
const largeButton = { padding: '16px 24px', fontSize: 18 }

// compose 会合并样式并返回类名
const className = compose([baseButton, primaryButton, largeButton])
// 直接使用返回的类名
<button className={className}>Button</button>
```

#### 条件合并

```typescript
const buttonStyle = compose([
  baseButton,
  isPrimary && primaryButton,
  isLarge && largeButton
])
// buttonStyle 已经是类名字符串，可以直接使用
```

### `styleFactory(factory)`

创建样式工厂函数。

#### 参数

- `factory` - 样式生成函数

#### 返回值

返回一个样式工厂函数。

#### 用法

```typescript
import { styleFactory } from '@whl1024/cssinjs'

const createButton = styleFactory((variant: string, size: string) => ({
  backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d',
  padding: size === 'large' ? '16px 24px' : '8px 16px',
  border: 'none',
  borderRadius: 4
}))

const primaryLargeButton = createButton('primary', 'large')
```

## 🎯 CSS 变量 API

### `cssVariables(variables)`

创建 CSS 变量对象。

#### 参数

- `variables` - 变量对象

#### 返回值

返回 CSS 变量对象。

#### 用法

```typescript
import { cssVariables } from '@whl1024/cssinjs'

const themeVars = cssVariables({
  primaryColor: '#007bff',
  spacing: 16,
  borderRadius: 4
})

// 使用
injectGlobal({
  ':root': themeVars
})
```

### `createThemeProxy(theme)`

创建主题代理对象。

#### 参数

- `theme` - 主题对象

#### 返回值

返回主题代理对象，访问属性时返回 CSS 变量引用。

#### 用法

```typescript
import { createThemeProxy } from '@whl1024/cssinjs'

const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d'
  },
  spacing: {
    sm: 8,
    md: 16,
    lg: 24
  }
}

const themeProxy = createThemeProxy(theme)

const buttonStyle = css({
  backgroundColor: themeProxy.colors.primary,  // var(--css-var-colors-primary)
  padding: themeProxy.spacing.md              // var(--css-var-spacing-md)
})
```

### `configureCSSVariables(config)`

配置 CSS 变量系统。

#### 参数

```typescript
interface CSSVariableConfig {
  prefix?: string                                    // 变量前缀
  autoInject?: boolean                              // 自动注入
  target?: string                                   // 注入目标
  transformKey?: (key: string) => string           // 键名转换
  transformValue?: (value: any) => string          // 值转换
}
```

#### 用法

```typescript
import { configureCSSVariables } from '@whl1024/cssinjs'

configureCSSVariables({
  prefix: 'my-app',
  autoInject: true,
  target: ':root',
  transformKey: (key) => key.replace(/([A-Z])/g, '-$1').toLowerCase(),
  transformValue: (value) => typeof value === 'number' ? `${value}px` : value
})
```

### `injectThemeVariables(theme, options?)`

手动注入主题变量。

#### 参数

- `theme` - 主题对象
- `options?` - 配置选项

#### 返回值

返回生成的 CSS 变量对象。

#### 用法

```typescript
import { injectThemeVariables } from '@whl1024/cssinjs'

const variables = injectThemeVariables(theme, {
  prefix: 'custom',
  target: '.theme-container'
})
```

### `getThemeVariables(theme, prefix?)`

获取主题变量映射（不自动注入）。

#### 参数

- `theme` - 主题对象
- `prefix?` - 变量前缀

#### 返回值

返回变量映射对象。

#### 用法

```typescript
import { getThemeVariables } from '@whl1024/cssinjs'

const variableMap = getThemeVariables(theme, 'app')
console.log(variableMap)
// {
//   '--app-colors-primary': '#007bff',
//   '--app-spacing-md': '16px'
// }
```

## ⚙️ 配置 API

### `configure(config)`

配置库行为。

#### 参数

```typescript
interface Config {
  classNamePrefix?: string              // 类名前缀
  enableCache?: boolean                // 启用缓存
  insertionMode?: 'append' | 'prepend' // 插入模式
  minifyCSS?: boolean                  // 压缩 CSS
  maxCacheSize?: number                // 最大缓存大小
  enableDeduplication?: boolean        // 启用去重
  developmentMode?: boolean            // 开发模式
  generateClassName?: (hash: string, prefix: string) => string  // 自定义类名生成
  postprocessCSS?: (css: string) => string                     // CSS 后处理
  injectStyles?: (css: string, className: string) => void      // 自定义样式注入
}
```

#### 用法

```typescript
import { configure } from '@whl1024/cssinjs'

configure({
  classNamePrefix: 'app',
  enableCache: true,
  minifyCSS: process.env.NODE_ENV === 'production',
  developmentMode: process.env.NODE_ENV === 'development'
})
```

### `getConfig()`

获取当前配置。

#### 返回值

返回当前配置对象。

#### 用法

```typescript
import { getConfig } from '@whl1024/cssinjs'

const config = getConfig()
console.log('当前配置:', config)
```

## 📊 性能 API

### `getStats()`

获取性能统计信息。

#### 返回值

```typescript
interface Stats {
  cacheHits: number        // 缓存命中次数
  cacheMisses: number      // 缓存未命中次数
  totalStyles: number      // 总样式数
  totalAnimations: number  // 总动画数
}
```

#### 用法

```typescript
import { getStats } from '@whl1024/cssinjs'

const stats = getStats()
console.log('缓存命中率:', stats.cacheHits / (stats.cacheHits + stats.cacheMisses))
```

### `getCacheInfo()`

获取缓存信息。

#### 返回值

```typescript
interface CacheInfo {
  styles: number      // 缓存的样式数
  animations: number  // 缓存的动画数
  totalSize: number   // 总大小估算
}
```

#### 用法

```typescript
import { getCacheInfo } from '@whl1024/cssinjs'

const cacheInfo = getCacheInfo()
console.log('缓存信息:', cacheInfo)
```

### `clearCache()`

清空所有缓存。

#### 用法

```typescript
import { clearCache } from '@whl1024/cssinjs'

clearCache() // 清空所有缓存
```

### `hasStyle(styles)`

检查样式是否已存在于缓存中。

#### 参数

- `styles` - 样式对象

#### 返回值

返回布尔值表示是否存在。

#### 用法

```typescript
import { hasStyle } from '@whl1024/cssinjs'

const styles = { backgroundColor: '#007bff', padding: 16 }
if (hasStyle(styles)) {
  console.log('样式已存在')
}
```

### `hasAnimation(animation)`

检查动画是否已存在于缓存中。

#### 参数

- `animation` - 动画对象

#### 返回值

返回布尔值表示是否存在。

#### 用法

```typescript
import { hasAnimation } from '@whl1024/cssinjs'

const animation = { '0%': { opacity: 0 }, '100%': { opacity: 1 } }
if (hasAnimation(animation)) {
  console.log('动画已存在')
}
```

## 🛠 工具 API

### `destroy()`

销毁库实例，清理资源。

#### 用法

```typescript
import { destroy } from '@whl1024/cssinjs'

// 通常在应用卸载时调用
destroy()
```

## 📋 类型定义

### `CSSProperties`

CSS 属性类型定义，库中已导出此类型。

```typescript
import type { CSSProperties } from '@whl1024/cssinjs/types'

const styles: CSSProperties = {
  backgroundColor: 'red',
  padding: 16,
  
  // 支持嵌套选择器
  '&:hover': {
    opacity: 0.8
  },
  
  // 支持媒体查询
  '@media (max-width: 768px)': {
    padding: 12
  }
}
```

### 关键帧动画类型

关键帧动画可以使用简单的对象定义，无需特殊类型。

```typescript
// 关键帧动画对象
const fadeInAnimation = {
  '0%': { opacity: 0, transform: 'translateY(20px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' }
}

// 或使用 from/to 语法
const slideAnimation = {
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' }
}

// 传递给 keyframes 函数
import { keyframes } from '@whl1024/cssinjs'
const fadeIn = keyframes(fadeInAnimation)
```

### 自定义主题类型

主题没有预定义类型，您可以根据项目需求自定义主题接口。

```typescript
// 自定义主题类型
interface AppTheme {
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
  typography: {
    fontFamily: string
    fontSize: Record<string, number>
  }
}

// 使用自定义主题类型
const theme: AppTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: {
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24
    }
  }
}
```

## 🔧 高级用法

### 自定义样式处理器

```typescript
configure({
  postprocessCSS: (css: string) => {
    // 添加浏览器前缀
    return css
      .replace(/user-select/g, '-webkit-user-select')
      .replace(/transform/g, '-webkit-transform')
  }
})
```

### 自定义类名生成器

```typescript
configure({
  generateClassName: (hash: string, prefix: string) => {
    return `${prefix}-${hash.substring(0, 8)}-${Date.now()}`
  }
})
```

### 自定义样式注入器

```typescript
configure({
  injectStyles: (css: string, className: string) => {
    const style = document.createElement('style')
    style.textContent = css
    style.setAttribute('data-css-class', className)
    document.head.appendChild(style)
  }
})
```

## 📚 下一步

- 查看 [入门指南](./getting-started.md) 了解基础用法
- 学习 [高级功能](./advanced-features.md) 获得更多功能
- 查看 [配置选项](./configuration.md) 了解详细配置
- 学习 [框架集成](./framework-integration.md) 了解与框架的集成