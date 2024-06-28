import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
import Login from "./views/Login.vue";
import Modelo from "./views/Modelo.vue"
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {path: "/", component: Home},
    {path: "/login", component: Login},
    {path: "/modelos", component: Dashboard},
    {path: "/modelos/:id", component: Modelo},
    
]

export const router = createRouter({
        history: createWebHistory(),
        routes
    }
);
