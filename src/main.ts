import './assets/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import 'vue-toast-notification/dist/theme-bootstrap.css';
import ToastPlugin from 'vue-toast-notification';


createApp(App).use(router).use(ToastPlugin).mount('#app');
