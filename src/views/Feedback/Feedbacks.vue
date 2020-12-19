<!-- 用户反馈 -->
<template>
	<div class="feedback">
		<h1>用户反馈</h1>
		<el-table
			style="width: 100%"
			stripe
			:data="arr_feedBack"
			@filter-change="fileterChange">
			<el-table-column
				label="ID"
				prop="id"
				align="center">
			</el-table-column>
			<el-table-column
				label="反馈时间"
				prop="time"
				align="center">
				<template slot-scope="scope"> 
					<div class="feedback-time" v-html="scope.row.time"></div>
				</template>
			</el-table-column>
			<el-table-column
				label="反馈用户"
				prop="user.nickname"
				align="center">
			</el-table-column>
			<el-table-column
				label="反馈类型"
				:filters="[{ text: '未处理', value: 0 },{ text: '处理中', value: 1 },{ text: '已解决', value: 2 }]"
				filter-placement="bottom-end"
				:filter-multiple="false"
				:filter-method="(value, feedback) => feedback.type === value"
				column-key="type"
				prop="type"
				align="center">
			</el-table-column>
			<el-table-column
				label="反馈内容"
				align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="showIntro=scope.row.description">查看反馈内容</el-button>
				</template>
			</el-table-column>
			<el-table-column
				label="反馈状态"
				align="center"
				:filters="[{ text: '未处理', value: 0 },{ text: '处理中', value: 1 },{ text: '已解决', value: 2 }]"
				filter-placement="bottom-end"
				:filter-multiple="false"
				:filter-method="(value, feedback) => feedback.status === value"
				column-key="status"
				prop="status">
				<template slot-scope="scope">
					<div v-if="scope.row.status === 0" >
						<i class="status el-icon-question"></i>
					</div>
					<div v-else-if="scope.row.status === 1" >
						<i
							style="color: #409EFF;"
							class="status el-icon-time">
						</i>
						<p class="deal-time"><small>{{scope.row.dealTime}}</small></p>
					</div>
					<div v-else>
						<i
							style="color: #67C23A;"
							class="status el-icon-success">
						</i>
						<p class="deal-time"><small>{{scope.row.dealTime}}</small></p>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="170">
				<template slot-scope="scope">
					<!-- 未处理状态 -->
					<div v-if="scope.row.status === 0">
						<el-button type="primary" size="mini">受理</el-button>
					</div>
					<!-- 处理中状态 -->
					<div v-else-if="scope.row.status === 1">
						<el-select 
							class="feedback-result"
							size="mini" 
							placeholder="反馈结果类型"
							v-model="feedbackResult">
						    <el-option
						      v-for="item in arr_feedbackResult"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
						<el-button type="success" size="mini">已解决</el-button>
					</div>
					<!-- 已解决状态 -->
					<div v-else style="color: var(--gray);">
						{{scope.row.feedbackResult}}
					</div>
				</template>
			</el-table-column>
		</el-table>
		<IntroCard v-if="showIntro" title="反馈内容" :html="showIntro" @close="showIntro=''"></IntroCard>
	</div>
</template>

<script>
import IntroCard from "@/components/IntroCard/IntroCard.vue"
export default{
	data(){
		return{
			arr_feedBack: [
				{id:1,time:"2020/12/19\n20:50",user:{nickname:"余金隆"},type:0,description:"萨嘎发打撒噶D噶的爱读后感啊",status:0,dealTime:"2020/12/19 20:20",feedbackResult:""},
				{id:2,time:"2020/12/18\n20:50",user:{nickname:"余金隆"},type:1,description:"萨嘎发打撒噶D噶的爱读后感啊",status:1,dealTime:"2020/12/19 20:20",feedbackResult:""},
				{id:3,time:"2020/12/20\n20:50",user:{nickname:"余金隆"},type:2,description:"萨嘎发打撒噶D噶的爱读后感啊",status:2,dealTime:"2020/12/19 20:20",feedbackResult:"中等问题"},
				{id:4,time:"2020/12/19\n21:50",user:{nickname:"余金隆"},type:3,description:"萨嘎发打撒噶D噶的爱读后感啊",status:0,dealTime:"2020/12/19 20:20",feedbackResult:""},
			],
			showIntro: "",
			feedbackResult: "",
			arr_feedbackResult: [
				{label:"无效反馈",value:0},
				{label:"轻微问题",value:1},
				{label:"中等问题",value:2},
				{label:"严重问题",value:3}
			]
		}
	},
	components: {
		IntroCard
	},
	methods: {
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
	}
}
</script>

<style lang="stylus" scoped>
.feedback
	position relative
	h1
		margin-bottom 10px
		color var(--blue)
	.feedback-time
		white-space pre-line
	.status
		font-size 20px 
	.feedback-result
		width 130px
		margin-bottom 5px
</style>
