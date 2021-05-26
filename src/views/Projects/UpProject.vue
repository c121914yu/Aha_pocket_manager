<template>
	<div class="up-project">
		<BaseInfo 
			ref="baseInfo" 
			class="item"
			@createProject="createProject">
		</BaseInfo>
		<IntroInfo ref="introInfo" class="item"></IntroInfo>
	</div>
</template>

<script>
import { createProject,postMember } from "@/assets/axios/api_project.js"
import BaseInfo from "./components/BaseInfo.vue"
import IntroInfo from "./components/Intro.vue"
export default{
	components:{
		BaseInfo,
		IntroInfo
	},
	methods: {
		/* 创建项目，调用创建API，成功后跳转边界界面 */
		createProject(e)
		{
			/* 获取Intro */
			e.intro = this.$refs.introInfo.html
			console.log(e)
			/* 调用API创建项目，获取到项目ID */
			createProject(e)
			.then(res => {
				console.log(res);
			})
			this.$store.commit("setLoading",false)
			/* 创建一个项目成员 */
			/* 跳转项目编辑界面 */
			// this.$router.push("/project/edit/161")
		}
	}
}
</script>

<style lang="stylus">
.up-project
	min-width 1000px
	display grid
	grid-template-columns 1fr 2fr
	.item
		padding 5px
	.form
		margin-top 10px
		.el-input
			margin-right 10px
			width 300px
</style>
