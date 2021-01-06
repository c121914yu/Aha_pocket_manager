<!-- 用户反馈 -->
<template>
	<div class="feedback">
		<h1>用户反馈</h1>
		<el-table
			style="width: 100%"
			stripe
			highlight-current-row
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
				:filters="arr_feedbackTypes"
				filter-placement="bottom-end"
				:filter-multiple="false"
				column-key="filter_type"
				prop="type"
				align="center">
			</el-table-column>
			<el-table-column
				label="反馈内容"
				align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="showIntro=scope.row.content">查看反馈内容</el-button>
				</template>
			</el-table-column>
			<el-table-column
				label="反馈状态"
				align="center"
				:filters="[{ text: '未处理', value: 0 },{ text: '处理中', value: 1 },{ text: '已解决', value: 2 }]"
				filter-placement="bottom-end"
				:filter-multiple="false"
				column-key="filter_status"
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
						<el-button type="primary" size="mini" @click="deal(scope.row)">受理</el-button>
					</div>
					<!-- 处理中状态 -->
					<div v-else-if="scope.row.status === 1">
						<el-select 
							class="feedback-result"
							size="mini" 
							placeholder="反馈结果类型"
							v-model="scope.row.feedbackResult">
						    <el-option
						      v-for="item in arr_feedbackResult"
						      :key="item.value"
						      :label="item.text"
						      :value="item.value">
						    </el-option>
						  </el-select>
						<el-button type="success" size="mini" @click="solve(scope.row)">已解决</el-button>
					</div>
					<!-- 已解决状态 -->
					<div v-else style="color: var(--gray);">
						{{scope.row.feedbackResult}}
					</div>
				</template>
			</el-table-column>
		</el-table>
		<p class="center remark">{{is_loadAll ? "已加载全部" : ""}}</p>
		<IntroCard v-if="showIntro" title="反馈内容" :html="showIntro" @close="showIntro=''"></IntroCard>
	</div>
</template>

<script>
import { getFeedbacks,putFeedback } from "@/assets/axios/api_user.js"
import IntroCard from "@/components/IntroCard/IntroCard.vue"
export default{
	data(){
		return{
			pageNum: 1,
			pageSize: 20,
			filter_type: null,
			filter_status: null,
			is_loadAll: false,
			arr_feedBack: [],
			showIntro: "",
			arr_feedbackTypes: [
				{text: "平台BUG",value: 0},
				{text: "平台体验修改建议",value: 1},
				{text: "劣质项目",value: 2},
				{text: "订单缺失/购买错误",value: 3},
			],
			arr_feedbackResult: [
				{text:"无效反馈",value:0},
				{text:"轻微问题",value:1},
				{text:"中等问题",value:2},
				{text:"严重问题",value:3}
			],
		}
	},
	components: {
		IntroCard
	},
	created() {
		this.getFeedbackInfo(true)
	},
	methods: {
		/* 获取反馈 */
		getFeedbackInfo(init=false)
		{
			if(init){
				this.pageNum = 1
			}
			getFeedbacks({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				type: this.filter_type,
				status: this.filter_status
			})
			.then(res => {
				if(res.data.pageData.length < this.pageSize){
					this.is_loadAll = true
				}
				else{
					this.pageNum++
				}
				const data = res.data.pageData.map(feedback => {
					const type = this.arr_feedbackTypes.find(item => item.value === feedback.type)
					const feedbackResult = this.arr_feedbackResult.find(item => item.value === feedback.level)
					return{
						...feedback,
						time: this.gformatDate(feedback.time,true),
						type: type.text,
						feedbackResult: feedbackResult ? feedbackResult.text : undefined
					}
				})
				this.arr_feedBack = init ? data : this.arr_feedBack.concat(data)
				console.log(this.arr_feedBack);
			})
		},
		/* 受理反馈，修改status为1，reply为您的问题正在处理，感谢您的反馈。 */
		deal(feedback)
		{
			this.$confirm("确认受理该反馈？",() => {
				putFeedback({
					id: feedback.id,
					status: 1,
					reply: "您的问题正在处理，感谢您的反馈。"
				})
				.then(res => {
					this.$showSuccess("受理成功")
					this.arr_feedBack[this.arr_feedBack.indexOf(feedback)].status = 1
				})
			})
		},
		/* 解决反馈问题，需要填写反馈类型，后台根据问题类型发放贡献点 */
		solve(feedback)
		{
			if(feedback.feedbackResult === undefined){
				this.$showWarn("反馈结果不能为空")
				return
			}
			this.$confirm("确认解决该反馈？",() => {
				putFeedback({
					id: feedback.id,
					status: 2,
					reply: "您的反馈已解决,感谢您的反馈。",
					level: feedback.feedbackResult
				})
				.then(res => {
					this.$showSuccess("处理成功")
					this.arr_feedBack[this.arr_feedBack.indexOf(feedback)].status = 2
					this.arr_feedBack[this.arr_feedBack.indexOf(feedback)].feedbackResult = this.arr_feedbackResult[feedback.feedbackResult].text
				})
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
			this.getFeedbackInfo(true)
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
	.remark
		margin-top 10px
		color var(--gray)
</style>
