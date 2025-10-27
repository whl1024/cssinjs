# API 参考

[![npm version](https://img.shields.io/npm/v/@whl1024/cssinjs.svg)](https://www.npmjs.com/package/@whl1024/cssinjs)

> 📦 **[NPM 包地址](https://www.npmjs.com/package/@whl1024/cssinjs)** | 📚 [完整文档](https://github.com/whl1024/cssinjs#readme)

本文档提供 cssinjs 库的完整 API 参考。

## 📦 核心 API

### `css(styles, options?)`

创建 CSS 样式类。这是库的核心 API，用于将样式对象转换为 CSS 类名。

#### 参数

- `styles` - CSS 样式对象或函数
- `options?` - 可选配置对象
  - `classNamePrefix?: string` - 类名前缀（默认: 'css'）
  - `className?: string` - 自定义类名
  - `enableCSSVariables?: boolean` - 启用 CSS 变量（默认: true）

#### 返回值

返回一个函数，调用该函数返回生成的类名字符串。

#### 示例 1: 静态样式

```typescript
import { css } from '@whl1024/cssinjs'

// 基础静态样式
const buttonStyle = css({
  backgroundColor: '#007bff',
  color: 'white',
  padding: 16,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer'
})

const className = buttonStyle() // 返回: 'css-abc123'

// 在 HTML 中使用
<button className={buttonStyle()}>点击我</button>
```

#### 示例 2: 嵌套选择器和伪类

```typescript
// 支持伪类、伪元素
const linkStyle = css({
  color: '#007bff',
  textDecoration: 'none',
  transition: 'color 0.3s',
  
  '&:hover': {
    color: '#0056b3',
    textDecoration: 'underline'
  },
  
  '&:active': {
    color: '#004085'
  },
  
  '&::before': {
    content: '"→ "',
    marginRight: 8
  }
})
```

#### 示例 3: 媒体查询

```typescript
// 响应式设计
const responsiveCard = css({
  padding: 16,
  backgroundColor: 'white',
  
  '@media (min-width: 768px)': {
    padding: 24
  },
  
  '@media (min-width: 1024px)': {
    padding: 32,
    maxWidth: 1200
  }
})
```

#### 示例 4: 动态样式

```typescript
// 基于 props 的动态样式
interface ButtonProps {
  color: string
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const dynamicButton = css((props: ButtonProps) => ({
  backgroundColor: props.disabled ? '#ccc' : props.color,
  padding: props.size === 'lg' ? 24 : props.size === 'md' ? 16 : 8,
  fontSize: props.size === 'lg' ? 18 : props.size === 'md' ? 14 : 12,
  opacity: props.disabled ? 0.6 : 1,
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  border: 'none',
  borderRadius: 4
}))

// 使用动态样式
const largeButton = dynamicButton({ color: '#007bff', size: 'lg' })
const disabledButton = dynamicButton({ color: '#007bff', size: 'md', disabled: true })
```

#### 示例 5: 自定义类名

```typescript
// 自定义类名（带前缀）
const namedButton = css({
  padding: 16,
  backgroundColor: '#007bff'
}, {
  classNamePrefix: 'btn',
  className: 'primary'
})

namedButton() // 返回: 'btn-primary'

// 自定义类名（无前缀）
const pureButton = css({
  padding: 16
}, {
  className: 'my-button',
  classNamePrefix: ''  // 空字符串禁用前缀
})

pureButton() // 返回: 'my-button'
```

#### 示例 6: 嵌套样式

```typescript
// 嵌套子元素样式
const cardStyle = css({
  padding: 24,
  backgroundColor: 'white',
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  
  // 子元素选择器
  'h2': {
    fontSize: 24,
    marginBottom: 16,
    color: '#333'
  },
  
  'p': {
    fontSize: 14,
    lineHeight: 1.6,
    color: '#666'
  },
  
  '.card-footer': {
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid #eee'
  }
})
```

### `keyframes(animation)`

创建 CSS 关键帧动画。用于定义可复用的动画效果。

#### 参数

- `animation` - 关键帧对象，键为百分比或 'from'/'to'，值为样式对象

#### 返回值

返回动画名称字符串。

#### 示例 1: 简单淡入动画

```typescript
import { css, keyframes } from '@whl1024/cssinjs'

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 }
})

// 使用动画
const animatedDiv = css({
  animation: `${fadeIn} 0.5s ease-in`
})
```

#### 示例 2: 多阶段动画

```typescript
// 复杂的弹跳动画
const bounce = keyframes({
  '0%': {
    transform: 'translateY(0)',
    animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
  },
  '50%': {
    transform: 'translateY(-25px)',
    animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
  },
  '100%': {
    transform: 'translateY(0)'
  }
})

const bouncingButton = css({
  animation: `${bounce} 1s infinite`
})
```

#### 示例 3: 旋转动画

```typescript
const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
})

const spinner = css({
  width: 40,
  height: 40,
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #007bff',
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`
})
```

#### 示例 4: 组合多个动画

```typescript
const slideIn = keyframes({
  from: {
    transform: 'translateX(-100%)',
    opacity: 0
  },
  to: {
    transform: 'translateX(0)',
    opacity: 1
  }
})

const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 }
})

