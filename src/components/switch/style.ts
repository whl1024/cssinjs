import { css } from '../../../lib/index'
import type { ThemeConfig } from '../../themes'

export const createSwitchStyle = () => css({
  position: 'relative',
  display: 'inline-block',
  width: '50px',
  height: '26px',
  cursor: 'pointer'
})

export const createSwitchInputStyle = () => css({
  opacity: 0,
  width: 0,
  height: 0
})

export const createSwitchSliderStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.colors.border,
  borderRadius: '13px',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    height: '20px',
    width: '20px',
    left: '3px',
    bottom: '3px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    transition: 'transform 0.3s ease'
  }
})

export const createSwitchItemStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing.md
})

export const createSwitchLabelStyle = (theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) => css({
  fontSize: '14px',
  color: theme.colors.text
})
