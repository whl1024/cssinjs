/**
 * CSS-in-JS 错误处理模块
 * 
 * 提供统一的错误类型和错误处理工具
 */

/**
 * CSS-in-JS 自定义错误类
 */
export class CSSInJSError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message)
    this.name = 'CSSInJSError'
    
    // 保持错误堆栈（V8引擎特性）
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, CSSInJSError)
    }
  }
}

/**
 * 错误代码枚举
 */
export const ErrorCode = {
  INVALID_STYLE_OBJECT: 'INVALID_STYLE_OBJECT',
  MISSING_PARAMS: 'MISSING_PARAMS',
  PARSE_ERROR: 'PARSE_ERROR',
  INJECTION_ERROR: 'INJECTION_ERROR',
  INVALID_KEYFRAMES: 'INVALID_KEYFRAMES',
  CACHE_ERROR: 'CACHE_ERROR'
} as const

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode]

/**
 * 错误处理工具函数
 * 
 * @param error 捕获的错误对象
 * @param fallbackClassName 回退类名
 * @param developmentMode 是否为开发模式
 * @returns 回退类名
 */
export function handleStyleError(
  error: unknown,
  fallbackClassName: string,
  developmentMode: boolean = false
): string {
  if (developmentMode) {
    console.error('[CSS-in-JS Error]', error)
    
    if (error instanceof CSSInJSError) {
      console.error('Error Code:', error.code)
      if (error.context) {
        console.error('Context:', error.context)
      }
    }
  }
  
  return fallbackClassName
}
