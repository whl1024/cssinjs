import { css } from '../../../lib/index'
import type { ThemeConfig } from '../../themes'

export const createInputStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  width: '100%',
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: '14px',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.borderRadius.md,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  transition: 'all 0.3s ease',
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
    boxShadow: `0 0 0 3px ${theme.colors.primary}33`
  },
  '&::placeholder': {
    color: theme.colors.textSecondary
  }
})

export const createTextareaStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  width: '100%',
  minHeight: '120px',
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: '14px',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.borderRadius.md,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  transition: 'all 0.3s ease',
  resize: 'vertical',
  fontFamily: 'inherit',
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
    boxShadow: `0 0 0 3px ${theme.colors.primary}33`
  },
  '&::placeholder': {
    color: theme.colors.textSecondary
  }
})

export const createLabelStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  display: 'block',
  marginBottom: theme.spacing.xs,
  fontSize: '14px',
  fontWeight: 500,
  color: theme.colors.text
})

export const createInputGroupStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  marginBottom: theme.spacing.md
})