// 同时应用多个动画
const animatedElement = css({
  animation: `${slideIn} 0.5s ease-out, ${pulse} 2s infinite`
})
```

#### 示例 5: 复杂的颜色变化

```typescript
const colorShift = keyframes({
  '0%': { backgroundColor: '#ff0000' },
  '25%': { backgroundColor: '#00ff00' },
  '50%': { backgroundColor: '#0000ff' },
  '75%': { backgroundColor: '#ffff00' },
  '100%': { backgroundColor: '#ff0000' }
})

const colorfulBox = css({
  width: 100,
  height: 100,
  animation: `${colorShift} 4s ease-in-out infinite`
})
```
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

注入全局样式。用于设置应用级别的全局 CSS 规则。

#### 参数

- `styles` - 全局样式对象，键为选择器，值为样式对象

#### 返回值

无返回值（void）

#### 示例 1: 基础重置样式

```typescript
import { injectGlobal } from '@whl1024/cssinjs'

injectGlobal({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  },
  
  body: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    lineHeight: 1.6,
    color: '#333',
    backgroundColor: '#fff'
  },
  
  'a': {
    color: '#007bff',
    textDecoration: 'none'
  }
})
```

#### 示例 2: 响应式全局样式

```typescript
injectGlobal({
  html: {
    fontSize: 16
  },
  
  // 移动端
  '@media (max-width: 768px)': {
    html: {
      fontSize: 14
    },
    body: {
      padding: 16
    }
  },
  
  // 桌面端
  '@media (min-width: 1024px)': {
    html: {
      fontSize: 18
    },
    body: {
      padding: 32
    }
  }
})
```

#### 示例 3: CSS 变量定义

```typescript
// 在全局注入 CSS 变量
injectGlobal({
  ':root': {
    '--primary-color': '#007bff',
    '--secondary-color': '#6c757d',
    '--spacing-unit': '8px',
    '--border-radius': '4px'
  }
})
```

### `mergeStyles(...styles)` ✨

合并多个样式对象。**新增功能**

#### 参数

- `...styles` - 多个 CSS 样式对象

#### 返回值

返回合并后的样式对象

#### 示例 1: 基础合并

```typescript
import { css, mergeStyles } from '@whl1024/cssinjs'

const baseStyle = {
  padding: 16,
  margin: 8,
  borderRadius: 4
}

const colorStyle = {
  color: 'white',
  backgroundColor: '#007bff'
}

// 合并多个样式对象
const mergedStyle = css(mergeStyles(baseStyle, colorStyle))
// 结果: { padding: 16, margin: 8, borderRadius: 4, color: 'white', backgroundColor: '#007bff' }
```

#### 示例 2: 样式覆盖

```typescript
const defaultButton = {
  padding: 12,
  fontSize: 14,
  backgroundColor: '#ccc'
}

