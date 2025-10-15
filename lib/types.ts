/**
 * CSS-in-JS 库的核心类型定义
 * 
 * 本文件定义了库中使用的所有核心类型接口，专注于样式处理
 * 不包含主题系统相关类型，主题管理交由框架层实现
 */

/**
 * CSS属性接口定义
 * 
 * 这是一个递归类型定义，支持：
 * 1. 基础CSS属性：如 color, fontSize 等
 * 2. 数值类型：会自动添加px单位
 * 3. 嵌套对象：用于伪类、媒体查询等场景
 * 4. 可选值：支持条件样式
 */
export interface CSSProperties {
  // 索引签名：允许任意CSS属性名
  [key: string]: string | number | CSSProperties | undefined

  // 常用CSS属性的明确类型定义（提供更好的IDE支持）
  
  // 布局相关属性
  display?: string                    // 显示类型: block, inline, flex, grid 等
  position?: string                   // 定位类型: static, relative, absolute, fixed
  top?: string | number              // 顶部距离
  right?: string | number            // 右侧距离
  bottom?: string | number           // 底部距离
  left?: string | number             // 左侧距离
  width?: string | number            // 宽度
  height?: string | number           // 高度
  minWidth?: string | number         // 最小宽度
  maxWidth?: string | number         // 最大宽度
  minHeight?: string | number        // 最小高度
  maxHeight?: string | number        // 最大高度
  
  // 间距相关属性
  margin?: string | number           // 外边距
  marginTop?: string | number        // 上外边距
  marginRight?: string | number      // 右外边距
  marginBottom?: string | number     // 下外边距
  marginLeft?: string | number       // 左外边距
  padding?: string | number          // 内边距
  paddingTop?: string | number       // 上内边距
  paddingRight?: string | number     // 右内边距
  paddingBottom?: string | number    // 下内边距
  paddingLeft?: string | number      // 左内边距
  
  // 外观相关属性
  color?: string                     // 文字颜色
  backgroundColor?: string           // 背景颜色
  background?: string                // 背景（简写属性）
  border?: string                    // 边框（简写属性）
  borderWidth?: string | number      // 边框宽度
  borderStyle?: string               // 边框样式
  borderColor?: string               // 边框颜色
  borderRadius?: string | number     // 边框圆角
  borderTop?: string                 // 上边框
  borderRight?: string               // 右边框
  borderBottom?: string              // 下边框
  borderLeft?: string                // 左边框
  
  // 字体相关属性
  fontSize?: string | number         // 字体大小
  fontFamily?: string                // 字体族
  fontWeight?: string | number       // 字体粗细
  fontStyle?: string                 // 字体样式：normal, italic
  lineHeight?: string | number       // 行高
  textAlign?: string                 // 文字对齐：left, center, right, justify
  textDecoration?: string            // 文字装饰：none, underline, line-through
  textTransform?: string             // 文字变换：none, uppercase, lowercase, capitalize
  letterSpacing?: string | number    // 字母间距
  wordSpacing?: string | number      // 单词间距
  
  // Flexbox 相关属性
  flexDirection?: string             // flex方向：row, column, row-reverse, column-reverse
  flexWrap?: string                  // flex换行：nowrap, wrap, wrap-reverse
  justifyContent?: string            // 主轴对齐：flex-start, center, space-between 等
  alignItems?: string                // 交叉轴对齐：stretch, center, flex-start 等
  alignContent?: string              // 多行对齐
  flex?: string | number             // flex简写属性
  flexGrow?: string | number         // flex增长
  flexShrink?: string | number       // flex收缩
  flexBasis?: string | number        // flex基准
  
  // Grid 相关属性
  gridTemplateColumns?: string       // 网格列模板
  gridTemplateRows?: string          // 网格行模板
  gridColumn?: string                // 网格列位置
  gridRow?: string                   // 网格行位置
  gridGap?: string | number          // 网格间距
  gridColumnGap?: string | number    // 网格列间距
  gridRowGap?: string | number       // 网格行间距
  
