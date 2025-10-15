/**
 * CSS解析器模块
 * 
 * 负责将JavaScript样式对象转换为CSS文本和规则
 * 支持嵌套选择器、伪类、媒体查询等CSS特性
 */

import {
  kebabCase,
  addUnit,
  normalizeValue,
  escapeSelector,
  isBrowser,
  safeLog
} from './utils'
import type {
  CSSProperties,
  KeyframesDefinition,
  GlobalStyles,
  ParseResult
} from './types'

/**
 * CSS解析器类
 * 
 * 使用单例模式，确保全局只有一个解析器实例
 * 负责样式对象到CSS文本的转换和CSS规则的DOM注入
 */
export class CSSParser {
  // 单例实例
  private static instance: CSSParser
  
  // 样式表引用，用于CSS规则注入
  private styleSheet: CSSStyleSheet | null = null
  
  // 样式标签引用
  private styleElement: HTMLStyleElement | null = null
  
  // 是否已初始化
  private initialized = false

  /**
   * 私有构造函数，实现单例模式
   */
  private constructor() {
    // 在浏览器环境中初始化样式标签
    if (isBrowser()) {
      this.initializeStyleElement()
    }
  }

  /**
   * 获取CSS解析器单例实例
   * 
   * @returns CSS解析器实例
   */
  static getInstance(): CSSParser {
    if (!CSSParser.instance) {
      CSSParser.instance = new CSSParser()
    }
    return CSSParser.instance
  }

  /**
   * 初始化样式标签
   * 
   * 在document的head中创建用于注入CSS规则的style标签
   */
  private initializeStyleElement(): void {
    if (this.initialized || !isBrowser()) {
      return
    }

    try {
      // 检查是否已存在我们的样式标签
      let existingStyle = document.getElementById('css-in-js-styles') as HTMLStyleElement
      
      if (!existingStyle) {
        // 创建新的样式标签
        existingStyle = document.createElement('style')
        existingStyle.id = 'css-in-js-styles'
        existingStyle.type = 'text/css'
        
        // 添加样式标签标识注释
        existingStyle.appendChild(document.createTextNode('/* CSS-in-JS Generated Styles */\n'))
        
        // 插入到head的末尾
        document.head.appendChild(existingStyle)
        
        safeLog('CSS解析器：样式标签已创建')
      }

      this.styleElement = existingStyle
      this.styleSheet = existingStyle.sheet

      this.initialized = true
      safeLog('CSS解析器：初始化完成')
      
    } catch (error) {
      safeLog(`CSS解析器初始化失败: ${error}`, 'error')
    }
  }

  /**
   * 设置自定义样式标签
   * 
   * 允许用户指定自定义的样式插入位置
   * 
   * @param element 目标HTML元素或选择器
   */
  setStyleElement(element: HTMLStyleElement | string): void {
    if (!isBrowser()) {
      return
    }

    try {
      let targetElement: HTMLStyleElement | null = null

      if (typeof element === 'string') {
        // 通过选择器查找元素
        targetElement = document.querySelector(element) as HTMLStyleElement
      } else {
        // 直接使用传入的元素
        targetElement = element
      }

      if (targetElement && targetElement.tagName.toLowerCase() === 'style') {
        this.styleElement = targetElement
        this.styleSheet = targetElement.sheet
        this.initialized = true
        
        safeLog('CSS解析器：自定义样式标签已设置')
      } else {
        safeLog('无效的样式元素', 'error')
      }
    } catch (error) {
      safeLog(`设置样式元素失败: ${error}`, 'error')
    }
  }

  /**
   * 解析样式对象为CSS文本
   * 
   * 将JavaScript样式对象转换为标准CSS文本
   * 
   * @param styles CSS属性对象
   * @param className 类名（可选）
   * @returns 解析结果对象
   */
  parseStyles(styles: CSSProperties, className?: string): ParseResult {
    const cssRules: string[] = []
    let propertyCount = 0
    let hasNestedRules = false

    // 生成主要CSS规则
    const mainRule = this.parseStyleObject(styles, className)
    if (mainRule.cssText) {
      cssRules.push(mainRule.cssText)
      propertyCount += mainRule.propertyCount
      hasNestedRules = hasNestedRules || mainRule.hasNestedRules
    }

    const cssText = cssRules.join('\n')
    const finalClassName = className || ''

    return {
      cssText,
      className: finalClassName,
      propertyCount,
      hasNestedRules
    }
  }

