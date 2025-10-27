import './style.css'
import { 
  injectGlobal, 
  configure,
  createThemeProxy,
  injectThemeVariables
} from '../lib/index'
import { themes, type ThemeName } from './themes'
import { createLayout, createHeader, createGrid, createContainer } from './components/layout'
import { createButtons, renderButtons } from './components/button'
import { renderInputGroup, renderTextareaGroup } from './components/input'
import { initSwitches as initSwitchesFromComponent, updateSwitchColors, renderSwitches } from './components/switch'
import { createCard } from './components/card'
import { createThemeSelector, renderThemeSelector as renderThemeSelectorFromComponent, updateThemeButtons } from './components/theme-selector'

// 配置库
// configure({
//   classNamePrefix: 'ui',
//   enableCache: true,
//   developmentMode: true
// })

// 注入全局样式
injectGlobal({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  },
  body: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: 1.6,
    transition: 'background-color 0.3s ease, color 0.3s ease'
  }
})

// 添加 CSS 变量支持开关动画
injectGlobal({
  '[data-switch].active::before': {
    transform: 'translateX(24px) !important'
  }
})

// 当前主题
let currentTheme: ThemeName = 'light'
const theme = createThemeProxy(themes[currentTheme])

// 注入初始主题变量
injectThemeVariables(themes[currentTheme])

// 创建组件样式
const buttons = createButtons(theme)
const themeSelector = createThemeSelector(theme)

// ==================== 渲染应用 ====================
function renderApp() {
  const app = document.querySelector<HTMLDivElement>('#app')!
  const layout = createLayout(theme)
  
  // 设置页面样式
  app.className = layout.pageStyle()
  
  // 清空 app
  app.innerHTML = ''
  
  // 创建容器
  const container = createContainer(theme)
  
  // 创建头部
  const header = createHeader(theme)
  container.appendChild(header)
  
  // 创建网格
  const grid = createGrid(theme)
  
  // 按钮组件卡片
  const buttonCard = createCard(theme, '按钮组件 (Button)', renderButtons(theme))
  grid.appendChild(buttonCard)
  
  // 输入框组件卡片
  const inputCard = createCard(theme, '输入框组件 (Input)', renderInputGroup(theme))
  grid.appendChild(inputCard)
  
  // 文本域组件卡片
  const textareaCard = createCard(theme, '文本域组件 (Textarea)', renderTextareaGroup(theme, buttons))
  grid.appendChild(textareaCard)
  
  // 开关组件卡片
  const switchCard = createCard(theme, '开关组件 (Switch)', renderSwitches(theme, currentTheme))
  grid.appendChild(switchCard)
  
  // 信息卡片
  const infoContent = document.createElement('div')
  const infoPara = document.createElement('p')
  infoPara.style.color = themes[currentTheme].colors.textSecondary
  infoPara.style.marginBottom = '16px'
  infoPara.style.lineHeight = '1.6'
  infoPara.textContent = '这是一个使用 CSS-in-JS 构建的卡片组件。它支持主题切换、响应式布局和流畅的动画效果。'
  
  const btnGroup = document.createElement('div')
  btnGroup.style.display = 'flex'
  btnGroup.style.gap = '8px'
  
  const learnMoreBtn = document.createElement('button')
  learnMoreBtn.className = buttons.primaryButton()
  learnMoreBtn.textContent = '了解更多'
  
  const shareBtn = document.createElement('button')
  shareBtn.className = buttons.outlineButton()
  shareBtn.textContent = '分享'
  
  btnGroup.appendChild(learnMoreBtn)
  btnGroup.appendChild(shareBtn)
  
  infoContent.appendChild(infoPara)
  infoContent.appendChild(btnGroup)
  
  const infoCard = createCard(theme, '信息卡片 (Card)', infoContent)
  grid.appendChild(infoCard)
  
  // 状态展示卡片
  const statusContent = document.createElement('div')
  statusContent.style.display = 'flex'
  statusContent.style.flexDirection = 'column'
  statusContent.style.gap = '12px'
  
  const statuses = [
    { color: themes[currentTheme].colors.success, text: '系统运行正常' },
    { color: themes[currentTheme].colors.warning, text: '正在更新中...' },
    { color: themes[currentTheme].colors.info, text: '3 条新消息' },
    { color: themes[currentTheme].colors.danger, text: '需要注意的问题' }
  ]
  
  statuses.forEach(status => {
    const statusItem = document.createElement('div')
    statusItem.style.display = 'flex'
    statusItem.style.alignItems = 'center'
    statusItem.style.gap = '8px'
    
    const indicator = document.createElement('div')
    indicator.style.width = '12px'
    indicator.style.height = '12px'
    indicator.style.borderRadius = '50%'
    indicator.style.background = status.color
    
    const text = document.createElement('span')
    text.style.color = themes[currentTheme].colors.textSecondary
    text.textContent = status.text
    
    statusItem.appendChild(indicator)
    statusItem.appendChild(text)
    statusContent.appendChild(statusItem)
  })
  
  const statusCard = createCard(theme, '状态提示 (Status)', statusContent)
  grid.appendChild(statusCard)
  
  // 添加网格到容器
  container.appendChild(grid)
  
  // 添加容器到 app
  app.appendChild(container)
  
  // 渲染主题选择器
  renderThemeSelectorFromComponent(currentTheme, themeSelector, switchTheme)
  
  // 初始化开关样式
  initSwitchesFromComponent(currentTheme)
}

// ==================== 切换主题 ====================
function switchTheme(themeName: ThemeName) {
  currentTheme = themeName
  injectThemeVariables(themes[currentTheme])
  
  // 只更新必要的部分，不重新渲染整个页面
  updateThemeButtons(currentTheme, themeSelector)
  updateSwitchColors(currentTheme)
  
  console.log(`🎨 已切换到 ${themeName} 主题`)
}

// ==================== 初始化应用 ====================
renderApp()

console.log('🎨 CSS-in-JS UI 组件库已加载')
console.log('📦 当前主题:', currentTheme)
console.log('🎯 支持的主题:', Object.keys(themes).join(', '))

