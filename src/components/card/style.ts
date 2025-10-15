import { css } from '../../../lib/index'
import type { ThemeConfig } from '../../themes'

export const createCardStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.lg,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)'
  }
})

export const createCardTitleStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  fontSize: '18px',
  fontWeight: 600,
  color: theme.colors.text,
  marginBottom: theme.spacing.md
})
