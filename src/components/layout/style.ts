import { css, keyframes } from '../../../lib/index'
import type { ThemeConfig } from '../../themes'

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

export const createPageStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  minHeight: '100vh',
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
  padding: theme.spacing.lg
})

export const createContainerStyle = (animation: string) => css({
  maxWidth: '1200px',
  margin: '0 auto',
  animation: `${animation} 0.6s ease-out`
})

export const createHeaderStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  marginBottom: theme.spacing.xl,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing.md
})

export const createTitleStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  fontSize: '32px',
  fontWeight: 700,
  color: theme.colors.text,
  marginBottom: 0
})

export const createGridStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: theme.spacing.lg
})
