# 配置选项

[![npm version](https://img.shields.io/npm/v/@whl1024/cssinjs.svg)](https://www.npmjs.com/package/@whl1024/cssinjs)

本文档介绍 cssinjs 库的配置选项和工具函数。

## ⚙️ 基础配置

### 库配置

```typescript
import { configure, getConfig } from '@whl1024/cssinjs'

// 配置库行为
configure({
  classNamePrefix: 'my-app',           // 类名前缀
  enableCache: true,                   // 启用样式缓存
  insertionMode: 'append',             // 样式插入模式: 'append' | 'prepend'
  minifyCSS: false,                    // 是否压缩CSS
  maxCacheSize: 10000,                 // 最大缓存条目数
  enableDeduplication: true,           // 启用样式去重
  developmentMode: process.env.NODE_ENV === 'development'
})

// 获取当前配置
const currentConfig = getConfig()
console.log('当前配置:', currentConfig)
```

### 配置选项详解

#### `classNamePrefix`
- **类型**: `string`
- **默认值**: `'css'`
- **说明**: 生成的CSS类名前缀

```typescript
configure({ classNamePrefix: 'my-app' })
// 生成的类名: my-app-abc123
```

#### `enableCache`
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否启用样式缓存

```typescript
configure({ enableCache: false })
// 每次调用都会重新生成样式
```

#### `insertionMode`
- **类型**: `'append' | 'prepend'`
- **默认值**: `'append'`
- **说明**: 样式插入模式

```typescript
configure({ insertionMode: 'prepend' })
// 新样式会插入到现有样式之前
```

#### `minifyCSS`
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否压缩生成的CSS

```typescript
configure({ minifyCSS: true })
// 生成的CSS会被压缩
```

#### `maxCacheSize`
- **类型**: `number`
- **默认值**: `10000`
- **说明**: 最大缓存条目数

```typescript
configure({ maxCacheSize: 5000 })
// 缓存超过5000条时会清理旧的条目
```

#### `enableDeduplication`
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 启用样式去重

```typescript
configure({ enableDeduplication: false })
// 相同的样式会生成多个类名
```

#### `developmentMode`
- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 开发模式

```typescript
configure({ developmentMode: true })
// 启用详细日志和调试信息
```

## 📊 性能监控与调试

### 性能统计

```typescript
import { 
  getStats, 
  getCacheInfo, 
  clearCache,
  hasStyle,
  hasAnimation
} from '@whl1024/cssinjs'

// 获取性能统计
const stats = getStats()
console.log('缓存命中次数:', stats.cacheHits)
console.log('缓存未命中次数:', stats.cacheMisses)
console.log('总样式数:', stats.totalStyles)
console.log('总动画数:', stats.totalAnimations)
console.log('缓存命中率:', (stats.cacheHits / (stats.cacheHits + stats.cacheMisses) * 100).toFixed(2) + '%')
```

### 缓存信息

```typescript
// 获取缓存信息
const cacheInfo = getCacheInfo()
console.log('缓存的样式数:', cacheInfo.styles)
console.log('缓存的动画数:', cacheInfo.animations)
console.log('缓存总大小(估算):', cacheInfo.totalSize)
```

### 样式检查

```typescript
// 检查样式是否已存在
const buttonStyles = { backgroundColor: '#007bff', padding: 16 }
if (hasStyle(buttonStyles)) {
  console.log('该样式已存在于缓存中')
}

// 检查动画是否已存在
const fadeAnimation = { '0%': { opacity: 0 }, '100%': { opacity: 1 } }
if (hasAnimation(fadeAnimation)) {
  console.log('该动画已存在于缓存中')
}
```

### 缓存管理

```typescript
// 清理缓存
clearCache() // 清空所有缓存

// 销毁库实例（清理资源、移除事件监听器等）
import { destroy } from '@whl1024/cssinjs'
destroy() // 通常在应用卸载时调用
```

## 🛠 开发模式调试

### 启用调试模式

```typescript
// 开发模式下的详细日志
configure({
  developmentMode: true,
  classNamePrefix: 'debug'
})

// 浏览器控制台会显示：
// [CSS-in-JS] 新样式已创建: debug-a1b2c3d4 (23 字节)
// [CSS-in-JS] 样式缓存命中: debug-x9y8z7w6
// [CSS-in-JS] 动画已创建: debug-fadeIn-abc123
```

### 调试实用函数

```typescript
// 调试样式生成
const debugStyle = css({
  backgroundColor: '#007bff',
  padding: 16
}, {
  debug: true  // 启用该样式的调试模式
})

// 输出样式信息
console.log('生成的类名:', debugStyle())
console.log('样式哈希:', debugStyle.hash)
console.log('生成的CSS:', debugStyle.cssText)
```

## 🔧 CSS 变量配置

### CSS 变量系统配置

```typescript
import { configureCSSVariables } from '@whl1024/cssinjs'

// 配置 CSS 变量系统
configureCSSVariables({
  prefix: 'my-app',        // 变量前缀: --my-app-xxx
  autoInject: true,        // 自动注入到页面
  target: ':root',         // 目标选择器
  transformKey: (key) => {
    // 自定义键名转换
    return key.replace(/([A-Z])/g, '-$1').toLowerCase()
  },
  transformValue: (value) => {
    // 自定义值转换
    if (typeof value === 'number') {
      return `${value}px`
    }
    return value
  }
})
```

### 配置选项详解

#### `prefix`
- **类型**: `string`
- **默认值**: `'css-var'`
- **说明**: CSS 变量前缀

#### `autoInject`
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 是否自动注入变量到页面

#### `target`
- **类型**: `string`
- **默认值**: `':root'`
- **说明**: 变量注入的目标选择器

#### `transformKey`
- **类型**: `(key: string) => string`
- **默认值**: `undefined`
- **说明**: 键名转换函数

#### `transformValue`
- **类型**: `(value: any) => string`
- **默认值**: `undefined`
- **说明**: 值转换函数

## 📈 性能优化配置

### 生产环境配置

```typescript
// 生产环境推荐配置
configure({
  classNamePrefix: 'app',
  enableCache: true,
  insertionMode: 'append',
  minifyCSS: true,
  maxCacheSize: 50000,
  enableDeduplication: true,
  developmentMode: false
})
```

### 开发环境配置

```typescript
// 开发环境推荐配置
configure({
  classNamePrefix: 'dev',
  enableCache: true,
  insertionMode: 'append',
  minifyCSS: false,
  maxCacheSize: 10000,
  enableDeduplication: true,
  developmentMode: true
})
```

### 测试环境配置

```typescript
// 测试环境推荐配置
configure({
  classNamePrefix: 'test',
  enableCache: false,      // 避免测试间缓存影响
  insertionMode: 'append',
  minifyCSS: false,
  maxCacheSize: 1000,
  enableDeduplication: false,
  developmentMode: true
})
```

## 🔍 高级配置示例

### 自定义样式处理器

```typescript
// 自定义配置
configure({
  classNamePrefix: 'custom',
  
  // 自定义类名生成器
  generateClassName: (hash: string, prefix: string) => {
    return `${prefix}-${hash.substring(0, 8)}`
  },
  
  // 自定义CSS后处理器
  postprocessCSS: (css: string) => {
    // 添加浏览器前缀、压缩等
    return css.replace(/user-select/g, '-webkit-user-select')
  },
  
  // 自定义样式注入器
  injectStyles: (css: string, className: string) => {
    // 自定义样式注入逻辑
    const style = document.createElement('style')
    style.textContent = css
    style.setAttribute('data-css-class', className)
    document.head.appendChild(style)
  }
})
```

### 条件配置

```typescript
// 根据环境条件配置
const isProduction = process.env.NODE_ENV === 'production'
const isTesting = process.env.NODE_ENV === 'test'

configure({
  classNamePrefix: isProduction ? 'p' : isTesting ? 'test' : 'dev',
  enableCache: !isTesting,
  minifyCSS: isProduction,
  developmentMode: !isProduction,
  maxCacheSize: isProduction ? 50000 : 10000
})
```

## 📚 配置最佳实践

### 1. 环境分离

```typescript
// config/css-config.ts
const baseConfig = {
  enableCache: true,
  enableDeduplication: true,
  insertionMode: 'append' as const
}

export const developmentConfig = {
  ...baseConfig,
  classNamePrefix: 'dev',
  minifyCSS: false,
  developmentMode: true,
  maxCacheSize: 10000
}

export const productionConfig = {
  ...baseConfig,
  classNamePrefix: 'app',
  minifyCSS: true,
  developmentMode: false,
  maxCacheSize: 50000
}
```

### 2. 配置验证

```typescript
// 配置验证函数
function validateConfig(config: any) {
  if (config.maxCacheSize <= 0) {
    throw new Error('maxCacheSize must be greater than 0')
  }
  
  if (!['append', 'prepend'].includes(config.insertionMode)) {
    throw new Error('insertionMode must be "append" or "prepend"')
  }
  
  return config
}

// 使用验证
const config = validateConfig({
  classNamePrefix: 'app',
  maxCacheSize: 10000,
  insertionMode: 'append'
})

configure(config)
```

## 📚 下一步

- 查看 [框架集成](./framework-integration.md) 了解与框架的集成
- 学习 [性能优化](./performance.md) 获取性能优化技巧
- 查看 [API 参考](./api-reference.md) 了解完整的 API