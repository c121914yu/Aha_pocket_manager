<template>
	<div class="projects">
		<h1>项目管理</h1>
		<header>
			<div>
				<!-- 搜索框 -->
				<el-input placeholder="输入搜索内容" v-model="searchText">
					<el-select slot="prepend" v-model="searchType">
						<el-option label="项目标题" value="name"></el-option>
						<el-option label="手机号" value="phone"></el-option>
						<el-option label="作者名" value="author"></el-option>
					</el-select>
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
			</div>
			<div class="competition">
				<span><strong>参与赛事</strong></span>
				<el-select 
					v-model="filterComp" 
					filterable 
					placeholder="筛选参与相关赛事的项目"
					clearable
					@change="getProjectsData(true)">
				    <el-option
				      v-for="(item,index) in arr_competion"
				      :key="item.id"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				</el-select>
			</div>
			<router-link :to="{name: 'UpProject'}">
				<el-button
					class="add-btn" 
					icon="el-icon-circle-plus-outline" 
					type="primary">
					添加项目
				</el-button>
			</router-link>
		</header>
		<el-table 
			ref="table"
			style="width: 100%"
			stripe
			:data="projects"
			:infinite-scroll-disabled="is_loadAll"
			v-infinite-scroll="getProjectsData"
			infinite-scroll-distance=600
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
				align="center"
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
				:sort-orders="['descending', null]"
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
					<router-link :to="'/admin/project/' + scope.row.id">
						<el-button size="mini">审阅</el-button>
					</router-link>
					<router-link :to="'/admin/project/edit/' + scope.row.id">
						<el-button style="margin-top: 5px;" type="primary" size="mini">编辑</el-button>
					</router-link>
				</template>
			</el-table-column>
		</el-table>
		<p class="remark center">{{is_loadAll ? "已加载全部" : "点击加载更多"}}</p>
	</div>
</template>

<script>
import { getProjects } from "@/assets/axios/api_project.js"
import { getComps } from "@/assets/axios/api_competition.js"
export default {
    data(){
		const arr_prizeLevels = this.$store.state.arr_prizeLevels
		return {
			searchText: "",
			searchType: "",
			sortBy: null,
			orderBy: null,
			pageNum: 1,
			pageSize: 30,
			filterComp: null,
			passed: null,
			is_loadAll: false,
			projects: [],
			arr_competion: [],
			arr_prizeLevels
		}
	},
	created() {
		if(!this.$store.state.arr_competitions){
			getComps()
			.then(res => {
				this.$store.state.arr_competitions = res.data
				this.arr_competion = res.data
				this.getProjectsData(true,true)
				// console.log(this.arr_competion)
			})
		}
		else{
			this.arr_competion = this.$store.state.arr_competitions
			this.getProjectsData(true,true)
		}
	},
	methods: {
		/*  get projects by params
			@params pageNum: Number
			@params	pageSize: Number
			@params	phone: String,author phone
			@params	awardLevel: int
			time: 2020/12/27
		*/
		getProjectsData(init=false,loading=false)
		{
			this.$store.commit("setLoading",loading)
			this.is_loadAll = true
			if(init){
				this.pageNum = 1
			}
			const parmas = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortBy,
				orderBy: this.orderBy,
				compId: this.filterComp || null,
				passed: this.passed
			}
			parmas.phone = this.searchText || null
			getProjects(parmas)
			.then(res => {
				if(init){
					this.projects = []
				}
				res.data.pageData.forEach(project => {
					/* 查找参与比赛 */
					let competition = this.arr_competion.find(item => item.id === project.compId)
					project.compName = competition ? competition.name : ""
					/* 查找获奖等级 */
					const level = this.arr_prizeLevels.find(item => project.awardLevel === item.value)
					project.awardLevel = level || {label: "",value: 0}
					/* 格式化标签 */
					if(project.tags){
						project.tags = project.tags.replace(/\s+/g,",")
					}
					this.projects.push(project)
				})
				this.$nextTick(() => {
					/* 判断是否是最后一页 */
					if(res.data.pageSize < this.pageSize){
						this.is_loadAll = true
					}
					else{
						this.is_loadAll = false
						this.pageNum++
					}
				})
				this.$store.commit("setLoading",false)
				console.log(this.projects);
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
			if(reg.test(column.prop)){
				column.prop = column.prop.split(".")[0]
			}
			this.sortBy = column.order ? column.prop : null
			if(column.order){
				this.orderBy = column.order === "descending" ? "desc" : "asc"
			}
			else{
				this.orderBy = column.order
			}
			this.getProjectsData(true)
		},
		/* 筛选改变 */
		fileterChange(filters)
		{
			for(let key in filters){
				const res = filters[key]
				if(res.length === 0){
					this[key] = null
				}
				else{
					this[key] = res[0]
				}
				console.log(this[key])
			}
			this.getProjectsData(true)
		}
	}
}
</script>

<style lang="stylus" scoped>
.projects
	position relative
	h1
		margin-bottom 10px
		color var(--blue)
	header
		.el-input
			margin-bottom 10px
			width 500px
		.el-select
			width 120px
		.search-btn:hover
			background-color #ecf5ff
			color #409EFF
		.competition
			span
				margin-right 10px
			.el-select
				width 490px
		.add-btn
			position absolute
			top 0
			right 10px
	i
		font-size 1.4em
	.success
		color var(--green)
	.none
		color var(--gray)
	.remark
		margin-top 10px
</style>