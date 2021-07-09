Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

import store from '@/store'

const routes = [
	{
		path: '/admin',
		name: 'Login',
		meta: {
			login: false
		},
		component: () => import('../views/Login/Login.vue')
	},
	{
		path: '/admin/datashow',
		name: 'DataShow',
		meta: {
			login: true,
		},
		component: () => import('../views/DataShow/DataShow.vue')
	},
	{
		path: '/admin/users',
		name: 'Users',
		meta: {
			login: true,
			alive: true,
		},
		component: () => import('../views/Users/Users.vue')
	},
	{
		path: '/admin/userInfo/:id',
		name: 'UserInfo',
		meta: {
			login: true
		},
		component: () => import('../views/Users/UserInfo.vue')
	},
	{
		path: '/admin/resume/:id',
		name: 'Resume',
		meta: {
			alone: true
		},
		component: () => import('../views/Users/Resume.vue')
	},
	{
		path: '/admin/projects',
		name: 'Projects',
		meta: {
			login: true,
			alive: true,
		},
		component: () => import('../views/Projects/Projects.vue')
	},
	{
		path: '/admin/project/:id',
		name: 'Project',
		meta: {
			login: true
		},
		component: () => import('../views/Projects/Project.vue')
	},
	{
		path: '/admin/resource/read/:id',
		name: 'ReadFile',
		meta: {
			login: true
		},
		component: () => import('../views/Projects/ReadFile.vue')
	},
	{
		path: '/admin/orders',
		name: 'Orders',
		meta: {
			login: true,
		},
		component: () => import('../views/Orders/Orders.vue')
	},
	{
		path: '/admin/feedbacks',
		name: 'Feedbacks',
		meta: {
			login: true,
		},
		component: () => import('../views/Feedback/Feedbacks.vue')
	},
	{
		path: '/admin/informs',
		name: 'Informs',
		meta: {
			login: true,
		},
		component: () => import('../views/Informs/Informs.vue')
	},
	/* 系统相关 */
	{
		path: '/admin/slidecard',
		name: 'SlideCard',
		meta: {
			login: true,
		},
		component: () => import('../views/System/SlideCard/SlideCard.vue')
	},
	{
		path: '/admin/activities',
		name: 'Activities',
		meta: {
			login: true,
		},
		component: () => import('../views/System/Activity/Activities.vue')
	},
	{
		path: '/admin/notice',
		meta: {
			login: true,
		},
		name: "Notice",
		component: () => import('../views/System/Notice/Notice.vue')
	},
	{
		path: '/admin/competitions',
		name: 'Competitions',
		meta: {
			login: true,
		},
		component: () => import('../views/System/Competition/Competitions.vue')
	},
	{
		path: '/admin/forumtags',
		name: 'ForumTags',
		meta: {
			login: true,
			alive: true,
		},
		component: () => import('../views/System/Forum/ForumTags.vue')
	},
	{
		path: '/admin/admin',
		name: 'Admin',
		meta: {
			login: true
		},
		component: () => import('../views/System/Admin/Admin.vue')
	},
	{
		path: '/',
		redirect: "/admin",
	},
	{
		path: '*',
		component: () => import('../views/404.vue')
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

/* 路由守卫 */
router.beforeEach((to, from, next) => {
	if(to.meta.alone){
		next()
	}
	else if (to.meta.login && !sessionStorage.getItem("token")) {
		Vue.prototype.$showWarn("请先登录")
		next({
			path: "/"
		})
	} 
	else{
		next()
	}
})

export default router
