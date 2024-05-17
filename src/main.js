import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'default-passive-events';

import ElementPlus from 'element-plus';
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueAxios from 'vue-axios';
import axios from 'axios';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, ElementPlusIconsVue);
app.use(VueAxios, axios);

app.mount('#app')