const primaryButton = {
  backgroundColor: '#007bff',  // 覆盖默认背景色
  color: 'white'
}

const largeButton = {
  padding: 20,  // 覆盖默认内边距
  fontSize: 18
}

// 后面的样式会覆盖前面的同名属性
const buttonStyle = css(mergeStyles(
  defaultButton,
  primaryButton,
  largeButton
))
// 最终: padding: 20, fontSize: 18, backgroundColor: '#007bff', color: 'white'
```

#### 示例 3: 条件样式合并

```typescript
const getButtonStyle = (variant: 'primary' | 'secondary', size: 'sm' | 'lg') => {
  const baseStyle = {
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  }
  
  const variantStyles = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' }
  }
  
  const sizeStyles = {
    sm: { padding: 8, fontSize: 12 },
    lg: { padding: 20, fontSize: 18 }
  }
  
  return css(mergeStyles(
    baseStyle,
    variantStyles[variant],
    sizeStyles[size]
  ))
}

const primaryLarge = getButtonStyle('primary', 'lg')
```

### `composeClasses(...styleFns)` ✨

组合多个样式类名。**新增功能**

#### 参数

- `...styleFns` - 多个样式函数（css 函数的返回值）

#### 返回值

返回一个函数，调用时返回组合后的类名字符串

#### 示例 1: 基础组合

```typescript
import { css, composeClasses } from '@whl1024/cssinjs'

const resetStyle = css({
  margin: 0,
  padding: 0,
  border: 'none'
})

const layoutStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: 16
})

const colorStyle = css({
  backgroundColor: '#007bff',
  color: 'white'
})

// 组合多个类名
const combinedStyle = composeClasses(resetStyle, layoutStyle, colorStyle)

// 使用
<div className={combinedStyle()}>
  // 结果: className="css-abc123 css-def456 css-ghi789"
</div>
```

#### 示例 2: React 组件中使用

```typescript
function Button({ primary, large, disabled, children }) {
  const baseStyle = css({
    padding: 12,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  })
  
  const primaryStyle = css({
    backgroundColor: '#007bff',
    color: 'white'
  })
  
  const largeStyle = css({
    padding: 20,
    fontSize: 18
  })
  
  const disabledStyle = css({
    opacity: 0.5,
    cursor: 'not-allowed'
  })
  
  // 根据条件组合不同的样式
  const styles = [baseStyle]
  if (primary) styles.push(primaryStyle)
  if (large) styles.push(largeStyle)
  if (disabled) styles.push(disabledStyle)
  
  const className = composeClasses(...styles)()
  
  return <button className={className}>{children}</button>
}
```

#### 示例 3: 模块化样式组合

```typescript
// styles/button.ts
export const buttonBase = css({ padding: 12, border: 'none' })
export const buttonPrimary = css({ backgroundColor: '#007bff' })
export const buttonLarge = css({ padding: 20, fontSize: 18 })

// components/Button.tsx
import { composeClasses } from '@whl1024/cssinjs'
import { buttonBase, buttonPrimary, buttonLarge } from './styles/button'

const ButtonComponent = () => {
  const className = composeClasses(buttonBase, buttonPrimary, buttonLarge)()
  return <button className={className}>Click me</button>
}
```

### `conditionalCompose(baseStyle, conditions)` ✨

根据条件组合样式。**新增功能**

#### 参数

- `baseStyle` - 基础样式函数（始终应用）
- `conditions` - 条件样式映射对象

#### 返回值

返回一个函数，接收条件对象，返回组合后的类名字符串

#### 示例 1: 按钮变体

```typescript
import { css, conditionalCompose } from '@whl1024/cssinjs'

// 定义基础样式
const button = css({
  padding: 12,
  border: 'none',
  borderRadius: 4,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'all 0.2s'
})

// 定义条件样式
const buttonVariants = {
  primary: css({ backgroundColor: '#007bff', color: 'white' }),
  secondary: css({ backgroundColor: '#6c757d', color: 'white' }),
  danger: css({ backgroundColor: '#dc3545', color: 'white' }),
  small: css({ padding: 8, fontSize: 12 }),
  large: css({ padding: 16, fontSize: 18 }),
  disabled: css({ opacity: 0.5, cursor: 'not-allowed' })
}

