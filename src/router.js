import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('./components/Index.vue')
    },
    {
        path: '/teacher/qa/list',
        name: 'QAList',
        component: () => import('./components/Teacher/QA/List.vue')
    },
    {
        path: '/teacher/qa/q/:id',
        name: 'QADetail',
        component: () => import('./components/Teacher/QA/Detail.vue')
    },
    {
        path: '/teacher/qa/new',
        name: 'QANew',
        component: () => import('./components/Teacher/QA/New.vue')
    },
    {
        path: '/teacher/qa/market/list',
        name: 'QAMarketList',
        component: () => import('./components/Teacher/QA/Market/List.vue')
    },
    {
        path: '/teacher/ws/list',
        name: 'WSList',
        component: () => import('./components/Teacher/WS/List.vue')
    },
    {
        path: '/teacher/ws/detail/:id',
        name: 'WSDetail',
        component: () => import('./components/Teacher/WS/Detail.vue')
    },
]

const router = new VueRouter({
    routes
})

export default router
