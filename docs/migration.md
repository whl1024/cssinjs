# 迁移指南

[![npm version](https://img.shields.io/npm/v/@whl1024/cssinjs.svg)](https://www.npmjs.com/package/@whl1024/cssinjs)

本文档帮助您从其他 CSS-in-JS 库迁移到 cssinjs。

## 📦 从 styled-components 迁移

### 基础组件迁移

#### 之前 (styled-components)

```tsx
import styled from 'styled-components'

const Button = styled.button`
  background-color: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  padding: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`

const App = () => (
  <Button primary>Click me</Button>
)
```

#### 之后 (cssinjs)

```tsx
import { css } from '@whl1024/cssinjs'

const createButtonStyle = (primary: boolean) => css({
  backgroundColor: primary ? '#007bff' : '#6c757d',
  color: 'white',
  padding: 16,
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  
  '&:hover': {
    opacity: 0.9
  }
})

const Button = ({ primary, children, ...props }) => (
  <button className={createButtonStyle(primary)()} {...props}>
    {children}
  </button>
)

const App = () => (
  <Button primary>Click me</Button>
)
```

### 主题迁移

#### 之前 (styled-components)

```tsx
import styled, { ThemeProvider } from 'styled-components'

const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d'
  }
}

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 16px;
`

const App = () => (
  <ThemeProvider theme={theme}>
    <Button>Themed Button</Button>
  </ThemeProvider>
)
```

#### 之后 (cssinjs)

```tsx
import { css, createThemeProxy } from '@whl1024/cssinjs'

const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d'
  }
}

const themeProxy = createThemeProxy(theme)

const buttonStyle = css({
  backgroundColor: themeProxy.colors.primary,
  color: 'white',
  padding: 16
})

const Button = ({ children, ...props }) => (
  <button className={buttonStyle()} {...props}>
    {children}
  </button>
)

const App = () => (
  <Button>Themed Button</Button>
)
```

### 高级功能迁移

#### CSS 属性传递

**之前:**
```tsx
const Container = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.bgColor
  }
}))`
  padding: 20px;
  border-radius: 8px;
`
```

**之后:**
```tsx
const createContainerStyle = (bgColor: string) => css({
  padding: 20,
  borderRadius: 8,
  backgroundColor: bgColor
})

const Container = ({ bgColor, children, ...props }) => (
  <div className={createContainerStyle(bgColor)()} {...props}>
    {children}
  </div>
)
```

## 🎨 从 Emotion 迁移

### css prop 迁移

#### 之前 (Emotion)

```tsx
/** @jsx jsx */
import { jsx, css } from '@emotion/react'

const buttonStyle = css`
  background-color: #007bff;
  color: white;
  padding: 16px;
  
  &:hover {
    opacity: 0.9;
  }
`

const App = () => (
  <button css={buttonStyle}>
    Click me
  </button>
)
```

#### 之后 (cssinjs)

```tsx
import { css } from '@whl1024/cssinjs'

const buttonStyle = css({
  backgroundColor: '#007bff',
  color: 'white',
  padding: 16,
  
  '&:hover': {
    opacity: 0.9
  }
})

const App = () => (
  <button className={buttonStyle()}>
    Click me
  </button>
)
```

### 动态样式迁移

#### 之前 (Emotion)

```tsx
import { css } from '@emotion/react'

const Button = ({ primary, size }) => {
  const buttonStyle = css`
    background-color: ${primary ? '#007bff' : '#6c757d'};
    padding: ${size === 'large' ? '20px' : '16px'};
    color: white;
    border: none;
  `
  
  return <button css={buttonStyle}>Button</button>
}
```

#### 之后 (cssinjs)

```tsx
import { css } from '@whl1024/cssinjs'

const Button = ({ primary, size }) => {
  const buttonStyle = css({
    backgroundColor: primary ? '#007bff' : '#6c757d',
    padding: size === 'large' ? 20 : 16,
    color: 'white',
    border: 'none'
  })
  
  return <button className={buttonStyle()}>Button</button>
}
```

## 📱 从 CSS Modules 迁移

### 基础样式迁移

#### 之前 (CSS Modules)

```css
/* Button.module.css */
.button {
  background-color: #007bff;
  color: white;
  padding: 16px;
  border: none;
  border-radius: 4px;
}

