import { css, keyframes, mergeStyles, composeClasses } from '../../../lib/index'
import type { ThemeConfig } from '../../themes'

// ==================== 动画定义 ====================

export const fadeIn = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(20px)'
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)'
  }
})

// ==================== 可复用的基础样式 ====================

// 通用文本样式
const baseTextStyle = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  lineHeight: 1.5
}

// 通用容器样式
const baseContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto'
}

// Flex 布局样式
const flexCenterStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

// ==================== 页面样式（使用 mergeStyles）====================

export const createPageStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => 
  css(mergeStyles(baseTextStyle, {
    minHeight: '100vh',
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    padding: theme.spacing.lg
  }))

// ==================== 容器样式（使用 composeClasses）====================

// 方案1: 使用 mergeStyles 合并样式对象
export const createContainerStyle = (animation: string) => 
  css(mergeStyles(baseContainerStyle, {
    animation: `${animation} 0.6s ease-out`
  }))

// 方案2: 使用 composeClasses 组合独立样式（更灵活）
const containerBase = css(baseContainerStyle)
export const createContainerWithAnimation = (animation: string) => {
  const animated = css({ animation: `${animation} 0.6s ease-out` })
  return composeClasses(containerBase, animated)
}

// ==================== Header 样式 ====================

export const createHeaderStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => 
  css(mergeStyles(flexCenterStyle, {
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    flexDirection: 'column',
    gap: theme.spacing.md
  }))

// ==================== 标题样式 ====================

export const createTitleStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => 
  css({
    fontSize: '32px',
    fontWeight: 700,
    color: theme.colors.text,
    marginBottom: 0
  })

// ==================== Grid 样式 ====================

export const createGridStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => 
  css({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: theme.spacing.lg
  })
