# 性能优化

本文档介绍如何优化 cssinjs 库的性能。

## 📈 性能监控

### 获取性能统计

```typescript
import { getStats, getCacheInfo, clearCache } from '@whl1024/cssinjs'

// 获取性能统计
const stats = getStats()
console.log('缓存命中次数:', stats.cacheHits)
console.log('缓存未命中次数:', stats.cacheMisses)
console.log('总样式数:', stats.totalStyles)
console.log('总动画数:', stats.totalAnimations)

// 计算缓存命中率
const hitRate = (stats.cacheHits / (stats.cacheHits + stats.cacheMisses) * 100).toFixed(2)
console.log('缓存命中率:', hitRate + '%')
```

### 监控缓存使用情况

```typescript
// 获取缓存信息
const cacheInfo = getCacheInfo()
console.log('缓存的样式数:', cacheInfo.styles)
console.log('缓存的动画数:', cacheInfo.animations)
console.log('缓存总大小(估算):', cacheInfo.totalSize)

// 检查缓存健康状况
if (cacheInfo.totalSize > 1024 * 1024) { // 1MB
  console.warn('缓存大小超过 1MB，考虑清理')
  clearCache()
}
```

## 🚀 最佳实践

### 1. 静态样式优化

```typescript
// ✅ 推荐：将静态样式定义在组件外部
const staticButtonStyle = css({
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
})

function Button({ variant, children }) {
  // ❌ 避免：每次渲染都创建静态样式
  // const style = css({ border: 'none' })
  
  // ✅ 推荐：只在需要时创建动态样式
  const dynamicStyle = useMemo(() => css({
    backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d'
  }), [variant])
  
  return (
    <button className={`${staticButtonStyle()} ${dynamicStyle()}`}>
      {children}
    </button>
  )
}
```

### 2. 缓存策略优化

```typescript
// 生产环境配置
configure({
  enableCache: true,
  maxCacheSize: 50000,        // 增加缓存大小
  enableDeduplication: true,   // 启用去重
  minifyCSS: true             // 压缩 CSS
})

// 开发环境配置
configure({
  enableCache: true,
  maxCacheSize: 10000,
  enableDeduplication: true,
  developmentMode: true       // 启用调试信息
})
```

### 3. 样式组合优化

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

// ❌ 避免：每个条件都调用 css()
const buttonStyle1 = css({ padding: 16 })
const buttonStyle2 = props.variant === 'primary' ? css({ backgroundColor: '#007bff' }) : null
const buttonStyle3 = props.size === 'large' ? css({ fontSize: 18 }) : null
```

### 4. CSS 变量优化

```typescript
// ✅ 推荐：使用 CSS 变量避免重新生成样式
const themeProxy = createThemeProxy(theme)

const buttonStyle = css({
  backgroundColor: themeProxy.colors.primary,  // var(--css-var-colors-primary)
  padding: themeProxy.spacing.md              // var(--css-var-spacing-md)
})

// 主题切换时只更新 CSS 变量，不重新生成样式
const toggleTheme = () => {
  createThemeProxy(newTheme) // 只更新变量值
}

// ❌ 避免：主题切换时重新生成样式
const buttonStyle = computed(() => css({
  backgroundColor: theme.value.colors.primary,
  padding: theme.value.spacing.md
}))
```

## 💡 高级优化技巧

### 1. 样式预生成

```typescript
// 预生成常用样式
const commonStyles = {
  button: {
    base: css({
      border: 'none',
      borderRadius: 4,
      cursor: 'pointer'
    })(),
    
    primary: css({
      backgroundColor: '#007bff',
      color: 'white'
    })(),
    
    large: css({
      padding: '16px 24px',
      fontSize: 18
    })()
  }
}

