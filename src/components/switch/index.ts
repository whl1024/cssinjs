import type { ThemeConfig, ThemeName } from '../../themes'
import { themes } from '../../themes'
import {
  createSwitchStyle,
  createSwitchInputStyle,
  createSwitchSliderStyle,
  createSwitchItemStyle,
  createSwitchLabelStyle
} from './style'

export function createSwitches(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) {
  return {
    switchStyle: createSwitchStyle(),
    switchInputStyle: createSwitchInputStyle(),
    switchSliderStyle: createSwitchSliderStyle(theme),
    switchItemStyle: createSwitchItemStyle(theme),
    switchLabelStyle: createSwitchLabelStyle(theme)
  }
}

/**
 * 渲染开关组件
 */
export function renderSwitches(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>, currentTheme: ThemeName): HTMLDivElement {
  const styles = createSwitches(theme)
  const container = document.createElement('div')
  
  const switchConfigs = [
    { id: 'switch1', label: '接收通知', checked: true },
    { id: 'switch2', label: '自动保存', checked: false },
    { id: 'switch3', label: '深色模式', checked: false },
    { id: 'switch4', label: '双因素认证', checked: true }
  ]
  
  switchConfigs.forEach((config, index) => {
    const item = document.createElement('div')
    item.className = styles.switchItemStyle()
    
    const label = document.createElement('span')
    label.className = styles.switchLabelStyle()
    label.textContent = config.label
    
    const switchLabel = document.createElement('label')
    switchLabel.className = styles.switchStyle()
    
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.className = styles.switchInputStyle()
    input.id = config.id
    input.checked = config.checked
    
    const slider = document.createElement('span')
    slider.className = styles.switchSliderStyle()
    slider.setAttribute('data-switch', String(index + 1))
    
    switchLabel.appendChild(input)
    switchLabel.appendChild(slider)
    
    item.appendChild(label)
    item.appendChild(switchLabel)
    container.appendChild(item)
  })
  
  return container
}

export function initSwitches(currentTheme: ThemeName) {
  const switches = document.querySelectorAll('[data-switch]')
  
  switches.forEach(slider => {
    const switchId = slider.getAttribute('data-switch')
    const input = document.querySelector(`#switch${switchId}`) as HTMLInputElement
    
    // 更新开关样式
    const updateSwitchStyle = () => {
      const isChecked = input.checked
      const sliderElement = slider as HTMLElement
      
      if (isChecked) {
        sliderElement.style.backgroundColor = themes[currentTheme].colors.primary
        sliderElement.classList.add('active')
      } else {
        sliderElement.style.backgroundColor = themes[currentTheme].colors.border
        sliderElement.classList.remove('active')
      }
    }
    
    // 初始化样式
    updateSwitchStyle()
    
    // 监听变化
    input.addEventListener('change', updateSwitchStyle)
    
    // 点击整个开关区域
    slider.parentElement?.addEventListener('click', (e) => {
      e.preventDefault()
      input.checked = !input.checked
      input.dispatchEvent(new Event('change'))
      console.log(`开关 ${switchId}: ${input.checked ? '开启' : '关闭'}`)
    })
  })
}

export function updateSwitchColors(currentTheme: ThemeName) {
  const switches = document.querySelectorAll('[data-switch]')
  switches.forEach(slider => {
    const switchId = slider.getAttribute('data-switch')
    const input = document.querySelector(`#switch${switchId}`) as HTMLInputElement
    const sliderElement = slider as HTMLElement
    
    if (input.checked) {
      sliderElement.style.backgroundColor = themes[currentTheme].colors.primary
    } else {
      sliderElement.style.backgroundColor = themes[currentTheme].colors.border
    }
  })
}