// 创建条件组合函数
const getButtonClass = conditionalCompose(button, buttonVariants)

// 使用
const primaryLargeButton = getButtonClass({ 
  primary: true, 
  large: true, 
  disabled: false 
})
// 结果: 'css-base css-primary css-large'

const secondarySmallDisabled = getButtonClass({
  secondary: true,
  small: true,
  disabled: true
})
// 结果: 'css-base css-secondary css-small css-disabled'
```

#### 示例 2: React 组件完整示例

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'large'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
}

function Button({ 
  variant = 'primary', 
  size, 
  disabled, 
  loading, 
  children 
}: ButtonProps) {
  // 基础样式
  const baseStyle = css({
    padding: 12,
    border: 'none',
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8
  })
  
  // 所有可能的样式变体
  const variants = {
    primary: css({ backgroundColor: '#007bff', color: 'white' }),
    secondary: css({ backgroundColor: '#6c757d', color: 'white' }),
    danger: css({ backgroundColor: '#dc3545', color: 'white' }),
    small: css({ padding: 8, fontSize: 12 }),
    large: css({ padding: 16, fontSize: 18 }),
    disabled: css({ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }),
    loading: css({ opacity: 0.7, pointerEvents: 'none' })
  }
  
  // 创建条件组合
  const getButtonClass = conditionalCompose(baseStyle, variants)
  
  // 根据 props 生成条件对象
  const className = getButtonClass({
    [variant]: true,  // 动态键名
    small: size === 'small',
    large: size === 'large',
    disabled: Boolean(disabled),
    loading: Boolean(loading)
  })
  
  return (
    <button className={className} disabled={disabled || loading}>
      {loading && <span>⏳</span>}
      {children}
    </button>
  )
}

// 使用示例
<Button variant="primary" size="large">提交</Button>
<Button variant="danger" disabled>删除</Button>
<Button variant="secondary" loading>加载中...</Button>
```

#### 示例 3: 复杂状态组合

```typescript
// 输入框组件
const input = css({
  padding: 12,
  border: '1px solid #ddd',
  borderRadius: 4,
  fontSize: 14,
  outline: 'none',
  transition: 'all 0.2s'
})

const inputStates = {
  focused: css({ borderColor: '#007bff', boxShadow: '0 0 0 3px rgba(0,123,255,0.1)' }),
  error: css({ borderColor: '#dc3545', backgroundColor: '#fff5f5' }),
  success: css({ borderColor: '#28a745', backgroundColor: '#f0fff4' }),
  disabled: css({ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }),
  large: css({ padding: 16, fontSize: 16 }),
  small: css({ padding: 8, fontSize: 12 })
}

const getInputClass = conditionalCompose(input, inputStates)

function Input({ value, onChange, error, success, size, disabled, onFocus, onBlur }) {
  const [focused, setFocused] = React.useState(false)
  
  const className = getInputClass({
    focused,
    error: Boolean(error),
    success: Boolean(success),
    disabled: Boolean(disabled),
    large: size === 'large',
    small: size === 'small'
  })
  
  return (
    <input
      className={className}
      value={value}
      onChange={onChange}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}
```

## 🎨 高级 API

### `compose(styles)`

合并多个样式对象并返回类名。这是原有的 compose 方法（与 `composeClasses` 不同）。

#### 参数

- `styles` - 样式对象数组，支持条件样式（false/null/undefined 会被过滤）

#### 返回值

返回合并后的类名字符串（已经是最终的类名，不是函数）

#### 示例 1: 基础合并

```typescript
import { compose } from '@whl1024/cssinjs'

const baseButton = { 
  border: 'none', 
  borderRadius: 4,
  cursor: 'pointer'
}

const primaryButton = { 
  backgroundColor: '#007bff', 
  color: 'white' 
}

const largeButton = { 
  padding: '16px 24px', 
  fontSize: 18 
}

// compose 直接返回类名字符串
const className = compose([baseButton, primaryButton, largeButton])

// 直接使用
<button className={className}>Button</button>
```

