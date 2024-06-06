import { createApp } from "vue";
import Layui from "@layui/layui-vue";
import "@layui/layui-vue/lib/index.css";
import {router} from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// @ts-ignore
import App from "./App.vue";

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);

app.use(Layui)
app.use(router)
app.use(pinia);
app.mount("#app")
