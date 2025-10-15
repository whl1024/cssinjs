import type { ThemeConfig } from '../../themes'
import {
  fadeIn,
  createPageStyle,
  createContainerStyle,
  createHeaderStyle,
  createTitleStyle,
  createGridStyle
} from './style'

export function createLayout(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) {
  return {
    fadeIn,
    pageStyle: createPageStyle(theme),
    containerStyle: createContainerStyle(fadeIn),
    headerStyle: createHeaderStyle(theme),
    titleStyle: createTitleStyle(theme),
    gridStyle: createGridStyle(theme)
  }
}

/**
 * 创建页面头部
 */
export function createHeader(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>): HTMLElement {
  const styles = createLayout(theme)
  
  const header = document.createElement('header')
  header.className = styles.headerStyle()
  
  const title = document.createElement('h1')
  title.className = styles.titleStyle()
  title.textContent = '🎨 CSS-in-JS UI 组件库'
  
  const themeSelectorDiv = document.createElement('div')
  themeSelectorDiv.id = 'theme-selector'
  
  header.appendChild(title)
  header.appendChild(themeSelectorDiv)
  
  return header
}

/**
 * 创建网格容器
 */
export function createGrid(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>): HTMLDivElement {
  const styles = createLayout(theme)
  
  const grid = document.createElement('div')
  grid.className = styles.gridStyle()
  
  return grid
}

/**
 * 创建容器
 */
export function createContainer(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>): HTMLDivElement {
  const styles = createLayout(theme)
  
  const container = document.createElement('div')
  container.className = styles.containerStyle()
  
  return container
}
