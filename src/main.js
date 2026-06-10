import './assets/css/style.css'
import './assets/js/index'

import { createApp } from 'vue'
import App from './App.vue'
import Datajson from './test.json'
import ButtonsJson from './buttons.json'

export { App }

export function initVueApp(containerId, config, buttons) {
  const container = document.getElementById(containerId)
  if (!container) return null
  const app = createApp(App, { initialData: { config, buttons } })
  app.mount(container)
  return app
}

if (typeof window !== 'undefined') {
  window.initVueApp = initVueApp
}

if (document.getElementById('app')) {
  const config = Datajson || {}
  const buttons = ButtonsJson || {}
  initVueApp('app', config, buttons)
  // initVueApp('app', config, buttons)
}
