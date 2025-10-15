/**
 * 样式管理器模块
 * 
 * 负责样式的缓存、去重、生成和管理
 * 提供高性能的样式处理能力，避免重复生成相同的样式
 */

import { CSSParser } from './parser'
import {
  generateClassName,
  generateAnimationName,
  createCacheKey,
  deepClone,
  safeLog,
  debounce
} from './utils'
import type {
  CSSProperties,
  KeyframesDefinition,
  GlobalStyles,
  CSSInJSConfig,
  StyleMetadata,
  StyleCacheKey,
  CSSOptions
} from './types'
import { StyleInsertionMode } from './types'

/**
 * 样式缓存项接口
 * 存储样式的详细信息和元数据
 */
interface StyleCacheItem {
  className: string           // 生成的CSS类名
  cssText: string            // 生成的CSS文本
  metadata: StyleMetadata    // 样式元数据
  lastUsed: number          // 最后使用时间戳
  useCount: number          // 使用次数
}

/**
 * 动画缓存项接口
 */
interface AnimationCacheItem {
  animationName: string      // 生成的动画名称
  cssText: string           // 生成的CSS文本
  metadata: StyleMetadata   // 动画元数据
  lastUsed: number         // 最后使用时间戳
  useCount: number         // 使用次数
}

/**
 * 样式管理器类
 * 
 * 使用单例模式，负责整个应用的样式管理
 * 提供样式缓存、去重、生成和注入功能
 */
export class StyleManager {
  // 单例实例
  private static instance: StyleManager

  // CSS解析器实例
  private parser: CSSParser

  // 样式缓存 - 键为样式内容的哈希，值为缓存项
  private styleCache = new Map<StyleCacheKey, StyleCacheItem>()

  // 动画缓存 - 键为关键帧内容的哈希，值为缓存项
  private animationCache = new Map<StyleCacheKey, AnimationCacheItem>()

  // 已注入的CSS规则集合，用于去重
  private injectedRules = new Set<string>()

  // 库配置
  private config: CSSInJSConfig = {
    classNamePrefix: 'css',
    insertionMode: StyleInsertionMode.SYNC,
    enableCache: true,
    developmentMode: false,
    minifyCSS: false,
    maxCacheSize: 10000
  }

  // 性能统计
  private stats = {
    totalStyles: 0,          // 总样式数量
    cacheHits: 0,           // 缓存命中次数
    cacheMisses: 0,         // 缓存未命中次数
    injectionTime: 0,       // 总注入时间
    lastCleanup: Date.now() // 上次清理时间
  }

  // 防抖的缓存清理函数
  private debouncedCleanup = debounce(() => this.cleanupCache(), 5000)

