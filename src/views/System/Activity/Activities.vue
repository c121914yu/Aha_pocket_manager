<template>
	<div class="activities">
		<h2>活动管理</h2>
		<el-button 
			class="add-btn" 
			icon="el-icon-circle-plus-outline" 
			type="primary" 
			size="small" 
			@click="editActivity = {}">
			发布新活动
		</el-button>
		<el-table
			ref="table"
			style="width: 100%"
			stripe
			:data="arr_activities"
			:infinite-scroll-disabled="is_showAll"
			v-infinite-scroll="getActivitiesInfo"
			infinite-scroll-distance="30">
			<el-table-column label="ID" width="100px" prop="id"></el-table-column>
			<el-table-column 
				label="创建时间" 
				sortable 
				width="105px" 
				column-key="date" 
				prop="createTime" 
				align="center">
			</el-table-column>
			<el-table-column
				label="有效时间" 
				width="130px" 
				align="center">
				<template slot-scope="scope">
					<div>{{scope.row.startTime}}</div>
					<div>{{scope.row.endTime}}</div>
				</template>
			</el-table-column>
			<el-table-column label="活动名" prop="title" align="center"></el-table-column>
			<el-table-column
				label="活动介绍"
				align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="introMsg=scope.row.intro">查看活动介绍</el-button>
				</template>
			</el-table-column>
			<el-table-column label="可生成兑换码数量" align="center">
				<template slot-scope="scope">
					{{scope.row.codeSum - scope.row.unUse}}
				</template>
			</el-table-column>
			<el-table-column 
				label="价值" 
				align="center">
				<template slot-scope="scope">
					<div>{{scope.row.exchangeAhaCredit}}Aha币</div>
					<div>{{scope.row.exchangeAhaPoint}}Aha点</div>
				</template>
			</el-table-column>
			<el-table-column class="btns" label="操作" align="center">
				<template slot-scope="scope">
					<el-button size="mini" @click="getCode(scope.row)">生成兑换码</el-button>
					<el-button size="mini" type="danger" @click="removeActivity(scope.row)">Delete</el-button>
				</template>
			</el-table-column>
		</el-table>
		<p class="show-remind center">{{ is_showAll ? '已加载全部' : '' }}</p>
		<IntroCard v-if="introMsg" title="活动介绍" :html="introMsg" @close="introMsg=''"></IntroCard>
		<EditActivity 
			v-if="editActivity" 
			:activityInfo="editActivity" 
			@close="editActivity=null" 
			@finish="getActivitiesInfo(true)">
		</EditActivity>
	</div>
</template>

<script>
import { getActivitiy,deleteActivity,getCDKEY,getUnuserCDKEY } from '@/assets/axios/api_system.js';
import IntroCard from "@/components/IntroCard/IntroCard.vue"
import EditActivity from "./EditActivity.vue"
export default {
	data() {
		return {
			pageNum: 1,
			pageSize: 15,
			is_showAll: false,
			arr_activities: [],
			introMsg: "",
			editActivity: null
		}
	},
	components: {
		IntroCard,
		EditActivity
	},
	created() {
		this.getActivitiesInfo(true);
	},
	methods: {
		/* 获取活动信息 */
		getActivitiesInfo(init = false) 
		{
			this.editActivity = null
			this.is_showAll = true
			if (init) {
				this.pageNum = 1
			}
			getActivitiy({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
			})
			.then(res => {
				/* 判断是否是最后一页 */
				if(res.data.pageData.length < this.pageSize){
					this.is_showAll = true
				}
				else{
					this.is_showAll = false
					this.pageNum++
				}
				if (init) {
					this.arr_activities = [];
				}
				const update = (id,index) => {
					/* 获取未读 */
					getUnuserCDKEY(id)
					.then(res => {
						this.arr_activities[index].unUse = res.data
					})
				}
				res.data.pageData.forEach(item => {
					item.createTime = this.gformatDate(item.createTime,true)
					item.startTime = this.gformatDate(item.startTime)
					item.endTime = this.gformatDate(item.endTime)
					item.unUse = 0
					this.arr_activities.push(item)
					update(item.id,this.arr_activities.length-1)
				})
				console.log(res.data.pageData);
			});
		},
		/* 生成兑换码 */
		getCode(activity)
		{
			this.$prompt('输入兑换码数量', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /\d/,
				inputErrorMessage: '格式错误'
			})
			.then(({ value }) => {
				if(Number(value) > activity.codeSum-activity.unUse){
					this.$showWarn("兑换码数量不足")
				}
				else{
					getCDKEY({
						activityId: activity.id,
						count: value
					})
					.then(res => {
						this.arr_activities[this.arr_activities.indexOf(activity)].unUse += Number(value)
						var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(`兑换码\n${res.data.join("\n")}`)
						var downloadLink = document.createElement("a")
						downloadLink.href = uri
						downloadLink.download = "兑换码.csv"
						document.body.appendChild(downloadLink)
						downloadLink.click()
						document.body.removeChild(downloadLink)
					})
				}
			})
		},
		/* 删除活动 */
		removeActivity(activity)
		{
			this.$confirm("确认删除该活动?",() => {
				deleteActivity(activity.id)
				.then(res => {
					this.$showWarn("删除成功")
					this.getActivitiesInfo(true)
				})
			})
		}
	}
};
</script>

<style lang="stylus" scoped>
.activities
	position relative
	min-width 1070px
	white-space pre-line
	h2
		margin-bottom 10px
		color var(--blue)
	.add-btn
		position absolute
		top 0
		right 10px
	.el-button
		margin 5px auto
		display block
	.show-remind
		margin-top 10px
		color var(--gray)
</style>
