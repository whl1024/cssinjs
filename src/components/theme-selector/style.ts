import { css } from '../../../lib/index'
import type { ThemeConfig } from '../../themes'

export const createThemeButtonStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  fontSize: '14px',
  fontWeight: 500,
  border: `2px solid ${theme.colors.border}`,
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  '&:hover': {
    borderColor: theme.colors.primary,
    transform: 'translateY(-1px)'
  }
})

export const createThemeButtonActiveStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
  fontSize: '14px',
  fontWeight: 500,
  border: `2px solid ${theme.colors.primary}`,
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.colors.primary,
  color: '#ffffff',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  }
})
