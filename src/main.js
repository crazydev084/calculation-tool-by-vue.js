import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/reset.css'
import './assets/pulse.css'
import './assets/main.css'
import './assets/custom.css'

// URLパスを分析
const urlPath = window.location.pathname;
// console.log(`現在のURLパス: ${urlPath}`);

// index_N.htmlの場合のみリダイレクト
const calcPattern = /index_(\d+)\.html/;
const match = urlPath.match(calcPattern);

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// index_N.htmlの場合のみ、対応する計算ツールにリダイレクト
if (match) {
  const calcId = match[1];
  router.push(`/calc/${calcId}`);
}

app.mount('#app') 