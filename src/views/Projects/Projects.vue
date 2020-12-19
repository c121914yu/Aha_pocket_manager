<template>
	<div class="projects">
		<h1>项目管理</h1>
		<header>
			<!-- 搜索框 -->
			<el-input placeholder="输入作者手机号" v-model="searchText">
				<el-button
					slot="append"
					class="search-btn"
					icon="el-icon-search"
					@click="getProjectsData(true)">
				</el-button>
			</el-input>
			<el-button
				class="reset-btn"
				icon="el-icon-refresh-left"
				@click="reset">
			</el-button>
			<!-- 筛选列表 -->
			<div>
				<span class="select">
					<span>参与赛事</span>
					<el-select
						class="select-comp"
						clearable 
						placeholder="请选择" 
						v-model="filterComp"
						@change="getProjectsData(true)">
						<el-option
							v-for="(item,index) in compList"
							:key="index"
							:label="item.name"
							:value="item.compTagId">
						</el-option>
					</el-select>
				</span>
				<span class="select">
					<span>获奖等级</span>
					<el-select 
						clearable 
						placeholder="请选择" 
						v-model="filterLevel"
						@change="getProjectsData(true)">
						<el-option
							v-for="(item,index) in prizeLevels"
							:key="index"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</span>
			</div>
		</header>
		<el-table 
			ref="table"
			style="width: 100%"
			stripe
			:data="projects"
			@sort-change="sortChange"
			@filter-change="fileterChange">
			<el-table-column
				label="ID"
				width="100"
				prop="id">
			</el-table-column>
			<el-table-column
				label="项目标题"
				min-width="150"
				prop="name">
			</el-table-column>
			<el-table-column
				label="参与赛事"
				min-width="150px"
				prop="compName">
			</el-table-column>
			<el-table-column
				label="获奖等级"
				align="center"
				min-width="120px"
				sortable
				:sort-method="awardLevelSort"
				:sort-orders="['descending', null]"
				prop="awardLevel.label">
			</el-table-column>
			<el-table-column
				label="阅读"
				align="center"
				sortable
				prop="read">
			</el-table-column>
			<el-table-column
				label="收藏"
				align="center"
				sortable
				prop="collect">
			</el-table-column>
			<el-table-column
				label="标签"
				align="center"
				prop="tags">
			</el-table-column>
			<el-table-column
				label="项目状态"
				align="center"
				width="120"
				:filters="[{ text: '已通过', value: true }, { text: '未通过', value: false }]"
				filter-placement="bottom-end"
				:filter-multiple="false"
				:filter-method="(value, project) => project.passed === value"
				column-key="passed"
				prop="passed">
				<template slot-scope="scope">
					<i v-if="scope.row.passed" class="success el-icon-success"></i>
					<i v-else class="none el-icon-error"></i>
				</template>
			</el-table-column>
			<el-table-column 
				label="操作"
				align="center">
				<template slot-scope="scope">
					<router-link :to="'/project/' + scope.row.id">
						<el-button size="mini">Edit</el-button>
					</router-link>
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
	</div>
</template>

<script>
import { getProjects } from "@/assets/axios/api.js"
export default {
  data(){
		const prizeLevels = this.$store.state.prizeLevels
		return {
			searchText: "",
			sortBy: null,
			orderBy: null,
			pageNum: 1,
			pageSize: 30,
			isShowAll: false,
			projects: [],
			filterLevel: "",
			filterComp: "",
			passed: null,
			prizeLevels
		}
	},
	computed: {
		compList(){
			return this.$store.state.compList
		}
	},
	created() {
		this.getProjectsData()
	},
	methods: {
		/* 
			name: get projects
			desc: get projects by params
			params:
					pageNum: Number
					pageSize: Number
					phone: String,author phone
					awardLevel: int
			time: 2020/11/29
		*/
		getProjectsData(clear=false)
		{
			if(clear)
				this.pageNum = 1
			const data = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortBy,
				orderBy: this.orderBy,
				compId: this.filterComp || null,
				awardLevel: this.filterLevel || null,
				passed: this.passed
			}
			data.phone = this.searchText || null
			getProjects(data)
			.then(res => {
				const resArr = res.data.pageData.map(project => {
					/* 查找参与比赛 */
					let competition = this.$store.state.compList.find(item => item.compTagId === project.compId)
					project.compName = competition ? competition.name : ""
					/* 查找获奖等级 */
					const level = this.prizeLevels.find(item => project.awardLevel === item.value)
					project.awardLevel = level || {label: "",value: 0}
					/* 格式化标签 */
					if(project.tags)
						project.tags = project.tags.replace(/\s+/g,",")
					return project
				})
				if(clear)
					this.projects = resArr
				else
					this.projects = this.projects.concat(resArr)
				console.log(this.projects);
				/* 判断是否是最后一页 */
				if(res.data.pageSize < this.pageSize)
					this.isShowAll = true
				else{
					this.isShowAll = false
					this.pageNum++
				}
			})
		},
		/* 重置 */
		reset()
		{
			this.searchText = ""
			this.sortBy = null
			this.orderBy = null
			this.$refs.table.clearSort()
			this.$refs.table.clearFilter()
			this.getProjectsData(true)
		},
		/* 排序方式 */
		awardLevelSort(a,b)
		{
			return a.awardLevel.value - b.awardLevel.value
		},
		/* 排序发生改变 */
		sortChange(column)
		{
			/* 判断排序标志是否含. */
			const reg = /\./
			if(reg.test(column.prop))
				column.prop = column.prop.split(".")[0]
			this.sortBy = column.order ? column.prop : null
			if(column.order)
				this.orderBy = column.order === "descending" ? "desc" : "asc"
			else
				this.orderBy = column.order
			this.getProjectsData(true)
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
			this.getProjectsData(true)
		},
		/* 
			name: handleShowMore
			desc: if not showAll,request more users data
			time: 2020/11/29
		*/
		handleShowMore()
		{
			if(this.isShowAll)
				return
			this.getProjectsData()
		},
	},
}
</script>

<style lang="stylus" scoped>
.projects
	h1
		margin-bottom 10px
		color var(--blue)
	header
		.el-input
			margin-bottom 10px
			max-width 500px
		.el-select
			width 150px
		.search-btn:hover
			background-color #ecf5ff
			color #409EFF
		.select
			margin-right 10px
			span
				margin-right 10px
		.select-comp
			width 280px
	i
		font-size 1.4em
	.success
		color var(--green)
	.none
		color var(--gray)
	.show-remind
		margin-top 10px
		color var(--gray)
</style>