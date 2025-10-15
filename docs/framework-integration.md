# 框架集成

本文档展示如何将 cssinjs 库与各种前端框架集成。

## 🖖 Vue.js 集成

### 推荐模式：CSS 变量 + 主题代理

这是 Vue.js 集成的最佳实践：
- ✅ **性能最优**：CSS 变量更新无需重新生成样式
- ✅ **响应式友好**：主题切换仅更新变量值，不重新计算样式
- ✅ **代码简洁**：样式定义更直观，避免大量 computed
- ✅ **类型安全**：完整的 TypeScript 支持

#### 基础集成示例

```typescript
<template>
  <div :class="containerClass">
    <h2>{{ title }}</h2>
    <button 
      :class="buttonClass"
      @click="handleClick"
    >
      {{ buttonText }}
    </button>
    <div :class="cardClass">
      <p>这是一个响应主题的卡片</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { css, createThemeProxy } from '@whl1024/cssinjs'

interface Props {
  title?: string
  buttonText?: string
}

const { title = '示例标题', buttonText = '点击按钮' } = defineProps<Props>()

// 定义主题对象（响应式）
const theme = ref({
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    border: '#dee2e6'
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32
  },
  fontSize: {
    sm: 12, md: 16, lg: 20, xl: 24
  },
  borderRadius: {
    sm: 4, md: 8, lg: 12
  }
})

// 创建主题代理（自动注入 CSS 变量到页面）
const themeProxy = createThemeProxy(theme.value)

// 使用 CSS 变量定义样式（只需定义一次）
const containerClass = css({
  padding: themeProxy.spacing.lg,
  backgroundColor: themeProxy.colors.background,
  borderRadius: themeProxy.borderRadius.md,
  color: themeProxy.colors.text,
  minHeight: 400,
  
  '& h2': {
    margin: 0,
    marginBottom: themeProxy.spacing.md,
    fontSize: themeProxy.fontSize.xl,
    color: themeProxy.colors.primary
  }
})()

const buttonClass = css({
  backgroundColor: themeProxy.colors.primary,
  color: 'white',
  padding: `${themeProxy.spacing.sm} ${themeProxy.spacing.md}`,
  fontSize: themeProxy.fontSize.md,
  border: 'none',
  borderRadius: themeProxy.borderRadius.sm,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    opacity: 0.9,
    transform: 'translateY(-1px)'
  }
})()

const cardClass = css({
  backgroundColor: themeProxy.colors.surface,
  padding: themeProxy.spacing.md,
  marginTop: themeProxy.spacing.md,
  borderRadius: themeProxy.borderRadius.md,
  border: `1px solid ${themeProxy.colors.border}`,
  color: themeProxy.colors.text
})()

// 主题切换函数
const toggleTheme = () => {
  const isDark = theme.value.colors.background === '#ffffff'
  
  const newTheme = isDark ? {
    colors: {
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      danger: '#dc3545',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      border: '#404040'
    },
    spacing: theme.value.spacing,
    fontSize: theme.value.fontSize,
    borderRadius: theme.value.borderRadius
  } : {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#212529',
      border: '#dee2e6'
    },
    spacing: theme.value.spacing,
    fontSize: theme.value.fontSize,
    borderRadius: theme.value.borderRadius
  }
  
  theme.value = newTheme
  createThemeProxy(newTheme) // 自动更新 CSS 变量
}

const handleClick = () => {
  toggleTheme()
}
</script>
```

#### Vue Composition API 集成

```typescript
// composables/useTheme.ts
import { ref, reactive } from 'vue'
import { createThemeProxy, configureCSSVariables } from '@whl1024/cssinjs'

interface Theme {
  colors: Record<string, string>
  spacing: Record<string, number>
  typography: Record<string, any>
}

const defaultTheme: Theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529'
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32
  },
  typography: {
    fontFamily: 'system-ui, sans-serif',
    fontSize: { sm: 12, md: 16, lg: 20 }
  }
}

export function useTheme() {
  const currentTheme = ref<Theme>(defaultTheme)
  const isDark = ref(false)
  
  // 配置 CSS 变量系统
  configureCSSVariables({
    prefix: 'app',
    autoInject: true
  })
  
  // 创建主题代理
  const themeProxy = createThemeProxy(currentTheme.value)
  
  const toggleTheme = () => {
    isDark.value = !isDark.value
    
    const newTheme = isDark.value ? {
      colors: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        background: '#1a1a1a',
        text: '#ffffff'
      },
      spacing: currentTheme.value.spacing,
      typography: currentTheme.value.typography
    } : defaultTheme
    
    currentTheme.value = newTheme
    createThemeProxy(newTheme)
  }
  
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    createThemeProxy(theme)
  }
  
  return {
    theme: themeProxy,
    currentTheme,
    isDark,
    toggleTheme,
    setTheme
  }
}
```

