<!-- /project/edit/:projectId -->
<template>
	<div v-if="projectId > 0" class="edit-project">
		<BaseInfo 
			ref="baseInfo" 
			class="item" 
			:projectId="projectId"
			@levelchange="awardLevel=$event">
		</BaseInfo>
		<Files 
			ref="files" 
			class="item" 
			:projectId="projectId"
			:level="awardLevel">
		</Files>
		<Members
			ref="members"
			class="item"
			:projectId="projectId">
		</Members>
		<IntroInfo 
			ref="introInfo" 
			class="intor-info"
			:projectId="projectId">
		</IntroInfo>
	</div>
</template>

<script>
import { getProject,getFiles } from "@/assets/axios/api_project.js"
import BaseInfo from "./components/BaseInfo.vue"
import Files from "./components/Files.vue"
import Members from "./components/Members.vue"
import IntroInfo from "./components/Intro.vue"
export default{
	data(){
		return{
			projectId: 0,
			awardLevel: null
		}
	},
	components:{
		BaseInfo,
		Files,
		Members,
		IntroInfo
	},
	created() {
		this.$store.commit("setLoading",true)
		getProject(this.$route.params.id)
		.then(res => {
			console.log(res.data);
			/* 初始化信息 */
			const project = res.data
			this.projectId = project.id
			this.$nextTick(() => {
				/* 基本信息 */
				this.$refs.baseInfo.baseInfo = {
					avatarUrl: project.avatarUrl || "https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png",
					name: project.name,
					tags: project.tags,
					compName: project.compName,
					awardLevel: project.awardLevel,
					awardTime: project.awardTime,
					awardProveUrl: project.awardProveUrl,
				}
				this.$refs.introInfo.value = res.data.intro
				/* 附件信息 */
				this.awardLevel = project.awardLevel
				getFiles({
					projectId: this.projectId,
					pageNum: 1,
					pageSize: 50
				})
				.then(res => {
					this.$refs.files.fileList = res.data.pageData.map(item => {
						return {
							id: item.id,
							name: item.name,
							price: item.price,
							typeId: item.typeId,
							fileType: item.fileType,
							progress: 100
						}
					})
				})
				/* 成员信息 */
				this.$refs.members.members = res.data.members.map((item,index) => {
					return {
						memberUserId: item.memberUser.userId,
						avatarUrl: item.memberUser.avatarUrl,
						nickname: item.memberUser.nickname,
						editable: item.editable,
						job: item.job,
						rank: item.rank,
						index,
						translate: 0
					}
				})
				this.$forceUpdate()
				this.$store.commit("setLoading",false)
			})
		})
		.catch(err => {
			this.$store.commit("setLoading",false)
		})
	}
}
</script>

<style lang="stylus">
.edit-project
	display grid
	grid-template-columns repeat(3,1fr)
	grid-gap 10px
	.item
		min-width 400px
		padding 10px
		background-color rgba(64,158,255,0.07)
		border-radius 8px
		box-shadow var(--shadow1)
	.intor-info,.btn
		grid-column 1/4
	.form
		margin-top 10px
		.el-input
			margin-right 10px
			width 300px
</style>