.button:hover {
  opacity: 0.9;
}

.primary {
  background-color: #007bff;
}

.secondary {
  background-color: #6c757d;
}
```

```tsx
import styles from './Button.module.css'

const Button = ({ variant, children }) => (
  <button className={`${styles.button} ${styles[variant]}`}>
    {children}
  </button>
)
```

#### 之后 (cssinjs)

```tsx
import { css } from '@whl1024/cssinjs'

const buttonStyles = {
  base: css({
    backgroundColor: '#007bff',
    color: 'white',
    padding: 16,
    border: 'none',
    borderRadius: 4,
    
    '&:hover': {
      opacity: 0.9
    }
  }),
  
  primary: css({
    backgroundColor: '#007bff'
  }),
  
  secondary: css({
    backgroundColor: '#6c757d'
  })
}

const Button = ({ variant, children }) => (
  <button className={`${buttonStyles.base()} ${buttonStyles[variant]?.()}`}>
    {children}
  </button>
)
```

### 组合样式迁移

#### 之前 (CSS Modules)

```css
.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.card.featured {
  border: 2px solid #007bff;
}

.card.large {
  padding: 32px;
}
```

```tsx
import styles from './Card.module.css'

const Card = ({ featured, large, children }) => {
  const className = [
    styles.card,
    featured && styles.featured,
    large && styles.large
  ].filter(Boolean).join(' ')
  
  return <div className={className}>{children}</div>
}
```

#### 之后 (cssinjs)

```tsx
import { css, compose } from '@whl1024/cssinjs'

const cardStyles = {
  base: {
    background: 'white',
    borderRadius: 8,
    padding: 20
  },
  
  featured: {
    border: '2px solid #007bff'
  },
  
  large: {
    padding: 32
  }
}

const Card = ({ featured, large, children }) => {
  // compose 直接返回类名字符串
  const className = compose([
    cardStyles.base,
    featured && cardStyles.featured,
    large && cardStyles.large
  ])
  
  return <div className={className}>{children}</div>
}
```

## 🔧 迁移工具和脚本

### 自动迁移脚本

```javascript
// migrate-styled-components.js
const fs = require('fs')
const path = require('path')

