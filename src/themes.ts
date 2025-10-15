// 定义主题类型
export type ThemeName = 'light' | 'dark' | 'ocean' | 'sunset'

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    success: string
    warning: string
    danger: string
    info: string
    background: string
    surface: string
    border: string
    text: string
    textSecondary: string
    textMuted: string
  }
  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
  }
  borderRadius: {
    sm: number
    md: number
    lg: number
    full: number
  }
}

// 定义多个主题
export const themes: Record<ThemeName, ThemeConfig> = {
  light: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4',
      background: '#ffffff',
      surface: '#f9fafb',
      border: '#e5e7eb',
      text: '#111827',
      textSecondary: '#6b7280',
      textMuted: '#9ca3af'
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      full: 9999
    }
  },
  dark: {
    colors: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171',
      info: '#22d3ee',
      background: '#0f172a',
      surface: '#1e293b',
      border: '#334155',
      text: '#f1f5f9',
      textSecondary: '#cbd5e1',
      textMuted: '#94a3b8'
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      full: 9999
    }
  },
  ocean: {
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      success: '#14b8a6',
      warning: '#f97316',
      danger: '#e11d48',
      info: '#3b82f6',
      background: '#ecfeff',
      surface: '#ffffff',
      border: '#a5f3fc',
      text: '#164e63',
      textSecondary: '#0e7490',
      textMuted: '#67e8f9'
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      full: 9999
    }
  },
  sunset: {
    colors: {
      primary: '#f97316',
      secondary: '#f59e0b',
      success: '#84cc16',
      warning: '#eab308',
      danger: '#dc2626',
      info: '#6366f1',
      background: '#fff7ed',
      surface: '#ffffff',
      border: '#fed7aa',
      text: '#7c2d12',
      textSecondary: '#c2410c',
      textMuted: '#fdba74'
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      full: 9999
    }
  }
}

// 主题名称映射
export const themeNames: Record<ThemeName, string> = {
  light: '☀️ 亮色',
  dark: '🌙 暗色',
  ocean: '🌊 海洋',
  sunset: '🌅 日落'
}
