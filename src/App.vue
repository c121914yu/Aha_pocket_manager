<template>
	<div id="app">
		<!-- 加载 -->
		<Loading v-if="$store.state.loading"></Loading>
		<!-- 登录 -->
		<router-view v-if="!$route.meta.alone && !$store.state.token"/>
		<!-- 主要界面 -->
		<el-container v-else-if="$route.meta.alone">
			<router-view/>
		</el-container>
		<el-container v-else-if="$store.state.token">
			<el-header>
				<TopNav></TopNav>
			</el-header>
			<el-container>
				<el-aside width="170px">
					<LeftNav></LeftNav>
				</el-aside>
				<el-main>
					<router-view/>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import Loading from './components/Loading'
import LeftNav from './components/LeftNav'
import TopNav from './components/TopNav'
import { getMe } from '@/assets/axios/api_user.js'

export default {
	created() {
		const token = sessionStorage.getItem("token") || ""
		console.log(token);
		if(token){
			getMe()
			.then(res => {
				this.$store.commit("successLogin",{
					token,
					personalUserInfo: res.data
				})
			})
		}
	},
	components: {
		Loading,
		LeftNav,
		TopNav
	}
}
</script>

<style lang="stylus">
@import './assets/common.styl'

#app
	.el-header
		padding 0
	.el-aside
		height calc(100vh - 60px)
	.el-main
		height calc(100vh - 60px)
</style>
