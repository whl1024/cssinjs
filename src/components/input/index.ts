import type { ThemeConfig } from '../../themes'
import {
  createInputStyle,
  createTextareaStyle,
  createLabelStyle,
  createInputGroupStyle
} from './style'

export function createInputs(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>) {
  return {
    inputStyle: createInputStyle(theme),
    textareaStyle: createTextareaStyle(theme),
    labelStyle: createLabelStyle(theme),
    inputGroupStyle: createInputGroupStyle(theme)
  }
}

/**
 * 渲染输入框组
 */
export function renderInputGroup(theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>): HTMLDivElement {
  const styles = createInputs(theme)
  const container = document.createElement('div')
  
  const inputs = [
    { label: '用户名', type: 'text', placeholder: '请输入用户名' },
    { label: '邮箱', type: 'email', placeholder: 'example@email.com' },
    { label: '密码', type: 'password', placeholder: '请输入密码' }
  ]
  
  inputs.forEach(inputConfig => {
    const group = document.createElement('div')
    group.className = styles.inputGroupStyle()
    
    const label = document.createElement('label')
    label.className = styles.labelStyle()
    label.textContent = inputConfig.label
    
    const input = document.createElement('input')
    input.type = inputConfig.type
    input.className = styles.inputStyle()
    input.placeholder = inputConfig.placeholder
    
    group.appendChild(label)
    group.appendChild(input)
    container.appendChild(group)
  })
  
  return container
}

/**
 * 渲染文本域组
 */
export function renderTextareaGroup(
  theme: ReturnType<typeof import('../../../lib/index').createThemeProxy<ThemeConfig>>,
  buttonStyles: { primaryButton: () => string, outlineButton: () => string }
): HTMLDivElement {
  const styles = createInputs(theme)
  const container = document.createElement('div')
  
  const group = document.createElement('div')
  group.className = styles.inputGroupStyle()
  
  const label = document.createElement('label')
  label.className = styles.labelStyle()
  label.textContent = '留言'
  
  const textarea = document.createElement('textarea')
  textarea.className = styles.textareaStyle()
  textarea.placeholder = '请输入您的留言...'
  
  group.appendChild(label)
  group.appendChild(textarea)
  
  // 创建按钮容器
  const buttonGroup = document.createElement('div')
  buttonGroup.style.display = 'flex'
  buttonGroup.style.gap = '8px'
  
  const submitBtn = document.createElement('button')
  submitBtn.className = buttonStyles.primaryButton()
  submitBtn.textContent = '提交'
  
  const cancelBtn = document.createElement('button')
  cancelBtn.className = buttonStyles.outlineButton()
  cancelBtn.textContent = '取消'
  
  buttonGroup.appendChild(submitBtn)
  buttonGroup.appendChild(cancelBtn)
  
  container.appendChild(group)
  container.appendChild(buttonGroup)
  
  return container
}