  // 视觉效果相关属性
  opacity?: string | number          // 透明度
  zIndex?: string | number           // 层级
  cursor?: string                    // 鼠标指针样式
  overflow?: string                  // 溢出处理：visible, hidden, scroll, auto
  overflowX?: string                 // 水平溢出处理
  overflowY?: string                 // 垂直溢出处理
  boxShadow?: string                 // 盒子阴影
  textShadow?: string                // 文字阴影
  filter?: string                    // 滤镜效果
  
  // 变换和动画相关属性
  transform?: string                 // 变换：translate, rotate, scale 等
  transformOrigin?: string           // 变换原点
  transition?: string                // 过渡动画
  transitionProperty?: string        // 过渡属性
  transitionDuration?: string        // 过渡时长
  transitionTimingFunction?: string  // 过渡时间函数
  transitionDelay?: string           // 过渡延迟
  animation?: string                 // 动画属性
  animationName?: string             // 动画名称
  animationDuration?: string         // 动画时长
  animationTimingFunction?: string   // 动画时间函数
  animationDelay?: string            // 动画延迟
  animationIterationCount?: string | number // 动画迭代次数
  animationDirection?: string        // 动画方向
  animationFillMode?: string         // 动画填充模式
  animationPlayState?: string        // 动画播放状态
  
  // 其他常用属性
  visibility?: string                // 可见性：visible, hidden
  clip?: string                      // 裁剪
  clipPath?: string                  // 裁剪路径
  userSelect?: string                // 用户选择：none, text, all
  pointerEvents?: string             // 指针事件：none, auto
  resize?: string                    // 调整大小：none, both, horizontal, vertical
  outline?: string                   // 轮廓
  outlineOffset?: string | number    // 轮廓偏移
}

/**
 * 样式函数类型定义
 * 接收任意参数并返回CSS属性对象
 * 
 * @template T 参数的类型，可以是主题、props或任意数据
 */
export type StyleFunction<T = any> = (params: T) => CSSProperties

/**
 * 样式定义联合类型
 * 可以是静态CSS对象或动态样式函数
 * 
 * @template T 参数的类型
 */
export type StyleDefinition<T = any> = 
  | CSSProperties        // 静态CSS对象
  | StyleFunction<T>     // 基于参数的动态样式函数

/**
 * 关键帧动画定义类型
 * 用于定义CSS关键帧动画
 * 
 * 键为百分比字符串（如 '0%', '50%', '100%'）或关键字（'from', 'to'）
 * 值为对应关键帧的CSS属性
 */
export type KeyframesDefinition = {
  [keyframe: string]: CSSProperties  // 关键帧百分比对应的样式
}

/**
 * 响应式样式值类型
 * 支持在不同条件下使用不同的值
 */
export type ResponsiveValue<T> = 
  | T                           // 单一值
  | T[]                         // 数组形式的响应式值（按断点顺序）
  | { [condition: string]: T }  // 对象形式的条件值

/**
 * 条件样式类型
 * 基于某些条件应用不同的样式
 */
export interface ConditionalStyle {
  condition: boolean            // 条件表达式
  style: CSSProperties         // 当条件为真时应用的样式
}

/**
 * 样式组合类型
 * 用于组合多个样式定义
 */
export type StyleComposition<T = any> = Array<
  | StyleDefinition<T>    // 样式定义
  | ConditionalStyle      // 条件样式
  | null                  // 空值（会被忽略）
  | undefined             // 未定义值（会被忽略）
>

/**
 * CSS变量定义类型
 * 用于定义CSS自定义属性（CSS Variables）
 */
export interface CSSVariables {
  [variableName: string]: string | number  // CSS变量名对应的值
}

/**
 * CSS生成选项
 */
export interface CSSOptions {
  /** 类名前缀，默认为 'css'，设置为空字符串可禁用前缀 */
  classNamePrefix?: string
  /** 自定义类名，如果提供则使用该名称而不是生成哈希 */
  className?: string
  /** 是否启用CSS变量，默认为 true */
  enableCSSVariables?: boolean
}

