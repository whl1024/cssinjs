/**
 * CSS变量自动生成系统
 * 
 * 特性：
 * - 动态前缀配置
 * - 简单防重复机制
 * - 自动注入CSS变量到页面
 * - 主题代理系统
 * - 支持任意主题对象结构
 */

/**
 * CSS变量配置
 */
export interface VariableConfig {
  /** CSS变量前缀，默认为 'css-var' */
  prefix?: string
  /** 是否自动注入CSS变量到页面，默认为 true */
  autoInject?: boolean
  /** 目标容器选择器，默认为 ':root' */
  target?: string
}

/**
 * CSS 变量管理器
 * 
 * 负责管理和注入 CSS 自定义属性（CSS Variables）
 */
class VariableManager {
  private config: Required<VariableConfig>
  private injectedVariables = new Map<string, string>() // 改为Map来存储变量名和值
  private styleElement: HTMLStyleElement | null = null

  constructor(config: VariableConfig = {}) {
    this.config = {
      prefix: config.prefix || 'css-var',
      autoInject: config.autoInject ?? true,
      target: config.target || ':root'
    }
    
    if (typeof window !== 'undefined' && this.config.autoInject) {
      this.initStyleElement()
    }
  }

  /**
   * 初始化样式元素
   */
  private initStyleElement() {
    this.styleElement = document.createElement('style')
    this.styleElement.setAttribute('data-css-variables', this.config.prefix)
    document.head.appendChild(this.styleElement)
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<VariableConfig>) {
    const oldPrefix = this.config.prefix
    Object.assign(this.config, config)
    
    // 如果前缀变化，清空已注入的变量并重新生成
    if (config.prefix && config.prefix !== oldPrefix) {
      this.injectedVariables.clear()
      if (this.styleElement) {
        this.styleElement.textContent = ''
      }
    }
  }

  /**
   * 将主题对象转换为CSS变量键值对
   * 支持任意主题对象结构的递归转换
   */
  themeToVariables<T extends Record<string, any>>(theme: T): Record<string, string> {
    const variables: Record<string, string> = {}
    
    const processValue = (value: any, path: string[]): void => {
      if (value === null || value === undefined) return
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        // 递归处理对象
        Object.entries(value).forEach(([key, val]) => {
          processValue(val, [...path, key])
        })
      } else {
        // 基础值，转换为CSS变量
        const variableName = `--${this.config.prefix}-${path.join('-')}`
        const variableValue = typeof value === 'number' && path[0] !== 'weights' && path[0] !== 'weight' 
          ? `${value}px` 
          : String(value)
        variables[variableName] = variableValue
      }
    }
    
    // 处理主题对象的每个顶级属性
    Object.entries(theme).forEach(([category, categoryValue]) => {
      processValue(categoryValue, [category])
    })
    
    return variables
  }

  /**
   * 注入CSS变量到页面
   */
  injectVariables(variables: Record<string, string>) {
    if (!this.config.autoInject || !this.styleElement) return
    
    // 更新变量映射
    Object.entries(variables).forEach(([key, value]) => {
      this.injectedVariables.set(key, value)
    })
    
    // 生成完整的CSS规则
    const cssRules = Array.from(this.injectedVariables.entries()).map(([key, value]) => 
      `  ${key}: ${value};`
    )
    
    if (cssRules.length > 0) {
      // 完全重写样式内容以确保变量更新
      const newContent = `${this.config.target} {\n${cssRules.join('\n')}\n}`
      this.styleElement.textContent = newContent
    }
  }

  /**
   * 获取CSS变量名
   */
  getVariableName(category: string, key: string): string {
    return `--${this.config.prefix}-${category}-${key}`
  }

  /**
   * 获取前缀
   */
  getPrefix(): string {
    return this.config.prefix
  }

  /**
   * 获取CSS变量引用
   */
  getVariableReference(category: string, key: string): string {
    return `var(${this.getVariableName(category, key)})`
  }

  /**
   * 清空所有已注入的变量
   */
  clear() {
    this.injectedVariables.clear()
    if (this.styleElement) {
      this.styleElement.textContent = ''
    }
  }

  /**
   * 销毁管理器
   */
  destroy() {
    if (this.styleElement) {
      this.styleElement.remove()
      this.styleElement = null
    }
    this.injectedVariables.clear()
  }
}

// 全局CSS变量管理器实例
/**
 * 全局单例管理器
 */
let globalManager: VariableManager | null = null

/**
 * 获取全局 CSS 变量管理器单例
 */
export function getCSSVariableManager(): VariableManager {
  if (!globalManager) {
    globalManager = new VariableManager()
  }
  return globalManager
}

/**
 * 配置CSS变量系统
 */
export function configureCSSVariables(config: VariableConfig) {
  const manager = getCSSVariableManager()
  manager.updateConfig(config)
  return manager
}

/**
 * 主题代理创建器
 * 支持任意主题对象结构的动态代理
 */
export function createThemeProxy<T extends Record<string, any>>(theme: T): T {
  const manager = getCSSVariableManager()
  const variables = manager.themeToVariables(theme)
  
  // 自动注入CSS变量
  manager.injectVariables(variables)
  
  // 创建递归代理函数
  const createProxy = (obj: any, path: string[] = []): any => {
    if (obj === null || obj === undefined || typeof obj !== 'object' || Array.isArray(obj)) {
      return obj
    }
    
    return new Proxy(obj, {
      get(target, prop) {
        const value = target[prop]
        const currentPath = [...path, String(prop)]
        
        if (value === null || value === undefined) {
          return value
        }
        
        // 如果是对象，继续代理
        if (typeof value === 'object' && !Array.isArray(value)) {
          return createProxy(value, currentPath)
        }
        
        // 如果是基础值，返回CSS变量引用
        const variableName = `--${manager.getPrefix()}-${currentPath.join('-')}`
        return `var(${variableName})`
      }
    })
  }
  
  return createProxy(theme) as T
}

/**
 * 手动注入主题变量
 */
export function injectThemeVariables<T extends Record<string, any>>(theme: T, config?: VariableConfig) {
  const manager = config ? new VariableManager(config) : getCSSVariableManager()
  const variables = manager.themeToVariables(theme)
  manager.injectVariables(variables)
  return variables
}

/**
 * 获取主题的CSS变量映射
 */
export function getThemeVariables<T extends Record<string, any>>(theme: T, prefix?: string): Record<string, string> {
  const manager = prefix ? new VariableManager({ prefix, autoInject: false }) : getCSSVariableManager()
  return manager.themeToVariables(theme)
}