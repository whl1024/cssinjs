/**
 * CSS-in-JS 库的主要API接口
 * 
 * 提供简洁易用的API，包括：
 * - css(): 创建CSS样式
 * - keyframes(): 创建关键帧动画
 * - injectGlobal(): 注入全局样式
 * - configure(): 配置库行为
 * - 其他实用工具函数
 */

import { StyleManager } from './manager'
import type {
  StyleDefinition,
  KeyframesDefinition,
  GlobalStyles,
  CSSInJSConfig,
  CSSProperties,
  CSSOptions
} from './types'

/**
 * 创建CSS样式
 * 
 * 这是库的核心API，用于将样式对象转换为CSS类名
 * 支持静态样式对象和动态样式函数
 * 支持自动哈希生成或自定义类名
 * 
 * @param styleDefinition 样式定义，可以是对象或函数
 * @param options CSS生成选项，包括作用域、类名前缀等
 * @returns 返回样式函数，调用时传入参数并返回类名
 * 
 * @example
 * // 静态样式（自动生成哈希类名）
 * const buttonStyle = css({
 *   backgroundColor: '#007bff',
 *   color: 'white',
 *   padding: 16,
 *   borderRadius: 4
 * })
 * const className = buttonStyle() // 返回生成的类名：css-abc123
 * 
 * @example
 * // 自定义类名（带前缀）
 * const namedStyle = css({
 *   backgroundColor: '#f5f5f5',
 * }, {
 *   classNamePrefix: 'btn',
 *   className: 'primary'
 * })
 * const className = namedStyle() // 返回：btn-primary
 * 
 * @example
 * // 完全自定义类名（无前缀）
 * const customStyle = css({
 *   color: 'red'
 * }, {
 *   className: 'my-button',
 *   classNamePrefix: ''
 * })
 * const className = customStyle() // 返回：my-button
 * 
 * @example
 * // 动态样式
 * const dynamicStyle = css((props: { size: 'sm' | 'lg' }) => ({
 *   padding: props.size === 'lg' ? 20 : 12,
 *   fontSize: props.size === 'lg' ? 18 : 14
 * }), { classNamePrefix: 'component' })
 * const className = dynamicStyle({ size: 'lg' })
 */
export function css<T = any>(
  styleDefinition: StyleDefinition<T>, 
  options?: CSSOptions
) {
  return (params?: T): string => {
    // 获取样式管理器单例
    const styleManager = StyleManager.getInstance()
    
    let styles: CSSProperties
    
    try {
      // 如果是函数，则调用函数获取样式对象
      if (typeof styleDefinition === 'function') {
        if (params === undefined) {
          throw new Error('动态样式函数需要传入参数')
        }
        styles = styleDefinition(params)
      } else {
        // 静态样式对象
        styles = styleDefinition
      }
      
      // 验证样式对象
      if (!styles || typeof styles !== 'object') {
        throw new Error('无效的样式对象')
      }
      
      // 创建样式并返回类名
      return styleManager.createStyle(styles, options)
      
    } catch (error) {
      // 在开发环境中输出错误信息
      console.error('[CSS-in-JS] 创建样式失败:', error)
      
      // 返回一个默认类名，避免应用崩溃
      return 'css-error'
    }
  }
}

/**
 * 创建关键帧动画
 * 
 * 将关键帧对象转换为CSS @keyframes 规则，并返回动画名称
 * 
 * @param keyframes 关键帧定义对象
 * @returns 生成的动画名称
 * 
 * @example
 * // 基本动画
 * const fadeIn = keyframes({
 *   '0%': { opacity: 0 },
 *   '100%': { opacity: 1 }
 * })
 * 
 * const animatedStyle = css({
 *   animation: `${fadeIn} 0.3s ease-in-out`
 * })
 * 
 * @example
 * // 复杂动画
 * const bounce = keyframes({
 *   '0%, 20%, 53%, 80%, 100%': {
 *     transform: 'translate3d(0, 0, 0)'
 *   },
 *   '40%, 43%': {
 *     transform: 'translate3d(0, -30px, 0)'
 *   },
 *   '70%': {
 *     transform: 'translate3d(0, -15px, 0)'
 *   },
 *   '90%': {
 *     transform: 'translate3d(0, -4px, 0)'
 *   }
 * })
 */
export function keyframes(keyframes: KeyframesDefinition): string {
  try {
    // 验证关键帧对象
    if (!keyframes || typeof keyframes !== 'object') {
      throw new Error('无效的关键帧对象')
    }
    
    // 检查是否有有效的关键帧
    const keyframeKeys = Object.keys(keyframes)
    if (keyframeKeys.length === 0) {
      throw new Error('关键帧对象不能为空')
    }
    
    // 获取样式管理器并创建动画
    const styleManager = StyleManager.getInstance()
    return styleManager.createKeyframes(keyframes)
    
  } catch (error) {
    console.error('[CSS-in-JS] 创建动画失败:', error)
    return 'anim-error'
  }
}

