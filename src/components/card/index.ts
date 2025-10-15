import type { ThemeConfig } from '../../themes'
import { createCardStyle, createCardTitleStyle } from './style'

export function createCards(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) {
  return {
    cardStyle: createCardStyle(theme),
    cardTitleStyle: createCardTitleStyle(theme)
  }
}

/**
 * 创建卡片组件
 */
export function createCard(
  theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>,
  title: string,
  content: HTMLElement | string
): HTMLDivElement {
  const styles = createCards(theme)
  
  const card = document.createElement('div')
  card.className = styles.cardStyle()
  
  const cardTitle = document.createElement('h3')
  cardTitle.className = styles.cardTitleStyle()
  cardTitle.textContent = title
  
  card.appendChild(cardTitle)
  
  if (typeof content === 'string') {
    const contentDiv = document.createElement('div')
    contentDiv.innerHTML = content
    card.appendChild(contentDiv)
  } else {
    card.appendChild(content)
  }
  
  return card
}
