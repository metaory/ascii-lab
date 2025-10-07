import './style.css'
import '@fontsource/coiny'
import 'iconify-icon'
import gradientGl from 'gradient-gl'
import { effects } from './effects/index.js'
import { makeDims } from './util.js'


const pre = document.getElementById('stage')
const RESIZE_DELAY = 140
const MIN_COLS = 20
const MIN_ROWS = 10
const MAX_COLS = 120
const MAX_ROWS = 60
const CHAR_WIDTH = 8
const CHAR_HEIGHT = 12

const colsRows = () => {
  const s = Object.assign(document.createElement('span'), {
    textContent: 'M',
    style: { visibility: 'hidden', position: 'absolute' }
  })
  pre.appendChild(s)
  const { width: cw = CHAR_WIDTH, height: ch = CHAR_HEIGHT } = s.getBoundingClientRect()
  pre.removeChild(s)

  const availableHeight = pre.clientHeight
  const calculatedRows = Math.ceil(availableHeight / ch) + 8

  const cols = Math.max(MIN_COLS, Math.floor(pre.clientWidth / cw))
  const rows = Math.max(MIN_ROWS, calculatedRows)
  return makeDims(cols, rows, MAX_COLS, MAX_ROWS)
}

let currentKey = null
let buttonsByName = {}

const createElement = (tag, props = {}) => Object.assign(document.createElement(tag), props)

const createButton = (effect) => createElement('button', {
  className: 'effect-btn',
  innerHTML: `<iconify-icon icon="${effect.icon}" width="16" height="16"></iconify-icon> ${effect.label}`
})

const createRandomButton = () => createElement('button', {
  id: 'rand',
  className: 'random-btn',
  innerHTML: '<iconify-icon icon="mingcute:random-fill" width="16" height="16"></iconify-icon> random'
})

const createBgButton = () => createElement('button', {
  id: 'bg-rand',
  title: 'random background',
  innerHTML: '<img src="https://raw.githubusercontent.com/metaory/gradient-gl/refs/heads/master/docs/public/logo.ico" width="32" height="32"></img>'
})

const addEffectButtons = (container) => {
  Object.values(effects).forEach(effect => {
    const btn = createButton(effect)
    btn.addEventListener('click', () => activate(effect.name))
    buttonsByName[effect.name] = btn
    container.appendChild(btn)
  })
}

const addRandomButton = (container) => {
  const rand = createRandomButton()
  rand.addEventListener('click', () => {
    const keys = Object.keys(effects)
    const name = keys[Math.random() * keys.length | 0]
    activate(name)
  })
  container.appendChild(rand)
}

const renderControls = () => {
  const container = document.querySelector('.controls')
  container.innerHTML = ''
  buttonsByName = {}

  const bgBtn = createBgButton()
  bgBtn.addEventListener('click', randomizeBackground)
  document.body.appendChild(bgBtn)

  addEffectButtons(container)
  addRandomButton(container)
}

const activate = (name) => {
  if (!name || !effects[name]) return

  const prev = currentKey && effects[currentKey]
  prev?.stop?.()

  currentKey = name
  effects[name].start(pre, colsRows)
  setActive(buttonsByName[name])
}

const randomizeBackground = () => {
  const prefixes = ['a2', 'b1', 'b2', 'b3', 'f2', 'f3', 'n2']
  const randomHex = () => Math.random().toString(16).slice(2, 6)
  const randomPrefix = prefixes[Math.random() * prefixes.length | 0]
  gradientGl(`${randomPrefix}.${randomHex()}`)
}

const setActive = (activeBtn) => {
  document.querySelectorAll('.controls .effect-btn')
    .forEach(btn => btn.classList.toggle('active', btn === activeBtn))
}

const handleResize = () => {
  clearTimeout(handleResize.to)
  handleResize.to = setTimeout(() => {
    if (currentKey) activate(currentKey)
  }, RESIZE_DELAY)
}

renderControls()
const keys = Object.keys(effects)
const name = keys[Math.random() * keys.length | 0]
activate(name)
window.addEventListener('resize', handleResize)

document.addEventListener('visibilitychange', () => {
  if (!currentKey) return
  if (document.hidden) {
    effects[currentKey]?.stop?.()
  } else {
    activate(currentKey)
  }
})