// 使用预生成的样式
function Button({ variant, size }) {
  const classes = [
    commonStyles.button.base,
    variant && commonStyles.button[variant],
    size && commonStyles.button[size]
  ].filter(Boolean).join(' ')
  
  return <button className={classes} />
}
```

### 2. 懒加载样式

```typescript
// 懒加载大型样式模块
const loadComplexStyles = async () => {
  const { complexAnimations } = await import('./complex-styles')
  return complexAnimations
}

// 在需要时才加载
function ComplexComponent() {
  const [styles, setStyles] = useState(null)
  
  useEffect(() => {
    loadComplexStyles().then(setStyles)
  }, [])
  
  if (!styles) return <div>Loading...</div>
  
  return <div className={styles.container()}>Complex content</div>
}
```

### 3. 样式分块

```typescript
// 按功能分块样式
const buttonStyles = {
  // 基础样式
  base: css({
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  }),
  
  // 颜色变体
  colors: {
    primary: css({ backgroundColor: '#007bff', color: 'white' }),
    secondary: css({ backgroundColor: '#6c757d', color: 'white' }),
    danger: css({ backgroundColor: '#dc3545', color: 'white' })
  },
  
  // 尺寸变体
  sizes: {
    sm: css({ padding: '8px 12px', fontSize: 14 }),
    md: css({ padding: '12px 16px', fontSize: 16 }),
    lg: css({ padding: '16px 24px', fontSize: 18 })
  }
}

// 组合使用
function Button({ variant, size }) {
  const className = [
    buttonStyles.base(),
    buttonStyles.colors[variant]?.(),
    buttonStyles.sizes[size]?.()
  ].filter(Boolean).join(' ')
  
  return <button className={className} />
}
```

## 🔍 性能分析

### 1. 样式生成分析

```typescript
// 创建性能分析器
class StyleAnalyzer {
  private startTime: number = 0
  private measurements: Record<string, number> = {}
  
  start(name: string) {
    this.startTime = performance.now()
  }
  
  end(name: string) {
    const duration = performance.now() - this.startTime
    this.measurements[name] = duration
    console.log(`${name}: ${duration.toFixed(2)}ms`)
  }
  
  report() {
    console.table(this.measurements)
  }
}

const analyzer = new StyleAnalyzer()

// 分析样式生成性能
analyzer.start('button-style')
const buttonStyle = css({
  backgroundColor: '#007bff',
  padding: 16
})()
analyzer.end('button-style')
```

### 2. 内存使用监控

```typescript
// 监控内存使用
function monitorMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    console.log('JS Heap Used:', (memory.usedJSHeapSize / 1024 / 1024).toFixed(2), 'MB')
    console.log('JS Heap Total:', (memory.totalJSHeapSize / 1024 / 1024).toFixed(2), 'MB')
  }
}

// 定期监控
setInterval(monitorMemoryUsage, 10000)
```

### 3. 渲染性能优化

```typescript
// 使用 React.memo 优化组件渲染
const OptimizedButton = React.memo(({ variant, size, children, onClick }) => {
  const className = useMemo(() => {
    return [
      buttonStyles.base(),
      buttonStyles.colors[variant]?.(),
      buttonStyles.sizes[size]?.()
    ].filter(Boolean).join(' ')
  }, [variant, size])
  
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )
})

