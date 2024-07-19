import './assets/main.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';
import L from 'leaflet';
import "leaflet/dist/leaflet.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41] 
});

const app = createApp(App)

app.use(createPinia())
app.use(router)


app.mount('#app')