#### Vue 组件化样式

```vue
<!-- Button.vue -->
<template>
  <button :class="buttonClass" @click="$emit('click')">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { css } from '@whl1024/cssinjs'
import { useTheme } from '@/composables/useTheme'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const { theme } = useTheme()

const buttonClass = computed(() => {
  const baseStyle = css({
    border: 'none',
    borderRadius: theme.borderRadius.sm,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    fontFamily: theme.typography.fontFamily,
    
    '&:hover': !props.disabled ? {
      transform: 'translateY(-1px)'
    } : undefined
  })
  
  const variantStyle = css({
    backgroundColor: theme.colors[props.variant],
    color: 'white'
  })
  
  const sizeStyle = css({
    padding: props.size === 'lg' ? theme.spacing.lg : 
             props.size === 'sm' ? theme.spacing.sm : theme.spacing.md,
    fontSize: theme.typography.fontSize[props.size]
  })
  
  return `${baseStyle()} ${variantStyle()} ${sizeStyle()}`
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

## ⚛️ React 集成

### React Hooks 集成

```tsx
// hooks/useTheme.ts
import { useState, useMemo, createContext, useContext } from 'react'
import { css, createThemeProxy, configure } from '@whl1024/cssinjs'

interface Theme {
  colors: Record<string, string>
  spacing: Record<string, number>
  fonts: { sizes: Record<string, number> }
}

const defaultTheme: Theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#212529'
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32
  },
  fonts: {
    sizes: { sm: 12, md: 16, lg: 20, xl: 24 }
  }
}

