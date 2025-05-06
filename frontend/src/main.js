import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// main.js
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

createApp(App).use(Toast).mount('#app')
