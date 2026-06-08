import './assets/css/style.css'
import './assets/js/index.js'

import { createApp } from 'vue'
import App from './App.vue'

// Получаем данные из data-атрибута
const appElement = document.getElementById('app')
const initialData = appElement?.dataset.config || '{}'

// ПРАВИЛЬНЫЙ способ передать props
const app = createApp(App, {
  initialData: JSON.parse(initialData) // передаем как props
})

app.mount('#app')

// createApp(App).mount('#app')
