/**
 * CSS-in-JS 库的工具函数模块
 * 
 * 本文件包含了库中使用的各种实用工具函数：
 * - 类名生成器
 * - CSS属性名转换
 * - 数值单位处理
 * - 字符串处理工具
 * - 缓存相关工具
 */

/**
 * 生成唯一的CSS类名
 * 
 * 使用随机字符串确保类名的唯一性，避免样式冲突
 * 生成的类名格式：{prefix}-{随机字符串}
 * 
 * @param prefix 类名前缀，默认为 'css'
 * @returns 生成的唯一类名
 * 
 * @example
 * generateClassName() // 返回: 'css-a1b2c3d4'
 * generateClassName('btn') // 返回: 'btn-x9y8z7w6'
 */
export function generateClassName(prefix: string = 'css'): string {
  // 使用36进制随机字符串，包含数字和字母
  // substr(2, 8) 去掉 '0.' 前缀，取8位随机字符
  const randomStr = Math.random().toString(36).substr(2, 8)
  
  // 添加时间戳的最后4位确保更高的唯一性
  const timeStr = Date.now().toString(36).slice(-4)
  
  return `${prefix}-${randomStr}${timeStr}`
}

/**
 * 生成唯一的动画名称
 * 
 * 专门用于CSS关键帧动画的名称生成
 * 
 * @param prefix 动画名前缀，默认为 'anim'
 * @returns 生成的唯一动画名
 * 
 * @example
 * generateAnimationName() // 返回: 'anim-a1b2c3d4'
 * generateAnimationName('fade') // 返回: 'fade-x9y8z7w6'
 */
export function generateAnimationName(prefix: string = 'anim'): string {
  return generateClassName(prefix)
}

/**
 * 将驼峰命名转换为短横线命名（kebab-case）
 * 
 * CSS属性名需要使用短横线分隔，而JavaScript中通常使用驼峰命名
 * 这个函数负责进行转换
 * 
 * @param str 要转换的驼峰命名字符串
 * @returns 转换后的短横线命名字符串
 * 
 * @example
 * kebabCase('backgroundColor') // 返回: 'background-color'
 * kebabCase('fontSize') // 返回: 'font-size'
 * kebabCase('marginTop') // 返回: 'margin-top'
 * kebabCase('zIndex') // 返回: 'z-index'
 */
export function kebabCase(str: string): string {
  return str
    // 在大写字母前插入短横线，但保留字符串开头
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
    // 转换为小写
    .toLowerCase()
}

/**
 * 将短横线命名转换为驼峰命名（camelCase）
 * 
 * 用于将CSS属性名转换为JavaScript属性名
 * 
 * @param str 要转换的短横线命名字符串
 * @returns 转换后的驼峰命名字符串
 * 
 * @example
 * camelCase('background-color') // 返回: 'backgroundColor'
 * camelCase('font-size') // 返回: 'fontSize'
 * camelCase('margin-top') // 返回: 'marginTop'
 */
