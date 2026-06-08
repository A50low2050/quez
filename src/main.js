import './assets/css/style.css'
import './assets/js/index.js'

import { createApp } from 'vue'
import App from './App.vue'

const appElement = document.getElementById('app')
const configData = JSON.parse(appElement?.dataset.config || '{}')
const btnData = JSON.parse(appElement?.dataset.btn || '{}')

const initialData = {
  config: configData,
  buttons: btnData,
}

const app = createApp(App, {
  initialData: initialData,
})

app.mount('#app')
