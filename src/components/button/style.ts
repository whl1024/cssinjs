import { css } from '../../../lib/index'
import type { ThemeConfig } from '../../themes'

export const createPrimaryButton = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: '14px',
  fontWeight: 500,
  border: 'none',
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.colors.primary,
  color: '#ffffff',
  '&:hover': {
    opacity: 0.9,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
    '&:hover': {
      transform: 'none'
    }
  }
})

export const createSecondaryButton = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: '14px',
  fontWeight: 500,
  border: 'none',
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.colors.secondary,
  color: '#ffffff',
  '&:hover': {
    opacity: 0.9,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
})

export const createSuccessButton = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: '14px',
  fontWeight: 500,
  border: 'none',
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.colors.success,
  color: '#ffffff',
  '&:hover': {
    opacity: 0.9,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
})

export const createWarningButton = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: '14px',
  fontWeight: 500,
  border: 'none',
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.colors.warning,
  color: '#ffffff',
  '&:hover': {
    opacity: 0.9,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
})

export const createDangerButton = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: '14px',
  fontWeight: 500,
  border: 'none',
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: theme.colors.danger,
  color: '#ffffff',
  '&:hover': {
    opacity: 0.9,
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
})

export const createOutlineButton = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
  fontSize: '14px',
  fontWeight: 500,
  border: `2px solid ${theme.colors.primary}`,
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: 'transparent',
  color: theme.colors.primary,
  '&:hover': {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  '&:active': {
    transform: 'translateY(0)'
  }
})
