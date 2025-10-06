import './style.css'
import '@fontsource/coiny'
import 'iconify-icon'
import gradientGl from 'gradient-gl'
import { effects } from './effects/index.js'

gradientGl('a2.aae9')

const pre = document.getElementById('stage');
const colsRows = () => {
  const s = Object.assign(document.createElement('span'), { textContent: 'M', style: { visibility: 'hidden' } });
  pre.appendChild(s);
  const { width: cw = 8, height: ch = 12 } = s.getBoundingClientRect();
  pre.removeChild(s);
  return { cols: Math.max(20, Math.floor(pre.clientWidth / cw)), rows: Math.max(10, Math.floor(pre.clientHeight / ch)) };
};

let currentKey = null;
let buttonsByName = {};

const createButton = (effect) => Object.assign(document.createElement('button'), {
  className: 'effect-btn',
  innerHTML: `<iconify-icon icon="${effect.icon}" width="16" height="16"></iconify-icon> ${effect.label}`
});

const createRandomButton = () => Object.assign(document.createElement('button'), {
  id: 'rand',
  className: 'random-btn',
  innerHTML: '<iconify-icon icon="mingcute:random-fill" width="16" height="16"></iconify-icon> random'
});

const renderControls = () => {
  const container = document.querySelector('.controls');
  container.innerHTML = '';
  buttonsByName = {};

  // Add bg button to body (outside controls)
  const bgBtn = Object.assign(document.createElement('button'), {
    id: 'bg-rand',
    title: 'random background',
    innerHTML: '<img src="https://raw.githubusercontent.com/metaory/gradient-gl/refs/heads/master/docs/public/logo.ico" width="32" height="32"></img>'
    // innerHTML: '<iconify-icon icon="solar:palette-bold" width="16" height="16"></iconify-icon> bg'
  });
  bgBtn.addEventListener('click', randomizeBackground);
  document.body.appendChild(bgBtn);

  for (const eff of Object.values(effects)) {
    const btn = createButton(eff);
    btn.addEventListener('click', () => activate(eff.name));
    buttonsByName[eff.name] = btn;
    container.appendChild(btn);
  }
  const rand = createRandomButton();
  rand.addEventListener('click', () => {
    const keys = Object.keys(effects);
    const name = keys[Math.random() * keys.length | 0];
    activate(name);
  });
  container.appendChild(rand);
};

const activate = (name) => {
  if (!name) return;
  const next = effects[name];
  if (!next) return;
  const prev = currentKey && effects[currentKey];
  prev?.stop && prev.stop();
  currentKey = name;
  next.start(pre, colsRows);
  setActive(buttonsByName[name]);
};

const randomizeBackground = () => {
  const prefixes = ['a2', 'b1', 'b2', 'b3', 'f2', 'f3', 'n2'];
  const randomHex = () => Math.random().toString(16).slice(2, 6);
  const randomPrefix = prefixes[Math.random() * prefixes.length | 0];
  gradientGl(`${randomPrefix}.${randomHex()}`);
};

const setActive = (activeBtn) => {
  document.querySelectorAll('.controls .effect-btn').forEach(btn => btn.classList.toggle('active', btn === activeBtn));
};

// direct listeners are attached in renderControls

const handleResize = () => {
  clearTimeout(handleResize.to);
  handleResize.to = setTimeout(() => {
    if (!currentKey) return;
    activate(currentKey);
  }, 140);
};

renderControls();
activate('fire');
window.addEventListener('resize', handleResize);