/**
 * 样式创建选项
 */
export interface StyleCreateOptions extends CSSOptions {
  /** CSS变量前缀（仅用于当前样式） */
  cssVariablePrefix?: string
}

/**
 * 样式缓存键类型
 * 用于样式缓存系统的键值，通常是CSS文本的哈希值或字符串
 */
export type StyleCacheKey = string

/**
 * 样式插入模式常量
 * 定义样式插入DOM的不同方式
 */
export const StyleInsertionMode = {
  SYNC: 'sync',          // 同步插入：立即插入DOM
  ASYNC: 'async',        // 异步插入：通过requestAnimationFrame插入
  LAZY: 'lazy'           // 懒加载插入：延迟到真正需要时插入
} as const

export type StyleInsertionModeType = typeof StyleInsertionMode[keyof typeof StyleInsertionMode]

/**
 * CSS-in-JS 库配置接口
 * 用于配置CSS-in-JS库的行为
 */
export interface CSSInJSConfig {
  // 类名前缀，用于生成的CSS类名
  classNamePrefix?: string
  
  // 样式插入模式
  insertionMode?: StyleInsertionModeType
  
  // 是否启用样式缓存（提高性能，避免重复生成相同样式）
  enableCache?: boolean
  
  // 是否启用开发模式（提供更详细的调试信息）
  developmentMode?: boolean
  
  // 自定义样式标签ID（用于样式注入的目标标签）
  styleTagId?: string
  
  // 样式插入位置（指定插入DOM的位置）
  insertionPoint?: Element
  
  // 是否压缩生成的CSS（在生产环境中有用）
  minifyCSS?: boolean
  
  // 最大缓存数量（防止内存泄漏）
  maxCacheSize?: number
}

/**
 * 样式对象元数据接口
 * 包含样式对象的附加信息，用于调试和分析
 */
export interface StyleMetadata {
  // 生成时间戳
  timestamp: number
  
  // 样式来源（文件名、组件名等）
  source?: string
  
  // 样式标签（用于分类和查找）
  tags?: string[]
  
  // 是否为动态样式（基于参数生成）
  isDynamic?: boolean
  
  // 生成的CSS文本大小（字节数）
  cssSize?: number
}

/**
 * CSS解析结果接口
 * CSS解析器返回的结果
 */
export interface ParseResult {
  // 生成的CSS文本
  cssText: string
  
  // 生成的类名
  className: string
  
  // 解析的样式属性数量
  propertyCount: number
  
  // 是否包含嵌套规则（伪类、媒体查询等）
  hasNestedRules: boolean
}

/**
 * 样式规则接口
 * 表示一个完整的CSS规则
 */
export interface StyleRule {
  // 选择器
  selector: string
  
  // CSS属性声明
  declarations: Array<{
    property: string    // CSS属性名
    value: string      // CSS属性值
    important?: boolean // 是否为!important
  }>
  
  // 嵌套规则（用于媒体查询、伪类等）
  nestedRules?: StyleRule[]
}

/**
 * 全局样式接口
 * 用于定义全局CSS样式
 */
export interface GlobalStyles {
  // HTML标签样式
  [tagName: string]: CSSProperties
  
  // 类选择器样式（以.开头）
  // ID选择器样式（以#开头）
  // 属性选择器样式（如[disabled]）
}

/**
 * 样式工厂接口
 * 用于创建可复用的样式生成器
 */
export interface StyleFactory<T = any> {
  // 工厂名称
  name: string
  
  // 样式生成函数
  create: (params: T) => CSSProperties
  
  // 默认参数
  defaultParams?: Partial<T>
  
  // 缓存键生成函数
  getCacheKey?: (params: T) => string
}

// 类型定义完成，所有接口和类型都已在上方声明
// TypeScript会自动导出所有顶级声明