#### 示例 2: 条件样式合并

```typescript
function Button({ primary, secondary, large, disabled }) {
  const baseStyle = { padding: 12, border: 'none', borderRadius: 4 }
  const primaryStyle = { backgroundColor: '#007bff', color: 'white' }
  const secondaryStyle = { backgroundColor: '#6c757d', color: 'white' }
  const largeStyle = { padding: 20, fontSize: 18 }
  const disabledStyle = { opacity: 0.5, cursor: 'not-allowed' }
  
  // 使用条件过滤（false/null/undefined 会被自动忽略）
  const className = compose([
    baseStyle,
    primary && primaryStyle,
    secondary && secondaryStyle,
    large && largeStyle,
    disabled && disabledStyle
  ])
  
  return <button className={className}>Click me</button>
}
```

#### 示例 3: 动态样式组合

```typescript
const getCardStyle = (variant: 'default' | 'elevated' | 'outlined') => {
  const baseCard = {
    padding: 24,
    borderRadius: 8,
    backgroundColor: 'white'
  }
  
  const variants = {
    default: null,  // 不添加额外样式
    elevated: { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    outlined: { border: '1px solid #ddd', boxShadow: 'none' }
  }
  
  return compose([
    baseCard,
    variants[variant]
  ])
}

const defaultCard = getCardStyle('default')
const elevatedCard = getCardStyle('elevated')
const outlinedCard = getCardStyle('outlined')
```

#### 对比: `compose` vs `composeClasses`

```typescript
// compose - 合并样式对象，返回类名字符串
const className1 = compose([{ padding: 16 }, { color: 'red' }])
// 返回: 'css-abc123' （直接是类名字符串）

// composeClasses - 组合多个样式函数，返回函数
const style1 = css({ padding: 16 })
const style2 = css({ color: 'red' })
const className2 = composeClasses(style1, style2)()
// 返回: 'css-abc123 css-def456' （多个类名）
```

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

配置库行为。用于全局配置 CSS-in-JS 库的各种选项。

#### 参数

```typescript
interface CSSInJSConfig {
  classNamePrefix?: string              // 类名前缀，默认 'css'
  insertionMode?: 'sync' | 'async' | 'lazy'  // 样式插入模式
  enableCache?: boolean                // 启用缓存，默认 true
  developmentMode?: boolean            // 开发模式，默认 false
  styleTagId?: string                  // 样式标签 ID
  insertionPoint?: Element             // 样式插入位置
  minifyCSS?: boolean                  // 压缩 CSS，默认 false
  maxCacheSize?: number                // 最大缓存大小，默认 10000
}
```

#### 示例 1: 基础配置

```typescript
import { configure } from '@whl1024/cssinjs'

// 生产环境配置
configure({
  classNamePrefix: 'app',
  enableCache: true,
  minifyCSS: true,
  developmentMode: false
})
```

#### 示例 2: 开发环境配置

```typescript
// 开发环境：详细的调试信息
configure({
  classNamePrefix: 'dev',
  enableCache: false,  // 禁用缓存便于调试
  minifyCSS: false,    // 不压缩便于阅读
  developmentMode: true  // 启用详细错误信息
})
```

#### 示例 3: 自定义类名前缀

```typescript
// 为不同的应用模块设置不同前缀
configure({
  classNamePrefix: 'admin'  // 所有类名: admin-xxx
})

const button = css({ padding: 16 })
button() // 返回: 'admin-abc123'

// 动态切换前缀
configure({
  classNamePrefix: 'user'  // 切换到: user-xxx
})
```

#### 示例 4: 样式插入模式

```typescript
// 同步插入（默认，立即生效）
configure({
  insertionMode: 'sync'
})

// 异步插入（使用 requestAnimationFrame，性能更好）
configure({
  insertionMode: 'async'
})

// 懒加载插入（延迟到真正需要时）
configure({
  insertionMode: 'lazy'
})
```