  /**
   * 解析样式对象（内部方法）
   * 
   * 递归解析样式对象，处理嵌套规则
   * 
   * @param styles CSS属性对象
   * @param className 类名
   * @param parentSelector 父选择器
   * @returns 解析结果
   */
  private parseStyleObject(
    styles: CSSProperties,
    className?: string,
    parentSelector: string = ''
  ): { cssText: string; propertyCount: number; hasNestedRules: boolean } {
    const baseSelector = className ? `.${escapeSelector(className)}` : parentSelector
    const declarations: string[] = []
    const nestedRules: string[] = []
    let propertyCount = 0
    let hasNestedRules = false

    for (const [property, value] of Object.entries(styles)) {
      if (value === undefined || value === null) {
        continue
      }

      if (property.startsWith('&')) {
        // 处理伪类和伪元素选择器
        // 例如: '&:hover', '&::before', '&:focus'
        const pseudoSelector = property.replace('&', baseSelector)
        const nestedResult = this.parseStyleObject(
          value as CSSProperties,
          undefined,
          pseudoSelector
        )
        
        if (nestedResult.cssText) {
          nestedRules.push(nestedResult.cssText)
          hasNestedRules = true
          propertyCount += nestedResult.propertyCount
        }
        
      } else if (property.startsWith('@')) {
        // 处理媒体查询和其他@规则
        // 例如: '@media (max-width: 768px)', '@supports (display: grid)'
        const atRule = property
        const nestedResult = this.parseStyleObject(
          value as CSSProperties,
          className,
          parentSelector
        )
        
        if (nestedResult.cssText) {
          nestedRules.push(`${atRule} {\n${nestedResult.cssText}\n}`)
          hasNestedRules = true
          propertyCount += nestedResult.propertyCount
        }
        
      } else if (typeof value === 'object') {
        // 处理嵌套选择器
        // 例如: 'span', '.child', '> div'
        const nestedSelector = `${baseSelector} ${property}`
        const nestedResult = this.parseStyleObject(
          value as CSSProperties,
          undefined,
          nestedSelector
        )
        
        if (nestedResult.cssText) {
          nestedRules.push(nestedResult.cssText)
          hasNestedRules = true
          propertyCount += nestedResult.propertyCount
        }
        
      } else {
        // 处理普通CSS属性
        const cssProperty = kebabCase(property)
        const cssValue = addUnit(property, value)
        const normalizedValue = normalizeValue(cssValue)
        
        declarations.push(`  ${cssProperty}: ${normalizedValue};`)
        propertyCount++
      }
    }

    // 生成CSS文本
    let cssText = ''
    
    // 添加主要规则
    if (declarations.length > 0) {
      cssText += `${baseSelector} {\n${declarations.join('\n')}\n}`
    }
    
    // 添加嵌套规则
    if (nestedRules.length > 0) {
      if (cssText) cssText += '\n'
      cssText += nestedRules.join('\n')
    }

    return { cssText, propertyCount, hasNestedRules }
  }

  /**
   * 生成完整的CSS规则
   * 
   * 为指定类名生成完整的CSS规则文本
   * 
   * @param className CSS类名
   * @param styles CSS属性对象
   * @returns CSS规则文本
   */
  generateCSSRule(className: string, styles: CSSProperties): string {
    const result = this.parseStyles(styles, className)
    return result.cssText
  }

  /**
   * 解析关键帧动画
   * 
   * 将关键帧对象转换为CSS @keyframes 规则
   * 
   * @param keyframes 关键帧定义对象
   * @returns CSS文本
   */
  parseKeyframes(keyframes: KeyframesDefinition): string {
    const keyframeRules: string[] = []

    for (const [keyframe, styles] of Object.entries(keyframes)) {
      const declarations: string[] = []
      
      for (const [property, value] of Object.entries(styles)) {
        if (value !== undefined && value !== null && typeof value !== 'object') {
          const cssProperty = kebabCase(property)
          const cssValue = addUnit(property, value as string | number)
          const normalizedValue = normalizeValue(cssValue)
          
          declarations.push(`    ${cssProperty}: ${normalizedValue};`)
        }
      }

      if (declarations.length > 0) {
        keyframeRules.push(`  ${keyframe} {\n${declarations.join('\n')}\n  }`)
      }
    }

    return keyframeRules.join('\n')
  }

  /**
   * 生成关键帧CSS规则
   * 
   * 创建完整的@keyframes规则
   * 
   * @param animationName 动画名称
   * @param keyframes 关键帧定义
   * @returns 完整的@keyframes规则
   */
  generateKeyframesRule(animationName: string, keyframes: KeyframesDefinition): string {
    const keyframesCSS = this.parseKeyframes(keyframes)
    return `@keyframes ${animationName} {\n${keyframesCSS}\n}`
  }

  /**
   * 生成全局CSS
   * 
   * 处理全局样式规则
   * 
   * @param styles 全局样式对象
   * @returns CSS规则文本
   */
  generateGlobalCSS(styles: GlobalStyles): string {
    const rules: string[] = []

    for (const [selector, styleObj] of Object.entries(styles)) {
      if (typeof styleObj === 'object') {
        const result = this.parseStyleObject(styleObj, undefined, selector)
        if (result.cssText) {
          rules.push(result.cssText)
        }
      }
    }

    return rules.join('\n')
  }

