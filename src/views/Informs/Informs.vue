<template>
	<div class="informs">
		<h1>通知管理</h1>
		<el-table 
			ref="table"
			style="width: 100%"
			stripe
			:data="informs"
			@filter-change="fileterChange">
			<el-table-column
				label="ID"
				width="100"
				prop="id"
				align="center">
			</el-table-column>
			<el-table-column
				label="创建时间"
				prop="receiveDate"
				align="center">
				<template slot-scope="scope">
					<div class="create-time" v-html="scope.row.receiveDate"></div>
				</template>
			</el-table-column>
			<el-table-column
				label="接收人"
				prop="receiverUser.nickname"
				align="center">
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
				label="是否阅读"
				align="center"
				:filters="[{ text: '未读', value: 0 },{ text: '已读', value: 1 }]"
				filter-placement="bottom-end"
				:filter-multiple="false"
				:filter-method="(value, inform) => inform.status === value"
				column-key="status"
				prop="status">
				<template slot-scope="scope">
					<i 
						v-if="scope.row.status !== 0" 
						style="color: #67C23A;"
						class="table-icon el-icon-success">
					</i>
					<i 
						v-else 
						class="table-icon el-icon-error">
					</i>
				</template>
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
			}"
			@click="handleShowMore">
			{{isShowAll ? "已加载全部" : "点击加载更多"}}
		</p>
	
		<IntroCard v-if="showIntro" title="通知内容" :html="showIntro" @close="showIntro=''"></IntroCard>
	</div>
</template>

<script>
import { getMessages } from "@/assets/axios/api.js"
import IntroCard from "@/components/IntroCard/IntroCard.vue"
export default{
	data(){
		return{
			sortBy: null,
			orderBy: null,
			pageNum: 1,
			pageSize: 30,
			isShowAll: false,
			informs: [],
			showIntro: ""
		}
	},
	components: {
		IntroCard
	},
	created() {
		this.getMessagesList()
	},
	methods:{
		/* 获取消息列表 */
		getMessagesList(init=false)
		{
			if(init){
				this.pageNum = 1
			}
			getMessages({
				pageNum: this.pageNum,
				pageSize: this.pageSize
			})
			.then(res => {
				if(res.data.pageSize < this.pageSize){
					this.isShowAll = true
				}
				else{
					this.pageNum++
				}
				const data = res.data.pageData.map(item => {
					return{
						...item,
						receiveDate: item.receiveDate.replace(" ","\n")
					}
				})
				this.informs = init ? data : this.informs.concat(data)
				console.log(this.informs)
			})
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
		},
		/*
			name: handleShowMore
			desc: 如果没有加载全部，则继续加载
			time: 2020/11/29
		*/
		handleShowMore()
		{
			if(this.isShowAll){
				return
			}
			this.getProjectsData()
		},
	},
	
}
</script>

<style lang="stylus" scoped>
.informs
	position relative
	h1
		margin-bottom 10px
		color var(--blue)
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
