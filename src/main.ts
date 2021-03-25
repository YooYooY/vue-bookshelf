import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import loadImgSrc from "@/directives/load-img-src"
import { useBookListProvide } from '@/context'
import "./styles/style.scss"

const app = createApp({
  setup() {
    useBookListProvide();
    return () => h(App)
  }
})

app.directive('loadImgSrc', loadImgSrc)

app.use(router).mount('#app')