// 使用 Vue 的 shallowRef 优化响应式
const optimizedTheme = shallowRef({
  colors: { primary: '#007bff' },
  spacing: { md: 16 }
})
```

## 🛠 开发工具

### 1. 性能监控面板

```typescript
// 创建性能监控面板
function createPerformancePanel() {
  const panel = document.createElement('div')
  panel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
  `
  
  function updateStats() {
    const stats = getStats()
    const cacheInfo = getCacheInfo()
    
    panel.innerHTML = `
      <div>Cache Hits: ${stats.cacheHits}</div>
      <div>Cache Misses: ${stats.cacheMisses}</div>
      <div>Hit Rate: ${(stats.cacheHits / (stats.cacheHits + stats.cacheMisses) * 100).toFixed(1)}%</div>
      <div>Styles: ${cacheInfo.styles}</div>
      <div>Animations: ${cacheInfo.animations}</div>
    `
  }
  
  updateStats()
  setInterval(updateStats, 1000)
  
  document.body.appendChild(panel)
  return panel
}

// 在开发环境启用
if (process.env.NODE_ENV === 'development') {
  createPerformancePanel()
}
```

### 2. 样式调试工具

```typescript
// 样式调试工具
const StyleDebugger = {
  logStyleGeneration: true,
  
  wrapCSS: (originalCSS: typeof css) => {
    return (styles: any, options?: any) => {
      const start = performance.now()
      const result = originalCSS(styles, options)
      const end = performance.now()
      
      if (this.logStyleGeneration) {
        console.log(`Style generated in ${(end - start).toFixed(2)}ms`, {
          hash: result.hash,
          size: result.cssText?.length || 0
        })
      }
      
      return result
    }
  }
}

// 在开发环境包装 css 函数
if (process.env.NODE_ENV === 'development') {
  const originalCSS = css
  css = StyleDebugger.wrapCSS(originalCSS)
}
```

## 📊 基准测试

### 样式生成基准

```typescript
// 基准测试工具
function benchmark(name: string, fn: () => void, iterations: number = 1000) {
  const start = performance.now()
  
  for (let i = 0; i < iterations; i++) {
    fn()
  }
  
  const end = performance.now()
  const average = (end - start) / iterations
  
  console.log(`${name}: ${average.toFixed(4)}ms per iteration`)
  return average
}

// 测试不同样式生成方式的性能
benchmark('Static Style', () => {
  css({
    backgroundColor: '#007bff',
    padding: 16
  })()
}, 10000)

benchmark('Dynamic Style', () => {
  css((props: any) => ({
    backgroundColor: props.color,
    padding: props.size
  }))({ color: '#007bff', size: 16 })
}, 10000)

benchmark('CSS Variables', () => {
  const theme = createThemeProxy({ color: '#007bff', size: 16 })
  css({
    backgroundColor: theme.color,
    padding: theme.size
  })()
}, 10000)
```

## 🎯 生产环境优化

### 构建时优化

```typescript
// webpack.config.js
module.exports = {
  // ... 其他配置
  
  plugins: [
    // CSS 提取和优化
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    
    // CSS 压缩
    new OptimizeCSSAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      }
    })
  ],
  
  optimization: {
    // 启用 CSS 去重
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
}
```

### 运行时优化配置

```typescript
// 生产环境配置
if (process.env.NODE_ENV === 'production') {
  configure({
    classNamePrefix: 'p',           // 短前缀
    enableCache: true,
    maxCacheSize: 100000,          // 大缓存
    enableDeduplication: true,
    minifyCSS: true,               // 压缩 CSS
    developmentMode: false
  })
} else {
  configure({
    classNamePrefix: 'dev',
    enableCache: true,
    maxCacheSize: 10000,
    enableDeduplication: true,
    minifyCSS: false,
    developmentMode: true
  })
}
```

## 📚 性能检查清单

### ✅ 开发阶段

- [ ] 静态样式定义在组件外部
- [ ] 使用 CSS 变量而非 computed 样式
- [ ] 启用样式缓存和去重
- [ ] 避免在渲染循环中创建样式
- [ ] 使用样式组合而非多次 css() 调用

### ✅ 构建阶段

- [ ] 启用 CSS 压缩
- [ ] 配置样式提取
- [ ] 启用代码分割
- [ ] 移除未使用的样式

### ✅ 运行阶段

- [ ] 监控缓存命中率
- [ ] 定期清理缓存
- [ ] 监控内存使用
- [ ] 优化样式更新频率

## 📚 下一步

- 查看 [配置选项](./configuration.md) 了解详细配置
- 学习 [API 参考](./api-reference.md) 了解性能相关 API
- 查看 [框架集成](./framework-integration.md) 了解框架特定的优化