<template>
	<div class="notice">
		<h1>系统公告</h1>
		<el-button 
			class="btn-publish" 
			type="primary" 
			icon="el-icon-edit"
			@click="is_sendNotice=true">
			发布系统公告
		</el-button>
		<el-table 
			ref="table"
			style="width: 100%"
			stripe
			:data="arr_notice"
			@filter-change="fileterChange">
			<el-table-column
				label="ID"
				width="100"
				prop="id"
				align="center">
			</el-table-column>
			<el-table-column
				label="发布时间"
				prop="time"
				align="center">
				<template slot-scope="scope">
					<div class="create-time" v-html="scope.row.time"></div>
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
				label="阅读人数"
				align="center"
				prop="readUser">
			</el-table-column>
			<el-table-column 
				label="操作"
				align="center">
				<template slot-scope="scope">
					<el-button type="danger" size="mini">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<p 
			class="show-remind center"
			:style="{
				cursor: isShowAll ? 'default' : 'pointer'
			}">
			{{isShowAll ? "已加载全部" : "点击加载更多"}}
		</p>
	
		<IntroCard v-if="showIntro" title="公告内容" :html="showIntro" @close="showIntro=''"></IntroCard>
		<SendInform 
			v-if="is_sendNotice" 
			:receiver="obj_receiver" 
			@close="is_sendNotice=false" 
			@success="sendNotice"></SendInform>
	</div>
</template>

<script>
import { getMessages } from "@/assets/axios/api.js"
import IntroCard from "@/components/IntroCard/IntroCard.vue"
import SendInform from "@/components/SendInform/SendInform.vue"
export default{
	data(){
		return{
			searchText: "",
			sortBy: null,
			orderBy: null,
			pageNum: 1,
			pageSize: 30,
			isShowAll: false,
			arr_notice: [
				{id:1,time:"2020/5/5\n20:10",title:"系统维护",content:"adgfdas搭嘎撒多多所多所所",readUser:50},
				{id:2,time:"2020/5/4\n20:10",title:"系统维护",content:"adgfdas搭嘎撒多多所多所所",readUser:100},
				{id:3,time:"2020/5/5\n10:10",title:"系统维护",content:"adgfdas搭嘎撒多多所多所所",readUser:230},
				{id:4,time:"2020/5/2\n20:10",title:"系统维护",content:"adgfdas搭嘎撒多多所多所所",readUser:22},
			],
			showIntro: "",
			is_sendNotice: false,
			obj_receiver: {
				title: "发布系统公告",
				trueName: "全体成员"
			}
		}
	},
	components: {
		IntroCard,
		SendInform
	},
	created() {
	},
	methods:{
		/* 发布系统公告 */
		sendNotice(e)
		{
			console.log(e);
			this.is_sendNotice = false
		},
		/* 筛选改变 */
		fileterChange(filters)
		{
			for(let key in filters){
				const res = filters[key]
				if(res.length === 0)
					this[key] = null
				else
					this[key] = res[0]
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
	.create-time
		white-space pre-line
	.add-btn
		position absolute
		right 0
		top 0
	.show-remind
		margin-top 10px
		color var(--gray)
	.table-icon
		font-size 1.4em
</style>
