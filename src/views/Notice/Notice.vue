<template>
	<div class="notice">
		<h1>系统公告</h1>
		<el-button 
			class="btn-publish" 
			type="primary" 
			icon="el-icon-edit"
			@click="is_editNotice=true">
			发布系统公告
		</el-button>
		<el-table 
			ref="table"
			style="width: 100%"
			stripe
			:data="arr_notice">
			<el-table-column
				label="ID"
				width="100"
				prop="id"
				align="center">
			</el-table-column>
			<el-table-column
				label="创建时间"
				prop="createTime"
				align="center">
				<template slot-scope="scope">
					<div class="time" v-html="gformatDate(scope.row.createTime,true)"></div>
				</template>
			</el-table-column>
			<el-table-column
				label="开始时间"
				prop="puttingStartTime"
				align="center">
				<template slot-scope="scope">
					<div class="time" v-html="gformatDate(scope.row.puttingStartTime,true)"></div>
				</template>
			</el-table-column>
			<el-table-column
				label="结束时间"
				prop="puttingEndTime"
				align="center">
				<template slot-scope="scope">
					<div class="time" v-html="gformatDate(scope.row.puttingEndTime,true)"></div>
				</template>
			</el-table-column>
			<el-table-column
				label="主题"
				prop="title"
				align="center">
			</el-table-column>
			<el-table-column
				label="内容"
				align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="showIntro=scope.row.content">查看通知内容</el-button>
				</template>
			</el-table-column>
			<el-table-column
				label="是否启用"
				prop="enable"
				align="center">
				<template slot-scope="scope">
					<i v-if="scope.row.enable" class="icon success el-icon-success"></i>
					<i v-else class="icon none el-icon-error"></i>
				</template>
			</el-table-column>
			<el-table-column 
				label="操作"
				align="center">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="inEdit(scope.row)">Edit</el-button>
				</template>
			</el-table-column>
		</el-table>
	
		<IntroCard v-if="showIntro" title="公告内容" :html="showIntro" @close="showIntro=''"></IntroCard>
		<EditNotice
			v-if="is_editNotice" 
			:noticeInfo="noticeInfo"
			@close="is_editNotice=false" 
			@success="editNotice">
		</EditNotice>
	</div>
</template>

<script>
import { getNotices,sendNotice,putNotice } from "@/assets/axios/api_message.js"
import IntroCard from "@/components/IntroCard/IntroCard.vue"
import EditNotice from "@/components/EditNotice/EditNotice.vue"
export default{
	data(){
		return{
			searchText: "",
			sortBy: null,
			orderBy: null,
			arr_notice: [],
			showIntro: "",
			noticeInfo: {},
			is_editNotice: false,
		}
	},
	components: {
		IntroCard,
		EditNotice
	},
	created() {
		this.getNoticesInfo()
	},
	methods:{
		/* 获取 */
		getNoticesInfo()
		{
			getNotices()
			.then(res => {
				this.arr_notice = res.data
				console.log(this.arr_notice)
			})
		},
		/* 进入编辑 */
		inEdit(notice)
		{
			this.noticeInfo = notice
			this.is_editNotice = true
		},
		/* 发布系统公告 */
		editNotice(e)
		{
			if(this.noticeInfo.id){
				this.$confirm(`您将修改系统公告,请确认！`,() => {
					putNotice(e)
					.then(res => {
						this.$showSuccess("修改公告成功")
						this.is_editNotice = false
						this.noticeInfo = {}
						this.getNoticesInfo()
					})
				})
			}
			else{
				this.$confirm(`您将发布系统公告,请确认！`,() => {
					sendNotice(e)
					.then(res => {
						this.$showSuccess("发布公告成功")
						this.is_editNotice = false
						this.getNoticesInfo()
					})
				})
			}
		}
	},
}
</script>

<style lang="stylus" scoped>
.notice
	position relative
	h1
		margin-bottom 10px
		color var(--blue)
	.btn-publish
		position absolute
		top 0
		right 0
	.time
		white-space pre-line
	.icon
		font-size 20px
		&.success
			color var(--green)
		&.none
			color var(--gray)
</style>