#### 示例 5: 缓存大小限制

```typescript
// 限制缓存大小防止内存泄漏
configure({
  maxCacheSize: 5000,  // 最多缓存 5000 个样式
  enableCache: true
})
```

#### 示例 6: 环境自适应配置

```typescript
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

configure({
  classNamePrefix: isDevelopment ? 'dev' : 'app',
  enableCache: isProduction,
  minifyCSS: isProduction,
  developmentMode: isDevelopment,
  maxCacheSize: isProduction ? 10000 : 1000
})
```

### `getConfig()`

获取当前配置。返回当前的全局配置对象。

#### 返回值

返回当前配置对象（CSSInJSConfig）

#### 示例 1: 查看当前配置

```typescript
import { getConfig } from '@whl1024/cssinjs'

const config = getConfig()
console.log('当前配置:', config)
// 输出:
// {
//   classNamePrefix: 'css',
//   insertionMode: 'sync',
//   enableCache: true,
//   developmentMode: false,
//   ...
// }
```

#### 示例 2: 条件逻辑

```typescript
const config = getConfig()

if (config.developmentMode) {
  console.log('运行在开发模式')
}

if (config.enableCache) {
  console.log('缓存已启用')
}
```

#### 示例 3: 动态调整

```typescript
const currentConfig = getConfig()

// 基于当前配置做调整
configure({
  ...currentConfig,
  maxCacheSize: currentConfig.maxCacheSize! * 2  // 缓存大小翻倍
})
```

### `clearCache()`

清空样式缓存。用于手动清理缓存，释放内存。

#### 返回值

无返回值（void）

#### 示例 1: 基础清理

```typescript
import { clearCache } from '@whl1024/cssinjs'

// 清空所有缓存
clearCache()
```

#### 示例 2: 定期清理

```typescript
// 每 5 分钟清理一次缓存
setInterval(() => {
  clearCache()
  console.log('缓存已清理')
}, 5 * 60 * 1000)
```

#### 示例 3: 路由切换时清理

```typescript
// 在 React Router 中
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { clearCache } from '@whl1024/cssinjs'

function App() {
  const location = useLocation()
  
  useEffect(() => {
    // 路由变化时清理缓存
    clearCache()
  }, [location.pathname])
  
  return <YourApp />
}
```

## 📊 性能和监控 API

### `getStats()`

获取性能统计信息。用于监控样式生成性能和缓存效率。

#### 返回值

```typescript
interface Stats {
  totalStyles: number      // 总样式数量
  cacheHits: number        // 缓存命中次数
  cacheMisses: number      // 缓存未命中次数
  injectionTime: number    // 总注入时间（毫秒）
  lastCleanup: number      // 上次清理时间戳
}
```

#### 示例 1: 查看统计信息

```typescript
import { getStats } from '@whl1024/cssinjs'

const stats = getStats()
console.log('性能统计:', stats)
// 输出:
// {
//   totalStyles: 150,
//   cacheHits: 2340,
//   cacheMisses: 150,
//   injectionTime: 45.2,
//   lastCleanup: 1698765432000
// }
```

#### 示例 2: 计算缓存命中率

```typescript
const stats = getStats()
const hitRate = stats.cacheHits / (stats.cacheHits + stats.cacheMisses)

console.log(`缓存命中率: ${(hitRate * 100).toFixed(2)}%`)
// 输出: 缓存命中率: 93.98%

if (hitRate < 0.8) {
  console.warn('缓存命中率较低，考虑优化样式复用')
}
```

#### 示例 3: 性能监控面板

```typescript
function PerformanceMonitor() {
  const [stats, setStats] = React.useState(getStats())
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats(getStats())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  const hitRate = (stats.cacheHits / (stats.cacheHits + stats.cacheMisses) * 100).toFixed(1)
  const avgInjectionTime = (stats.injectionTime / stats.totalStyles).toFixed(2)
  
  return (
    <div>
      <h3>CSS-in-JS 性能监控</h3>
      <p>总样式数: {stats.totalStyles}</p>
      <p>缓存命中: {stats.cacheHits} 次</p>
      <p>缓存未命中: {stats.cacheMisses} 次</p>
      <p>命中率: {hitRate}%</p>
      <p>平均注入时间: {avgInjectionTime}ms</p>
    </div>
  )
}
```