function migrateStyledComponents(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  
  // 替换 import
  content = content.replace(
    /import styled.*from ['"]styled-components['"]/g,
    "import { css } from '@whl1024/cssinjs'"
  )
  
  // 替换基础 styled 组件
  content = content.replace(
    /const (\w+) = styled\.(\w+)`([^`]+)`/g,
    (match, componentName, element, styles) => {
      const cssObject = templateLiteralToObject(styles)
      return `const ${componentName}Style = css(${cssObject})

const ${componentName} = (props) => (
  <${element} className={${componentName}Style()} {...props}>
    {props.children}
  </${element}>
)`
    }
  )
  
  fs.writeFileSync(filePath, content)
}

function templateLiteralToObject(templateLiteral) {
  // 简化的转换逻辑，实际需要更复杂的解析
  const cssObject = templateLiteral
    .replace(/(\w+(-\w+)*)\s*:\s*([^;]+);/g, '$1: "$3"')
    .replace(/&:(\w+)/g, '"&:$1"')
  
  return `{${cssObject}}`
}
```

### 批量迁移工具

```javascript
// batch-migrate.js
const glob = require('glob')
const path = require('path')

async function batchMigrate(pattern, targetDir) {
  const files = glob.sync(pattern, { cwd: targetDir })
  
  for (const file of files) {
    const fullPath = path.join(targetDir, file)
    console.log(`Migrating ${file}...`)
    
    try {
      await migrateFile(fullPath)
      console.log(`✅ Successfully migrated ${file}`)
    } catch (error) {
      console.error(`❌ Error migrating ${file}:`, error.message)
    }
  }
}

// 使用示例
batchMigrate('**/*.tsx', './src')
```

## 📋 迁移检查清单

### 🔍 代码审查清单

- [ ] 替换所有 styled-components 导入
- [ ] 转换所有 styled 组件为 css() 调用
- [ ] 更新主题系统使用 createThemeProxy
- [ ] 替换 css prop 为 className
- [ ] 更新动态样式语法
- [ ] 测试所有样式功能

### 🧪 测试清单

- [ ] 视觉回归测试
- [ ] 主题切换功能测试
- [ ] 响应式样式测试
- [ ] 动画和过渡测试
- [ ] 性能基准测试

### 📦 依赖清理清单

- [ ] 移除 styled-components 依赖
- [ ] 移除 @emotion/* 依赖
- [ ] 移除 CSS Modules 相关配置
- [ ] 更新 TypeScript 类型
- [ ] 更新构建配置

## 🚨 常见迁移问题

### 1. 模板字符串转对象

**问题:**
```tsx
// styled-components 模板字符串
const Button = styled.button`
  color: ${props => props.primary ? 'white' : 'black'};
`
```

**解决:**
```tsx
// cssinjs 对象语法
const createButtonStyle = (primary: boolean) => css({
  color: primary ? 'white' : 'black'
})
```

### 2. 主题访问

**问题:**
```tsx
// styled-components 主题访问
const Button = styled.button`
  color: ${props => props.theme.colors.primary};
`
```

**解决:**
```tsx
// cssinjs 主题代理
const themeProxy = createThemeProxy(theme)
const buttonStyle = css({
  color: themeProxy.colors.primary
})
```

### 3. 条件样式

**问题:**
```tsx
// 复杂的条件逻辑
const Button = styled.button`
  ${props => props.variant === 'primary' && css`
    background: #007bff;
    color: white;
  `}
`
```

**解决:**
```tsx
// 对象展开语法
const createButtonStyle = (variant: string) => css({
  ...(variant === 'primary' && {
    background: '#007bff',
    color: 'white'
  })
})
```

## 🎯 迁移后优化

### 性能优化

```tsx
// 迁移后的性能优化
import { css } from '@whl1024/cssinjs'

// 1. 静态样式提取
const staticStyles = css({
  border: 'none',
  borderRadius: 4
})

// 2. 样式缓存
const createDynamicStyle = useMemo(() => (props) => css({
  backgroundColor: props.color
}), [])

// 3. 样式组合优化
const Button = ({ variant, size, children }) => {
  const className = useMemo(() => {
    return [
      staticStyles(),
      variantStyles[variant]?.(),
      sizeStyles[size]?.()
    ].filter(Boolean).join(' ')
  }, [variant, size])
  
  return <button className={className}>{children}</button>
}
```

### 类型安全增强

```tsx
// 增强类型安全
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const createButtonStyle = (props: ButtonProps) => css({
  // TypeScript 会检查属性类型
  backgroundColor: props.variant === 'primary' ? '#007bff' : '#6c757d',
  padding: props.size === 'lg' ? 20 : 16,
  opacity: props.disabled ? 0.6 : 1
})
```

## 📚 迁移资源

### 自动化迁移工具

> ⚠️ **TODO**: 自动化迁移工具尚在开发中，敬请期待！

未来将提供自动化迁移工具来简化迁移过程：

```bash
# 安装迁移工具（计划中）
npm install -g @whl1024/cssinjs-migrate

# 迁移 styled-components
cssinjs-migrate --from styled-components --to cssinjs ./src

# 迁移 emotion
cssinjs-migrate --from emotion --to cssinjs ./src
```

在自动化工具发布之前,您可以:
- 参考上述手动迁移示例
- 使用本文档提供的迁移脚本
- 逐步进行小规模迁移测试

## 📚 下一步

- 查看 [入门指南](./getting-started.md) 了解基础用法
- 学习 [高级功能](./advanced-features.md) 利用新功能
- 查看 [性能优化](./performance.md) 优化迁移后的性能
- 参考 [API 文档](./api-reference.md) 了解完整功能