export function camelCase(str: string): string {
  return str
    // 将短横线后的字母转换为大写
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 检查值是否为数字类型
 * 
 * 用于判断CSS属性值是否需要添加单位
 * 
 * @param value 要检查的值
 * @returns 如果是有效数字返回true，否则返回false
 * 
 * @example
 * isNumber(42) // 返回: true
 * isNumber('42') // 返回: false
 * isNumber(0) // 返回: true
 * isNumber(NaN) // 返回: false
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * 检查值是否为数字字符串
 * 
 * @param value 要检查的值
 * @returns 如果是数字字符串返回true，否则返回false
 * 
 * @example
 * isNumberString('42') // 返回: true
 * isNumberString('42px') // 返回: false
 * isNumberString('auto') // 返回: false
 */
export function isNumberString(value: string): boolean {
  return /^-?\d*\.?\d+$/.test(value)
}

/**
 * 需要自动添加像素单位的CSS属性列表
 * 
 * 这些属性在接收数字值时，通常需要添加'px'单位
 */
const PIXEL_PROPERTIES = new Set([
  // 尺寸相关
  'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
  
  // 间距相关
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  
  // 定位相关
  'top', 'right', 'bottom', 'left',
  
  // 边框相关
  'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius',
  
  // 字体相关
  'fontSize', 'lineHeight', 'letterSpacing', 'wordSpacing',
  
  // 阴影和轮廓
  'textIndent', 'outlineWidth', 'outlineOffset',
  
  // Grid 相关
  'gridGap', 'gridColumnGap', 'gridRowGap', 'columnGap', 'rowGap',
  
  // 其他
  'strokeWidth', 'tabSize'
])

/**
 * 不需要添加单位的CSS属性列表
 * 
 * 这些属性即使是数字值，也不需要添加单位
 */
const UNITLESS_PROPERTIES = new Set([
  // 比例和倍数
  'opacity', 'zIndex', 'fontWeight', 'lineHeight', 'zoom', 'order',
  
  // Flexbox
  'flex', 'flexGrow', 'flexShrink', 'flexOrder',
  
  // 计数器
  'columnCount', 'columns', 'orphans', 'widows',
  
  // 动画
  'animationIterationCount', 'fillOpacity', 'strokeOpacity',
  
  // SVG 相关
  'stopOpacity', 'strokeDasharray', 'strokeDashoffset'
])

/**
 * 为CSS属性值添加合适的单位
 * 
 * 根据CSS属性名和值的类型，自动添加合适的单位
 * 
 * @param property CSS属性名（驼峰命名或短横线命名）
 * @param value CSS属性值
 * @returns 处理后的CSS属性值字符串
 * 
 * @example
 * addUnit('width', 100) // 返回: '100px'
 * addUnit('opacity', 0.5) // 返回: '0.5'
 * addUnit('color', 'red') // 返回: 'red'
 * addUnit('fontSize', '16px') // 返回: '16px'
 */
export function addUnit(property: string, value: string | number): string {
  // 如果值已经是字符串，直接返回
  if (typeof value === 'string') {
    return value
  }
  
  // 如果不是数字，转换为字符串返回
  if (!isNumber(value)) {
    return String(value)
  }
  
  // 转换属性名为驼峰命名以便查找
  const camelProperty = property.includes('-') ? camelCase(property) : property
  
  // 检查是否为无单位属性
  if (UNITLESS_PROPERTIES.has(camelProperty)) {
    return String(value)
  }
  
  // 检查是否为动效时间属性（motionDuration 开头），添加 ms 单位
  if (camelProperty.startsWith('motionDuration')) {
    return `${value}ms`
  }
  
  // 检查是否需要添加像素单位
  if (PIXEL_PROPERTIES.has(camelProperty)) {
    return `${value}px`
  }
  
  // 默认情况下，数字值添加px单位
  return `${value}px`
}

/**
 * 转义CSS选择器中的特殊字符
 * 
 * 确保生成的CSS选择器是有效的
 * 
 * @param selector 要转义的选择器字符串
 * @returns 转义后的选择器字符串
 * 
 * @example
 * escapeSelector('my-class') // 返回: 'my-class'
 * escapeSelector('class:hover') // 返回: 'class\\:hover'
 */
export function escapeSelector(selector: string): string {
  // 转义CSS选择器中的特殊字符
  return selector.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&')
}

/**
 * 规范化CSS属性值
 * 
 * 清理和标准化CSS属性值
 * 
 * @param value CSS属性值
 * @returns 规范化后的值
 * 
 * @example
 * normalizeValue('  red  ') // 返回: 'red'
 * normalizeValue('RGB(255, 0, 0)') // 返回: 'rgb(255, 0, 0)'
 */
export function normalizeValue(value: string): string {
  return value
    // 去除首尾空白
    .trim()
    // 将多个空格替换为单个空格
    .replace(/\s+/g, ' ')
    // 标准化颜色函数名为小写
    .replace(/(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\(/gi, (match) => match.toLowerCase())
}

/**
 * 创建缓存键
 * 
 * 根据输入数据生成用于缓存的唯一键
 * 
 * @param data 要生成缓存键的数据
 * @returns 缓存键字符串
 * 
 * @example
 * createCacheKey({ color: 'red', fontSize: 16 }) // 返回: 哈希字符串
 */
export function createCacheKey(data: any, options?: any): string {
  // 简单的字符串化 + 哈希生成
  const dataStr = JSON.stringify(data, Object.keys(data).sort())
  const optionsStr = options ? JSON.stringify(options, Object.keys(options).sort()) : ''
  return hashString(dataStr + optionsStr)
}

/**
 * 简单的字符串哈希函数
 * 
 * 用于生成缓存键和唯一标识符
 * 
 * @param str 要哈希的字符串
 * @returns 哈希值（十六进制字符串）
 */
export function hashString(str: string): string {
  let hash = 0
  
  // 如果字符串为空，返回固定值
  if (str.length === 0) {
    return '0'
  }
  
  // 简单的哈希算法
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为32位整数
  }
  
  // 转换为正数并转换为36进制字符串
  return Math.abs(hash).toString(36)
}

/**
 * 深度克隆对象
 * 
 * 创建对象的深度副本，避免意外修改原始数据
 * 
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  // 处理基本类型和null
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  // 处理对象
  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  
  return cloned
}

/**
 * 合并CSS属性对象
 * 
 * 深度合并多个CSS属性对象，后面的对象会覆盖前面的同名属性
 * 
 * @param objects 要合并的CSS属性对象数组
 * @returns 合并后的CSS属性对象
 */
export function mergeStyles(...objects: Array<any>): any {
  const result = {}
  
  for (const obj of objects) {
    if (obj && typeof obj === 'object') {
      Object.assign(result, obj)
    }
  }
  
  return result
}

/**
 * 检查是否为浏览器环境
 * 
 * 用于服务端渲染兼容性检查
 * 
 * @returns 如果在浏览器环境中返回true
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * 检查是否为开发环境
 * 
 * @returns 如果在开发环境中返回true
 */
export function isDevelopment(): boolean {
  // 简单检查，避免复杂的环境变量依赖
  try {
    // @ts-ignore - 兼容不同环境
    return (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || false
  } catch {
    return false
  }
}

/**
 * 安全的控制台输出
 * 
 * 在开发环境中输出调试信息，生产环境中忽略
 * 
 * @param message 要输出的消息
 * @param level 日志级别
 */
export function safeLog(message: any, level: 'log' | 'warn' | 'error' = 'log'): void {
  if (isDevelopment() && typeof console !== 'undefined') {
    console[level](`[CSS-in-JS] ${message}`)
  }
}

/**
 * 防抖函数
 * 
 * 用于优化频繁调用的函数
 * 
 * @param func 要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined
  
  return (...args: Parameters<T>) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), delay) as unknown as number
  }
}

/**
 * 节流函数
 * 
 * 限制函数的调用频率
 * 
 * @param func 要节流的函数
 * @param limit 时间限制（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}