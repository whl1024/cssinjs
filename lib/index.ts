/**
 * CSS-in-JS 库入口文件
 * 
 * 统一导出核心API和类型定义
 */

// 导出主要API函数
export {
  css,
  keyframes,
  injectGlobal,
  configure,
  clearCache,
  compose,
  styleFactory,
  cssVariables,
  getConfig,
  getStats,
  getCacheInfo,
  hasStyle,
  hasAnimation,
  destroy
} from './css'

// 导出CSS变量相关功能
export {
  configureCSSVariables,
  createThemeProxy,
  injectThemeVariables,
  getThemeVariables
} from './variables'

// 导出核心类型定义
export type {
  CSSProperties,
  StyleDefinition,
  StyleFunction,
  CSSInJSConfig,
  CSSOptions,
  StyleCreateOptions
} from './types'

// 导出枚举
export { StyleInsertionMode } from './types'

/**
 * 库版本信息
 */
export const VERSION = '1.0.0'