  /**
   * 私有构造函数，实现单例模式
   */
  private constructor() {
    this.parser = CSSParser.getInstance()
    
    // 定期清理缓存
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.performMaintenance(), 60000) // 每分钟执行一次
    }
    
    safeLog('样式管理器：初始化完成')
  }

  /**
   * 获取样式管理器单例实例
   * 
   * @returns 样式管理器实例
   */
  static getInstance(): StyleManager {
    if (!StyleManager.instance) {
      StyleManager.instance = new StyleManager()
    }
    return StyleManager.instance
  }

  /**
   * 配置样式管理器
   * 
   * 更新管理器的配置选项
   * 
   * @param newConfig 新的配置选项
   */
  configure(newConfig: Partial<CSSInJSConfig>): void {
    // 深度合并配置
    this.config = { ...this.config, ...newConfig }
    
    safeLog(`样式管理器：配置已更新`, 'log')
    
    // 如果禁用了缓存，清空现有缓存
    if (!this.config.enableCache) {
      this.clearCache()
    }
  }

  /**
   * 获取当前配置
   * 
   * @returns 当前配置的副本
   */
  getConfig(): CSSInJSConfig {
    return deepClone(this.config)
  }

  /**
   * 创建CSS样式
   * 
   * 根据样式对象生成CSS类名，处理缓存和去重
   * 支持自动生成哈希类名或自定义类名
   * 
   * @param styles CSS属性对象
   * @param options CSS生成选项
   * @returns 生成的CSS类名
   */
  createStyle(styles: CSSProperties, options?: CSSOptions): string {
    const startTime = performance.now()
    
    try {
      // 合并配置
      const finalOptions = {
        classNamePrefix: options?.classNamePrefix !== undefined 
          ? options.classNamePrefix 
          : (this.config.classNamePrefix || 'css'),
        className: options?.className,
        enableCSSVariables: options?.enableCSSVariables ?? true
      }
      
      // 生成缓存键（包含选项信息）
      const cacheKey = this.config.enableCache ? createCacheKey(styles, finalOptions) : ''
      
      // 检查缓存
      if (this.config.enableCache && this.styleCache.has(cacheKey)) {
        const cachedItem = this.styleCache.get(cacheKey)!
        
        // 更新缓存项的使用信息
        cachedItem.lastUsed = Date.now()
        cachedItem.useCount++
        
        this.stats.cacheHits++
        safeLog(`样式缓存命中: ${cachedItem.className}`)
        
        return cachedItem.className
      }

      // 缓存未命中，生成新样式
      this.stats.cacheMisses++
      
      // 生成类名（根据作用域）
      const className = this.generateClassName(finalOptions)
      
      // 解析样式对象为CSS
      const parseResult = this.parser.parseStyles(styles, className)
      
      if (!parseResult.cssText) {
        safeLog('生成的CSS为空', 'warn')
        return className
      }

      // 注入CSS到DOM
      const injected = this.injectCSS(parseResult.cssText)
      
      if (injected && this.config.enableCache) {
        // 创建缓存项
        const cacheItem: StyleCacheItem = {
          className,
          cssText: parseResult.cssText,
          metadata: {
            timestamp: Date.now(),
            source: 'createStyle',
            isDynamic: false,
            cssSize: parseResult.cssText.length
          },
          lastUsed: Date.now(),
          useCount: 1
        }
        
        // 存储到缓存
        this.styleCache.set(cacheKey, cacheItem)
        
        // 检查缓存大小，触发清理
        this.debouncedCleanup()
      }

      this.stats.totalStyles++
      this.stats.injectionTime += performance.now() - startTime
      
      safeLog(`新样式已创建: ${className}`)
      return className
      
    } catch (error) {
      safeLog(`创建样式失败: ${error}`, 'error')
      // 返回一个默认类名，避免应用崩溃
      return generateClassName(this.config.classNamePrefix || 'css-error')
    }
  }

  /**
   * 根据选项生成类名
   * 支持自动哈希生成或自定义类名
   */
  private generateClassName(options: {
    classNamePrefix: string
    className?: string
  }): string {
    if (options.className) {
      // 自定义类名
      if (options.classNamePrefix) {
        return `${options.classNamePrefix}-${options.className}`
      } else {
        return options.className
      }
    } else {
      // 自动生成哈希类名
      return generateClassName(options.classNamePrefix)
    }
  }

  /**
   * 创建关键帧动画
   * 
   * 根据关键帧对象生成CSS动画，处理缓存和去重
   * 
   * @param keyframes 关键帧定义对象
   * @param source 动画来源标识
   * @returns 生成的动画名称
   */
  createKeyframes(keyframes: KeyframesDefinition, source?: string): string {
    const startTime = performance.now()
    
    try {
      // 生成缓存键
      const cacheKey = this.config.enableCache ? createCacheKey(keyframes) : ''
      
      // 检查缓存
      if (this.config.enableCache && this.animationCache.has(cacheKey)) {
        const cachedItem = this.animationCache.get(cacheKey)!
        
        // 更新缓存项的使用信息
        cachedItem.lastUsed = Date.now()
        cachedItem.useCount++
        
        this.stats.cacheHits++
        safeLog(`动画缓存命中: ${cachedItem.animationName}`)
        
        return cachedItem.animationName
      }

      // 缓存未命中，生成新动画
      this.stats.cacheMisses++
      
      // 生成唯一动画名
      const animationName = generateAnimationName('anim')
      
      // 生成@keyframes规则
      const cssText = this.parser.generateKeyframesRule(animationName, keyframes)
      
      if (!cssText) {
        safeLog('生成的关键帧CSS为空', 'warn')
        return animationName
      }

      // 注入CSS到DOM
      const injected = this.injectCSS(cssText)
      
      if (injected && this.config.enableCache) {
        // 创建缓存项
        const cacheItem: AnimationCacheItem = {
          animationName,
          cssText,
          metadata: {
            timestamp: Date.now(),
            source,
            isDynamic: false,
            cssSize: cssText.length
          },
          lastUsed: Date.now(),
          useCount: 1
        }
        
        // 存储到缓存
        this.animationCache.set(cacheKey, cacheItem)
        
        // 检查缓存大小
        this.debouncedCleanup()
      }

      this.stats.injectionTime += performance.now() - startTime
      
      safeLog(`新动画已创建: ${animationName}`)
      return animationName
      
    } catch (error) {
      safeLog(`创建动画失败: ${error}`, 'error')
      return generateAnimationName('anim-error')
    }
  }

  /**
   * 注入全局样式
   * 
   * 处理全局CSS规则的注入
   * 
   * @param styles 全局样式对象
   */
  injectGlobal(styles: GlobalStyles): void {
    try {
      const cssText = this.parser.generateGlobalCSS(styles)
      
      if (cssText) {
        this.injectCSS(cssText)
        safeLog('全局样式已注入')
      }
    } catch (error) {
      safeLog(`注入全局样式失败: ${error}`, 'error')
    }
  }

  /**
   * 注入CSS到DOM
   * 
   * 根据配置的插入模式将CSS规则注入到DOM中
   * 
   * @param cssText CSS规则文本
   * @returns 是否成功注入
   */
  private injectCSS(cssText: string): boolean {
    if (!cssText.trim()) {
      return false
    }

    // 检查是否已经注入过相同的规则
    if (this.injectedRules.has(cssText)) {
      return true // 已存在，视为成功
    }

    try {
      let success = false

      switch (this.config.insertionMode) {
        case StyleInsertionMode.SYNC:
          // 同步注入
          success = this.parser.injectCSS(cssText)
          break

        case StyleInsertionMode.ASYNC:
          // 异步注入（下一个事件循环）
          setTimeout(() => {
            this.parser.injectCSS(cssText)
          }, 0)
          success = true
          break

        case StyleInsertionMode.LAZY:
          // 懒加载注入（requestAnimationFrame）
          if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(() => {
              this.parser.injectCSS(cssText)
            })
          } else {
            // 降级到同步注入
            success = this.parser.injectCSS(cssText)
          }
          success = true
          break

        default:
          success = this.parser.injectCSS(cssText)
      }

      if (success) {
        this.injectedRules.add(cssText)
      }

      return success

    } catch (error) {
      safeLog(`CSS注入失败: ${error}`, 'error')
      return false
    }
  }

  /**
   * 清空所有缓存
   * 
   * 清除样式缓存和动画缓存
   */
  clearCache(): void {
    const styleCount = this.styleCache.size
    const animationCount = this.animationCache.size
    
    this.styleCache.clear()
    this.animationCache.clear()
    this.injectedRules.clear()
    
    // 重置统计信息
    this.stats.cacheHits = 0
    this.stats.cacheMisses = 0
    
    safeLog(`缓存已清空: ${styleCount} 个样式, ${animationCount} 个动画`)
  }

  /**
   * 清理过期缓存
   * 
   * 移除长时间未使用的缓存项
   */
  private cleanupCache(): void {
    if (!this.config.enableCache) {
      return
    }

    const now = Date.now()
    const maxAge = 30 * 60 * 1000 // 30分钟
    const maxSize = this.config.maxCacheSize || 10000
    
    let cleaned = 0

    // 清理样式缓存
    for (const [key, item] of this.styleCache.entries()) {
      if (now - item.lastUsed > maxAge || this.styleCache.size > maxSize) {
        this.styleCache.delete(key)
        cleaned++
      }
    }

    // 清理动画缓存
    for (const [key, item] of this.animationCache.entries()) {
      if (now - item.lastUsed > maxAge || this.animationCache.size > maxSize) {
        this.animationCache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      safeLog(`缓存清理完成: 移除了 ${cleaned} 个过期项`)
    }

    this.stats.lastCleanup = now
  }

  /**
   * 执行维护任务
   * 
   * 定期执行的维护操作
   */
  private performMaintenance(): void {
    // 清理过期缓存
    this.cleanupCache()
    
    // 输出性能统计（仅在开发模式下）
    if (this.config.developmentMode) {
      this.logPerformanceStats()
    }
  }

  /**
   * 输出性能统计信息
   */
  private logPerformanceStats(): void {
    const cacheHitRate = this.stats.cacheHits + this.stats.cacheMisses > 0
      ? (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) * 100).toFixed(2)
      : '0'

    const avgInjectionTime = this.stats.totalStyles > 0
      ? (this.stats.injectionTime / this.stats.totalStyles).toFixed(2)
      : '0'

    safeLog(`性能统计:
      - 总样式数: ${this.stats.totalStyles}
      - 缓存命中率: ${cacheHitRate}%
      - 平均注入时间: ${avgInjectionTime}ms
      - 样式缓存: ${this.styleCache.size} 项
      - 动画缓存: ${this.animationCache.size} 项`)
  }

  /**
   * 获取性能统计信息
   * 
   * @returns 性能统计对象的副本
   */
  getStats(): typeof StyleManager.prototype.stats {
    return deepClone(this.stats)
  }

  /**
   * 获取缓存信息
   * 
   * @returns 缓存状态信息
   */
  getCacheInfo(): {
    styles: number
    animations: number
    injectedRules: number
    totalSize: number
  } {
    let totalSize = 0
    
    // 计算样式缓存大小
    for (const item of this.styleCache.values()) {
      totalSize += item.cssText.length
    }
    
    // 计算动画缓存大小
    for (const item of this.animationCache.values()) {
      totalSize += item.cssText.length
    }

    return {
      styles: this.styleCache.size,
      animations: this.animationCache.size,
      injectedRules: this.injectedRules.size,
      totalSize
    }
  }

  /**
   * 检查样式是否已存在
   * 
   * @param styles CSS属性对象
   * @returns 是否已存在对应的样式
   */
  hasStyle(styles: CSSProperties): boolean {
    if (!this.config.enableCache) {
      return false
    }
    
    const cacheKey = createCacheKey(styles)
    return this.styleCache.has(cacheKey)
  }

  /**
   * 检查动画是否已存在
   * 
   * @param keyframes 关键帧定义对象
   * @returns 是否已存在对应的动画
   */
  hasAnimation(keyframes: KeyframesDefinition): boolean {
    if (!this.config.enableCache) {
      return false
    }
    
    const cacheKey = createCacheKey(keyframes)
    return this.animationCache.has(cacheKey)
  }

  /**
   * 销毁样式管理器
   * 
   * 清理所有资源并重置单例实例
   */
  destroy(): void {
    this.clearCache()
    
    // 清理解析器
    this.parser.destroy()
    
    // 重置统计信息
    this.stats = {
      totalStyles: 0,
      cacheHits: 0,
      cacheMisses: 0,
      injectionTime: 0,
      lastCleanup: Date.now()
    }
    
    // 重置单例实例
    StyleManager.instance = null as any
    
    safeLog('样式管理器已销毁')
  }
}