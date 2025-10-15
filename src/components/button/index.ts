import type { ThemeConfig } from '../../themes'
import {
  createPrimaryButton,
  createSecondaryButton,
  createSuccessButton,
  createWarningButton,
  createDangerButton,
  createOutlineButton
} from './style'

export function createButtons(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) {
  return {
    primaryButton: createPrimaryButton(theme),
    secondaryButton: createSecondaryButton(theme),
    successButton: createSuccessButton(theme),
    warningButton: createWarningButton(theme),
    dangerButton: createDangerButton(theme),
    outlineButton: createOutlineButton(theme)
  }
}

/**
 * 渲染按钮组件
 */
export function renderButtons(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>): HTMLDivElement {
  const styles = createButtons(theme)
  
  const container = document.createElement('div')
  container.style.display = 'flex'
  container.style.flexWrap = 'wrap'
  container.style.gap = '8px'
  
  const buttons = [
    { text: 'Primary', style: styles.primaryButton(), disabled: false },
    { text: 'Secondary', style: styles.secondaryButton(), disabled: false },
    { text: 'Success', style: styles.successButton(), disabled: false },
    { text: 'Warning', style: styles.warningButton(), disabled: false },
    { text: 'Danger', style: styles.dangerButton(), disabled: false },
    { text: 'Outline', style: styles.outlineButton(), disabled: false },
    { text: 'Disabled', style: styles.primaryButton(), disabled: true }
  ]
  
  buttons.forEach(btn => {
    const button = document.createElement('button')
    button.className = btn.style
    button.textContent = btn.text
    button.disabled = btn.disabled
    container.appendChild(button)
  })
  
  return container
}
