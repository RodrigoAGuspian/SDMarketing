import Home from "./views/Home.vue";
import Dashboard from "./views/Dashboard.vue";
import Login from "./views/Login.vue";
import Modelo from "./views/Modelo.vue";
import ModeloF from "./views/ModeloF.vue";
import TurnoF from "./views/TurnoF.vue";
import { createRouter, createWebHistory } from "vue-router";
import { auth } from '@/utils/firebase'
import { onAuthStateChanged } from "firebase/auth";
import Plataformas from "./views/Plataformas.vue";
import FinishShift from "./components/shifts/FinishShift.vue";

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/finalizar", component: FinishShift},
    { path: "/modelos", component: Dashboard, meta: { requiresAuth: false } },
    { path: "/plataformas", component: Plataformas, meta: { requiresAuth: false } },
    { path: "/modelos/:id", component: Modelo, meta: { requiresAuth: false } },
    { path: "/turnos/:id", component: TurnoF, meta: { requiresAuth: false } },
    { path: "/modelos/create", component: ModeloF, meta: { requiresAuth: false } },
    { path: "/modelos/edit/:id", component: ModeloF, meta: { requiresAuth: false } },
];


export const router = createRouter({
        history: createWebHistory(),
        routes
    }
);

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    onAuthStateChanged(auth, user => {
        if (requiresAuth && !user) {
            next('/login');
        } else {
            next();
        }
    });
});