  /**
   * 注入CSS规则到DOM
   * 
   * 将CSS规则添加到样式表中
   * 
   * @param cssText CSS规则文本
   * @returns 是否成功注入
   */
  injectCSS(cssText: string): boolean {
    if (!cssText.trim()) {
      return false
    }

    // 确保解析器已初始化
    if (!this.initialized && isBrowser()) {
      this.initializeStyleElement()
    }

    try {
      if (this.styleSheet && this.styleSheet.insertRule) {
        // 分割多个CSS规则
        const rules = this.splitCSSRules(cssText)
        
        for (const rule of rules) {
          if (rule.trim()) {
            try {
              const ruleIndex = this.styleSheet.cssRules.length
              this.styleSheet.insertRule(rule, ruleIndex)
            } catch (ruleError) {
              // 如果单个规则插入失败，尝试降级方案
              safeLog(`单个CSS规则插入失败，使用降级方案: ${ruleError}`, 'warn')
              if (this.styleElement) {
                this.styleElement.textContent += '\n' + rule
              }
            }
          }
        }
        
        safeLog(`CSS规则已注入: ${cssText.substring(0, 50)}...`)
        return true
        
      } else if (this.styleElement) {
        // 直接修改textContent（兼容老浏览器）
        this.styleElement.textContent += '\n' + cssText
        
        safeLog(`CSS规则已添加: ${cssText.substring(0, 50)}...`)
        return true
      }
      
    } catch (error) {
      safeLog(`CSS注入失败: ${error}`, 'error')
      
      // 降级方案：直接添加到textContent
      if (this.styleElement) {
        try {
          this.styleElement.textContent += '\n' + cssText
          return true
        } catch (fallbackError) {
          safeLog(`CSS注入降级方案也失败: ${fallbackError}`, 'error')
        }
      }
    }

    return false
  }

  /**
   * 分割CSS规则
   * 
   * 将包含多个规则的CSS文本分割为单个规则数组
   * 
   * @param cssText CSS规则文本
   * @returns 单个规则的数组
   */
  private splitCSSRules(cssText: string): string[] {
    const rules: string[] = []
    let currentRule = ''
    let braceCount = 0
    let inString = false
    let stringChar = ''
    
    for (let i = 0; i < cssText.length; i++) {
      const char = cssText[i]
      const prevChar = i > 0 ? cssText[i - 1] : ''
      
      // 处理字符串（引号内的内容）
      if ((char === '"' || char === "'") && prevChar !== '\\') {
        if (!inString) {
          inString = true
          stringChar = char
        } else if (char === stringChar) {
          inString = false
          stringChar = ''
        }
      }
      
      currentRule += char
      
      if (!inString) {
        if (char === '{') {
          braceCount++
        } else if (char === '}') {
          braceCount--
          
          // 如果大括号计数回到0，表示一个完整的规则结束
          if (braceCount === 0) {
            rules.push(currentRule.trim())
            currentRule = ''
          }
        }
      }
    }
    
    // 如果还有剩余内容，也加入规则数组
    if (currentRule.trim()) {
      rules.push(currentRule.trim())
    }
    
    return rules
  }

  /**
   * 清除所有CSS规则
   * 
   * 移除所有注入的CSS规则
   */
  clearAllRules(): void {
    if (!isBrowser() || !this.styleElement) {
      return
    }

    try {
      // 清空样式标签内容，但保留标识注释
      this.styleElement.textContent = '/* CSS-in-JS Generated Styles */\n'
      
      safeLog('所有CSS规则已清除')
    } catch (error) {
      safeLog(`清除CSS规则失败: ${error}`, 'error')
    }
  }

  /**
   * 获取当前所有CSS规则
   * 
   * @returns 当前所有的CSS规则文本
   */
  getAllRules(): string {
    if (!this.styleElement) {
      return ''
    }

    return this.styleElement.textContent || ''
  }

  /**
   * 获取CSS规则数量
   * 
   * @returns 当前CSS规则的数量
   */
  getRuleCount(): number {
    if (!this.styleSheet) {
      return 0
    }

    try {
      return this.styleSheet.cssRules.length
    } catch (error) {
      // 某些情况下访问cssRules可能失败
      return 0
    }
  }

  /**
   * 检查解析器是否已准备就绪
   * 
   * @returns 是否已初始化并可以使用
   */
  isReady(): boolean {
    return this.initialized && (this.styleSheet !== null || this.styleElement !== null)
  }

  /**
   * 销毁解析器实例
   * 
   * 清理资源，重置单例实例
   */
  destroy(): void {
    this.clearAllRules()
    
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement)
    }
    
    this.styleElement = null
    this.styleSheet = null
    this.initialized = false
    
    // 重置单例实例
    CSSParser.instance = null as any
    
    safeLog('CSS解析器已销毁')
  }
}