/**
 * 注入全局样式
 * 
 * 用于定义全局CSS规则，如重置样式、基础样式等
 * 
 * @param styles 全局样式对象
 * 
 * @example
 * // 基础全局样式
 * injectGlobal({
 *   body: {
 *     margin: 0,
 *     padding: 0,
 *     fontFamily: 'Arial, sans-serif'
 *   },
 *   '*': {
 *     boxSizing: 'border-box'
 *   }
 * })
 * 
 * @example
 * // 响应式全局样式
 * injectGlobal({
 *   '.container': {
 *     maxWidth: 1200,
 *     margin: '0 auto',
 *     padding: '0 16px'
 *   },
 *   '@media (max-width: 768px)': {
 *     '.container': {
 *       padding: '0 8px'
 *     }
 *   }
 * })
 */
export function injectGlobal(styles: GlobalStyles): void {
  try {
    // 验证样式对象
    if (!styles || typeof styles !== 'object') {
      throw new Error('无效的全局样式对象')
    }
    
    // 获取样式管理器并注入全局样式
    const styleManager = StyleManager.getInstance()
    styleManager.injectGlobal(styles)
    
  } catch (error) {
    console.error('[CSS-in-JS] 注入全局样式失败:', error)
  }
}

/**
 * 配置CSS-in-JS库
 * 
 * 用于设置库的行为选项
 * 
 * @param config 配置选项
 * 
 * @example
 * // 基础配置
 * configure({
 *   classNamePrefix: 'my-app',
 *   enableCache: true,
 *   developmentMode: true
 * })
 * 
 * @example
 * // 生产环境配置
 * configure({
 *   classNamePrefix: 'p',
 *   enableCache: true,
 *   minifyCSS: true,
 *   developmentMode: false
 * })
 */
export function configure(config: Partial<CSSInJSConfig>): void {
  try {
    // 验证配置对象
    if (!config || typeof config !== 'object') {
      throw new Error('无效的配置对象')
    }
    
    // 获取样式管理器并应用配置
    const styleManager = StyleManager.getInstance()
    styleManager.configure(config)
    
  } catch (error) {
    console.error('[CSS-in-JS] 配置失败:', error)
  }
}

/**
 * 清除所有样式缓存
 * 
 * 清空样式管理器中的所有缓存，释放内存
 * 通常在路由切换或页面卸载时调用
 * 
 * @example
 * // 在路由切换时清除缓存
 * router.beforeEach(() => {
 *   clearCache()
 * })
 */
export function clearCache(): void {
  try {
    const styleManager = StyleManager.getInstance()
    styleManager.clearCache()
  } catch (error) {
    console.error('[CSS-in-JS] 清除缓存失败:', error)
  }
}

/**
 * 获取库的配置信息
 * 
 * @returns 当前配置的副本
 * 
 * @example
 * const config = getConfig()
 * console.log('当前类名前缀:', config.classNamePrefix)
 */
export function getConfig(): CSSInJSConfig {
  try {
    const styleManager = StyleManager.getInstance()
    return styleManager.getConfig()
  } catch (error) {
    console.error('[CSS-in-JS] 获取配置失败:', error)
    return {} as CSSInJSConfig
  }
}

/**
 * 获取性能统计信息
 * 
 * @returns 性能统计数据
 * 
 * @example
 * const stats = getStats()
 * console.log('缓存命中率:', stats.cacheHits / (stats.cacheHits + stats.cacheMisses))
 */
export function getStats(): {
  totalStyles: number
  cacheHits: number
  cacheMisses: number
  injectionTime: number
  lastCleanup: number
} {
  try {
    const styleManager = StyleManager.getInstance()
    return styleManager.getStats()
  } catch (error) {
    console.error('[CSS-in-JS] 获取统计信息失败:', error)
    return {
      totalStyles: 0,
      cacheHits: 0,
      cacheMisses: 0,
      injectionTime: 0,
      lastCleanup: 0
    }
  }
}

/**
 * 获取缓存信息
 * 
 * @returns 当前缓存状态信息
 * 
 * @example
 * const cacheInfo = getCacheInfo()
 * console.log('缓存的样式数量:', cacheInfo.styles)
 * console.log('缓存的动画数量:', cacheInfo.animations)
 */
export function getCacheInfo(): {
  styles: number
  animations: number
  injectedRules: number
  totalSize: number
} {
  try {
    const styleManager = StyleManager.getInstance()
    return styleManager.getCacheInfo()
  } catch (error) {
    console.error('[CSS-in-JS] 获取缓存信息失败:', error)
    return {
      styles: 0,
      animations: 0,
      injectedRules: 0,
      totalSize: 0
    }
  }
}

