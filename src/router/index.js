import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

import store from '@/store'

const routes = [{
		path: '/',
		name: 'Login',
		meta: {
			login: false
		},
		component: () => import('../views/Login/Login.vue')
	},
	{
		path: '/datashow',
		name: 'DataShow',
		meta: {
			login: true,
		},
		component: () => import('../views/DataShow/DataShow.vue')
	},
	{
		path: '/users',
		name: 'Users',
		meta: {
			login: true,
		},
		component: () => import('../views/Users/Users.vue')
	},
	{
		path: '/userInfo/:id',
		name: 'UserInfo',
		meta: {
			login: true
		},
		component: () => import('../views/Users/UserInfo.vue')
	},
	{
		path: '/resume/:id',
		name: 'Resume',
		meta: {
			login: true,
			alone: true
		},
		component: () => import('../views/Users/Resume.vue')
	},
	{
		path: '/projects',
		name: 'Projects',
		meta: {
			login: true,
		},
		component: () => import('../views/Projects/Projects.vue')
	},
	{
		path: '/project/:id',
		name: 'Project',
		meta: {
			login: true
		},
		component: () => import('../views/Projects/Project.vue')
	},
	{
		path: '/orders',
		name: 'Orders',
		meta: {
			login: true,
		},
		component: () => import('../views/Orders/Orders.vue')
	},
	{
		path: '/competitions',
		name: 'Competitions',
		meta: {
			login: true,
		},
		component: () => import('../views/Competition/Competitions.vue')
	},
	{
		path: '/feedbacks',
		name: 'Feedbacks',
		meta: {
			login: true,
		},
		component: () => import('../views/Feedback/Feedbacks.vue')
	},
	{
		path: '/informs',
		name: 'Informs',
		meta: {
			login: true,
		},
		component: () => import('../views/Informs/Informs.vue')
	},
	{
		path: '/notice',
		name: 'Notice',
		meta: {
			login: true,
		},
		component: () => import('../views/Notice/Notice.vue')
	},
	{
		path: '/admin',
		name: 'Admin',
		meta: {
			login: true
		},
		component: () => import('../views/Admin/Admin.vue')
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

import {
	showWarn
} from "@/assets/js/globalFun.js"
/* 路由守卫 */
router.beforeEach((to, from, next) => {
	if (to.meta.login && !sessionStorage.getItem("token")) {
		showWarn("请先登录")
		next({
			path: "/"
		})
	} else
		next()
})

export default router