const ThemeContext = createContext<{
  theme: any
  toggleTheme: () => void
  isDark: boolean
}>({
  theme: defaultTheme,
  toggleTheme: () => {},
  isDark: false
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(defaultTheme)
  
  // 配置库
  configure({
    classNamePrefix: 'app',
    enableCache: true,
    developmentMode: process.env.NODE_ENV === 'development'
  })
  
  const themeProxy = useMemo(() => 
    createThemeProxy(currentTheme), [currentTheme]
  )
  
  const toggleTheme = () => {
    const newTheme = !isDark ? {
      colors: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        background: '#1a1a1a',
        text: '#ffffff'
      },
      spacing: currentTheme.spacing,
      fonts: currentTheme.fonts
    } : defaultTheme
    
    setCurrentTheme(newTheme)
    setIsDark(!isDark)
    createThemeProxy(newTheme)
  }
  
  return (
    <ThemeContext.Provider value={{ 
      theme: themeProxy, 
      toggleTheme, 
      isDark 
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### React 组件示例

```tsx
// Button.tsx
import React from 'react'
import { css } from '@whl1024/cssinjs'
import { useTheme } from './hooks/useTheme'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onClick
}: ButtonProps) {
  const { theme } = useTheme()
  
  const buttonClass = useMemo(() => {
    const baseStyle = css({
      border: 'none',
      borderRadius: 4,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s ease',
      
      '&:hover': !disabled ? {
        transform: 'translateY(-1px)'
      } : undefined
    })
    
    const variantStyle = css({
      backgroundColor: theme.colors[variant],
      color: 'white'
    })
    
    const sizeStyle = css({
      padding: size === 'lg' ? theme.spacing.lg : 
               size === 'sm' ? theme.spacing.sm : theme.spacing.md,
      fontSize: theme.fonts.sizes[size]
    })
    
    return `${baseStyle()} ${variantStyle()} ${sizeStyle()}`
  }, [theme, variant, size, disabled])
  
  return (
    <button 
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

## 🅰️ Angular 集成

### Angular Service

```typescript
// theme.service.ts
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { createThemeProxy, configureCSSVariables } from '@whl1024/cssinjs'

interface Theme {
  colors: Record<string, string>
  spacing: Record<string, number>
  typography: Record<string, any>
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private defaultTheme: Theme = {
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      text: '#212529'
    },
    spacing: {
      xs: 4, sm: 8, md: 16, lg: 24, xl: 32
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: { sm: 12, md: 16, lg: 20 }
    }
  }
  
  private currentTheme = new BehaviorSubject<Theme>(this.defaultTheme)
  private isDark = new BehaviorSubject<boolean>(false)
  
  public theme$ = this.currentTheme.asObservable()
  public isDark$ = this.isDark.asObservable()
  public themeProxy: any
  
  constructor() {
    configureCSSVariables({
      prefix: 'ng-app',
      autoInject: true
    })
    
    this.themeProxy = createThemeProxy(this.defaultTheme)
  }
  
  toggleTheme(): void {
    const newIsDark = !this.isDark.value
    
    const newTheme = newIsDark ? {
      colors: {
        primary: '#0d6efd',
        background: '#1a1a1a',
        text: '#ffffff'
      },
      spacing: this.currentTheme.value.spacing,
      typography: this.currentTheme.value.typography
    } : this.defaultTheme
    
    this.currentTheme.next(newTheme)
    this.isDark.next(newIsDark)
    this.themeProxy = createThemeProxy(newTheme)
  }
  
  setTheme(theme: Theme): void {
    this.currentTheme.next(theme)
    this.themeProxy = createThemeProxy(theme)
  }
}
```

### Angular 组件

```typescript
// button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core'
import { css } from '@whl1024/cssinjs'
import { ThemeService } from './theme.service'

@Component({
  selector: 'app-button',
  template: `
    <button 
      [class]="buttonClass"
      [disabled]="disabled"
      (click)="onClick()"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary'
  @Input() size: 'sm' | 'md' | 'lg' = 'md'
  @Input() disabled = false
  @Output() buttonClick = new EventEmitter<void>()
  
  constructor(private themeService: ThemeService) {}
  
  get buttonClass(): string {
    const theme = this.themeService.themeProxy
    
    const baseStyle = css({
      border: 'none',
      borderRadius: 4,
      cursor: this.disabled ? 'not-allowed' : 'pointer',
      opacity: this.disabled ? 0.6 : 1,
      transition: 'all 0.2s ease'
    })
    
    const variantStyle = css({
      backgroundColor: theme.colors[this.variant],
      color: 'white'
    })
    
    const sizeStyle = css({
      padding: this.size === 'lg' ? theme.spacing.lg : 
               this.size === 'sm' ? theme.spacing.sm : theme.spacing.md,
      fontSize: theme.typography.fontSize[this.size]
    })
    
    return `${baseStyle()} ${variantStyle()} ${sizeStyle()}`
  }
  
  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit()
    }
  }
}
```

## 🛠 通用集成模式

### 1. 静态样式分离

```typescript
// styles/components.ts
import { css } from '@whl1024/cssinjs'

// 将静态样式定义在组件外部
export const baseButton = css({
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
})

export const card = css({
  backgroundColor: 'white',
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: 16
})
```

### 2. 主题工厂函数

```typescript
// utils/theme.ts
import { createThemeProxy } from '@whl1024/cssinjs'

export function createAppTheme(colors: Record<string, string>) {
  const theme = {
    colors,
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      fontSize: { sm: 12, md: 16, lg: 20, xl: 24 }
    }
  }
  
  return createThemeProxy(theme)
}

// 预定义主题
export const lightTheme = createAppTheme({
  primary: '#007bff',
  background: '#ffffff',
  text: '#212529'
})

export const darkTheme = createAppTheme({
  primary: '#0d6efd',
  background: '#1a1a1a',
  text: '#ffffff'
})
```

### 3. SSR 支持

```typescript
// 服务端渲染支持
import { configure } from '@whl1024/cssinjs'

// 服务端配置
configure({
  enableCache: false,  // SSR 时禁用缓存
  insertionMode: 'append'
})

// 样式会自动注入到 <head> 中
// 在服务端渲染时，确保在渲染组件前配置好库
// 渲染完成后，<head> 中会包含所有生成的 <style> 标签
```

**注意**：目前库会自动将样式注入到 DOM 中。如果需要手动管理 SSR 的 CSS 提取，可以在渲染完成后收集 `<head>` 中的所有 `<style>` 标签。

```typescript
// 获取所有样式标签（可选，用于 SSR）
const styleElements = document.head.querySelectorAll('style[data-css-injected]')
const cssText = Array.from(styleElements)
  .map(el => el.textContent)
  .join('\n')
```

## 📚 最佳实践

### 1. 性能优化
- 将静态样式定义在组件外部
- 使用 CSS 变量而不是 computed 样式
- 在生产环境启用样式缓存

### 2. 类型安全
- 定义主题类型接口
- 使用 TypeScript 严格模式
- 为样式 props 定义类型

### 3. 代码组织
- 按功能模块组织样式
- 使用样式工厂函数
- 分离静态和动态样式

## 📚 下一步

- 查看 [性能优化](./performance.md) 了解性能优化技巧
- 学习 [API 参考](./api-reference.md) 了解完整的 API
- 查看 [配置选项](./configuration.md) 了解详细配置