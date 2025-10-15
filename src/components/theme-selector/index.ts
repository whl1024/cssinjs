import type { ThemeConfig, ThemeName } from '../../themes'
import { themes, themeNames } from '../../themes'
import { createThemeButtonStyle, createThemeButtonActiveStyle } from './style'

export function createThemeSelector(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) {
  return {
    themeButtonStyle: createThemeButtonStyle(theme),
    themeButtonActiveStyle: createThemeButtonActiveStyle(theme)
  }
}

/**
 * 渲染主题选择器
 */
export function renderThemeSelector(
  currentTheme: ThemeName,
  styles: ReturnType<typeof createThemeSelector>,
  onThemeChange: (theme: ThemeName) => void
) {
  const selector = document.querySelector('#theme-selector') as HTMLElement
  if (!selector) return
  
  // 设置容器样式
  selector.style.display = 'flex'
  selector.style.gap = '8px'
  selector.style.flexWrap = 'wrap'
  
  // 清空容器
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild)
  }
  
  // 创建主题按钮
  (Object.keys(themes) as ThemeName[]).forEach((themeName: ThemeName) => {
    const isActive = themeName === currentTheme
    
    const button = document.createElement('button')
    button.className = isActive ? styles.themeButtonActiveStyle() : styles.themeButtonStyle()
    button.textContent = themeNames[themeName]
    button.dataset.theme = themeName
    
    button.addEventListener('click', () => {
      onThemeChange(themeName)
    })
    
    selector.appendChild(button)
  })
}

export function updateThemeButtons(
  currentTheme: ThemeName,
  styles: ReturnType<typeof createThemeSelector>
) {
  const selector = document.querySelector('#theme-selector') as HTMLElement
  if (!selector) return
  
  selector.querySelectorAll('button').forEach(btn => {
    const btnTheme = (btn as HTMLButtonElement).dataset.theme as ThemeName
    if (btnTheme === currentTheme) {
      btn.className = styles.themeButtonActiveStyle()
    } else {
      btn.className = styles.themeButtonStyle()
    }
  })
}