### `getCacheInfo()`

获取缓存详细信息。查看当前缓存的大小和状态。

#### 返回值

```typescript
interface CacheInfo {
  styles: number          // 缓存的样式数量
  animations: number      // 缓存的动画数量
  injectedRules: number   // 已注入的规则数量
  totalSize: number       // 总大小（估算，字节）
}
```

#### 示例 1: 查看缓存信息

```typescript
import { getCacheInfo } from '@whl1024/cssinjs'

const cacheInfo = getCacheInfo()
console.log('缓存信息:', cacheInfo)
// 输出:
// {
//   styles: 120,
//   animations: 15,
//   injectedRules: 135,
//   totalSize: 45678
// }
```

#### 示例 2: 缓存大小警告

```typescript
const checkCacheSize = () => {
  const info = getCacheInfo()
  const sizeMB = (info.totalSize / 1024 / 1024).toFixed(2)
  
  console.log(`缓存大小: ${sizeMB} MB`)
  
  if (info.totalSize > 10 * 1024 * 1024) {  // 超过 10MB
    console.warn('缓存过大，建议清理')
    clearCache()
  }
}

// 定期检查
setInterval(checkCacheSize, 60000)
```

#### 示例 3: 缓存使用率监控

```typescript
function CacheMonitor() {
  const [cacheInfo, setCacheInfo] = React.useState(getCacheInfo())
  const config = getConfig()
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCacheInfo(getCacheInfo())
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])
  
  const usageRate = (cacheInfo.styles / (config.maxCacheSize || 10000) * 100).toFixed(1)
  const sizeMB = (cacheInfo.totalSize / 1024 / 1024).toFixed(2)
  
  return (
    <div>
      <h4>缓存状态</h4>
      <p>样式缓存: {cacheInfo.styles} 个</p>
      <p>动画缓存: {cacheInfo.animations} 个</p>
      <p>已注入规则: {cacheInfo.injectedRules} 个</p>
      <p>使用率: {usageRate}%</p>
      <p>大小: {sizeMB} MB</p>
      {parseFloat(usageRate) > 80 && (
        <button onClick={clearCache}>清理缓存</button>
      )}
    </div>
  )
}
```

### `hasStyle(styles)`

检查样式是否已存在于缓存中。

#### 参数

- `styles` - CSS 样式对象

#### 返回值

返回 boolean，true 表示已缓存

#### 示例

```typescript
import { hasStyle } from '@whl1024/cssinjs'

const buttonStyles = {
  padding: 16,
  backgroundColor: '#007bff'
}

if (hasStyle(buttonStyles)) {
  console.log('该样式已缓存')
} else {
  console.log('该样式未缓存，首次生成')
}
```

### `hasAnimation(keyframes)`

检查动画是否已存在于缓存中。

#### 参数

- `keyframes` - 关键帧对象

#### 返回值

返回 boolean，true 表示已缓存

#### 示例

```typescript
import { hasAnimation } from '@whl1024/cssinjs'

const fadeAnimation = {
  from: { opacity: 0 },
  to: { opacity: 1 }
}

if (hasAnimation(fadeAnimation)) {
  console.log('该动画已缓存')
} else {
  console.log('该动画未缓存')
}
```

### `destroy()`

销毁 CSS-in-JS 实例。清理所有资源，通常在应用卸载时调用。

#### 返回值

无返回值（void）

#### 示例 1: 应用卸载

```typescript
import { destroy } from '@whl1024/cssinjs'

// 在应用卸载时清理
window.addEventListener('beforeunload', () => {
  destroy()
})
```

#### 示例 2: React 应用

```typescript
function App() {
  React.useEffect(() => {
    return () => {
      // 组件卸载时清理
      destroy()
    }
  }, [])
  
  return <YourApp />
}
```
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