/**
 * 检查样式是否已存在缓存中
 * 
 * @param styles CSS属性对象
 * @returns 是否已缓存
 * 
 * @example
 * const styles = { color: 'red', fontSize: 16 }
 * if (hasStyle(styles)) {
 *   console.log('样式已存在于缓存中')
 * }
 */
export function hasStyle(styles: CSSProperties): boolean {
  try {
    const styleManager = StyleManager.getInstance()
    return styleManager.hasStyle(styles)
  } catch (error) {
    console.error('[CSS-in-JS] 检查样式失败:', error)
    return false
  }
}

/**
 * 检查动画是否已存在缓存中
 * 
 * @param keyframes 关键帧定义对象
 * @returns 是否已缓存
 * 
 * @example
 * const fadeKeyframes = {
 *   '0%': { opacity: 0 },
 *   '100%': { opacity: 1 }
 * }
 * if (hasAnimation(fadeKeyframes)) {
 *   console.log('动画已存在于缓存中')
 * }
 */
export function hasAnimation(keyframes: KeyframesDefinition): boolean {
  try {
    const styleManager = StyleManager.getInstance()
    return styleManager.hasAnimation(keyframes)
  } catch (error) {
    console.error('[CSS-in-JS] 检查动画失败:', error)
    return false
  }
}

/**
 * 创建样式工厂函数
 * 
 * 用于创建可复用的样式生成器，适合主题化和组件库场景
 * 
 * @param factory 样式工厂函数
 * @returns 样式生成器函数
 * 
 * @example
 * // 创建按钮样式工厂
 * const createButtonStyle = styleFactory((theme, props: { variant: 'primary' | 'secondary' }) => ({
 *   backgroundColor: props.variant === 'primary' ? theme.colors.primary : theme.colors.secondary,
 *   color: 'white',
 *   padding: '8px 16px',
 *   borderRadius: theme.radii.md,
 *   border: 'none',
 *   cursor: 'pointer'
 * }))
 * 
 * // 在组件中使用
 * function Button({ variant, theme, children }) {
 *   const className = createButtonStyle(theme, { variant })
 *   return <button className={className}>{children}</button>
 * }
 */
export function styleFactory<T extends any[], R extends CSSProperties>(
  factory: (...args: T) => R
): (...args: T) => string {
  return (...args: T): string => {
    try {
      const styles = factory(...args)
      return css(styles)()
    } catch (error) {
      console.error('[CSS-in-JS] 样式工厂执行失败:', error)
      return 'css-factory-error'
    }
  }
}

/**
 * 创建样式组合函数
 * 
 * 将多个样式对象合并为一个，支持条件样式
 * 
 * @param styles 样式数组
 * @returns 合并后的类名
 * 
 * @example
 * const baseStyle = { padding: 16, borderRadius: 4 }
 * const primaryStyle = { backgroundColor: '#007bff', color: 'white' }
 * const largeStyle = { fontSize: 18, padding: 20 }
 * 
 * const className = compose([
 *   baseStyle,
 *   isPrimary && primaryStyle,
 *   isLarge && largeStyle
 * ])
 */
export function compose(styles: Array<CSSProperties | false | null | undefined>): string {
  try {
    // 过滤出有效的样式对象
    const validStyles = styles.filter(Boolean) as CSSProperties[]
    
    if (validStyles.length === 0) {
      return ''
    }
    
    // 合并所有样式对象
    const mergedStyles = Object.assign({}, ...validStyles)
    
    return css(mergedStyles)()
    
  } catch (error) {
    console.error('[CSS-in-JS] 样式组合失败:', error)
    return 'css-compose-error'
  }
}

/**
 * 创建CSS变量
 * 
 * 生成CSS自定义属性的样式对象
 * 
 * @param variables CSS变量对象
 * @returns CSS属性对象
 * 
 * @example
 * const themeVars = cssVariables({
 *   primaryColor: '#007bff',
 *   fontSize: '16px',
 *   spacing: '8px'
 * })
 * 
 * injectGlobal({
 *   ':root': themeVars
 * })
 * 
 * // 在样式中使用
 * const buttonStyle = css({
 *   backgroundColor: 'var(--primaryColor)',
 *   fontSize: 'var(--fontSize)',
 *   padding: 'var(--spacing)'
 * })
 */
export function cssVariables(variables: Record<string, string | number>): CSSProperties {
  const result: CSSProperties = {}
  
  for (const [key, value] of Object.entries(variables)) {
    const variableName = key.startsWith('--') ? key : `--${key}`
    result[variableName] = String(value)
  }
  
  return result
}

/**
 * 销毁CSS-in-JS实例
 * 
 * 清理所有资源，通常在应用卸载时调用
 * 
 * @example
 * // 在应用卸载时清理
 * window.addEventListener('beforeunload', () => {
 *   destroy()
 * })
 */
export function destroy(): void {
  try {
    const styleManager = StyleManager.getInstance()
    styleManager.destroy()
  } catch (error) {
    console.error('[CSS-in-JS] 销毁失败:', error)
  }
}