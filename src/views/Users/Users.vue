<template>
	<div class="users">
		<header>
			<h2>用户管理</h2>
			<el-input placeholder="输入搜索内容" v-model="searchText">
				<el-select slot="prepend" placeholder="选择搜索类型" v-model="searchType">
					<el-option label="手机号" value="phoneLike"></el-option>
					<el-option label="昵称" value="nicknameLike"></el-option>
					<el-option label="真实姓名" value="trueNameLike"></el-option>
				</el-select>
				<el-button
					slot="append"
					class="search-btn"
					icon="el-icon-search"
					@click="getUserData(true)">
				</el-button>
			</el-input>
			<el-button
				class="reset-btn"
				icon="el-icon-refresh-left"
				@click="reset">
			</el-button>
		</header>
		<el-table 
			ref="table"
			style="width: 100%"
			stripe
			:data="users"
			:infinite-scroll-disabled="isShowAll"
			v-infinite-scroll="getUserData"
			infinite-scroll-distance=600
			@sort-change="sortChange"
			@filter-change="fileterChange">
			<el-table-column
				label="ID"
				width="100px"
				prop="id">
			</el-table-column>
			<el-table-column
				label="创建时间"
				sortable
				width="105px"
				column-key="date"
				prop="createdTime"
				align="center">
			</el-table-column>
			<el-table-column
				label="姓名/昵称"
				prop="name"
				align="center">
			</el-table-column>
			<el-table-column
				label="实名认证"
				align="center"
				prop="registration">
				<template slot-scope="scope">
					<i v-if="scope.row.registration" class="success el-icon-success"></i>
					<i v-else class="none el-icon-error"></i>
				</template>
			</el-table-column>
			<el-table-column
				label="绑定手机号"
				align="center"
				prop="phone">
				<template slot-scope="scope">
					<i v-if="scope.row.phone" class="success el-icon-success"></i>
					<i v-else class="none el-icon-error"></i>
				</template>
			</el-table-column>
			<el-table-column
				label="绑定微信号"
				align="center"
				prop="wxNumber">
				<template slot-scope="scope">
					<i v-if="scope.row.wxNumber" class="success el-icon-success"></i>
					<i v-else class="none el-icon-error"></i>
				</template>
			</el-table-column>
			<el-table-column
				label="签署协议"
				align="center"
				:filters="[{ text: '已签署', value: true }, { text: '未签署', value: false }]"
				filter-placement="bottom-end"
				:filter-multiple="false"
				:filter-method="(value, user) => user.signedNotice === value"
				column-key="signedNotice"
				prop="signedNotice">
				<template slot-scope="scope">
					<i v-if="scope.row.signedNotice" class="success el-icon-success"></i>
					<i v-else class="none el-icon-error"></i>
				</template>
			</el-table-column>
			<el-table-column
				label="签署合同"
				align="center"
				:filters="[{ text: '已签署', value: true }, { text: '未签署', value: false }]"
				:filter-multiple="false"
				filter-placement="bottom-end"
				:filter-method="(value, user) => user.signedContract === value"
				column-key="signedContract"
				prop="signedContract">
					<template slot-scope="scope">
						<i v-if="scope.row.signedContract" class="success el-icon-success"></i>
						<i v-else class="none el-icon-error"></i>
					</template>
			</el-table-column>
			<el-table-column
				label="虚拟货币"
				align="center"
				sortable
				:sort-orders="['descending', null]"
				column-key="ahaPoint">
				<template slot-scope="scope">
					<div>{{scope.row.ahaCredit}}Aha点</div>
					<div>{{scope.row.ahaPoint}}Aha点</div>
				</template>
			</el-table-column>
			<el-table-column 
				label="操作"
				align="center">
				<template slot-scope="scope">
					<router-link :to="'/admin/userinfo/' + scope.row.id">
						<el-button size="mini">Edit</el-button>
					</router-link>
				</template>
			</el-table-column>
		</el-table>
		<p class="show-remind center">{{isShowAll ? "已加载全部" : ""}}</p>
	</div>
</template>

<script>
import { getUsers } from "@/assets/axios/api_user.js"
export default {
	  data(){
		return {
			searchType: "phoneLike",
			searchText: "",
			sortBy: null,
			orderBy: null,
			signedNotice: null,
			signedContract: null,
			pageNum: 1,
			pageSize: 30,
			isShowAll: false,
			users: []
		}
	  },
	created() {
		this.getUserData(true,true)
	},
    methods: {
		/* 
			name: 获取用户信息
			desc: 传入变量获取用户信息，并判断是否已经加载全部
			time: 2020/11/29
		*/
		getUserData(init=false,loading=false)
		{
			this.$store.commit("setLoading",loading)
			this.isShowAll = true
			if(init){
				this.pageNum = 1
			}
			const data = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortBy,
				orderBy: this.orderBy,
				signedNotice: this.signedNotice,
				signedContract: this.signedContract,
			}
			if(this.searchText){
				data[this.searchType] = this.searchText
			}
			getUsers(data)
			.then(res => {
				if(init){
					this.users = []
				}
				res.data.pageData.forEach(item => {
					item.name = item.trueName || item.nickname
					item.createdTime = this.gformatDate(item.createdTime,true)
					this.users.push(item)
				})
				this.$nextTick(() => {
					/* 判断是否是最后一页 */
					if(res.data.pageData.length < this.pageSize){
						this.isShowAll = true
					}
					else{
						this.isShowAll = false
						this.pageNum++
					}
				})
				this.$store.commit("setLoading",false)
				console.log(this.users);
			})
		},
		/* 重置 */
		reset()
		{
			this.searchText = ""
			this.sortBy = null
			this.orderBy = null
			this.signedNotice = null
			this.signedContract = null
			this.$refs.table.clearSort()
			this.$refs.table.clearFilter()
			this.getUserData(true)
		},
		/* 排序发送改变 */
		sortChange(column)
		{
			this.sortBy = column.order ? column.prop : null
			if(column.order){
				this.orderBy = column.order === "descending" ? "desc" : "asc"
			}
			else{
				this.orderBy = column.order
			}
			console.log(column);
			this.getUserData(true)
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
			this.getUserData(true)
		},
	}
}
</script>

<style lang="stylus" scoped>
.users
	min-width 1070px
	white-space pre-line
	header
		h2
			margin-bottom 10px
			color var(--blue)
		.el-input
			max-width 500px
		.el-select
			width 120px
		.search-btn:hover
			background-color #ecf5ff
			color #409EFF
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