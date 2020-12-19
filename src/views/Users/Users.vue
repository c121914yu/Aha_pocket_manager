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
				width="120px"
				column-key="date"
				prop="createdTime">
			</el-table-column>
			<el-table-column
				label="姓名/昵称"
				prop="name">
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
				label="贡献度"
				align="center"
				sortable
				:sort-orders="['descending', null]"
				prop="contribPoint">
			</el-table-column>
			<el-table-column 
				label="操作"
				align="center">
				<template slot-scope="scope">
					<router-link :to="'/userinfo/' + scope.row.id">
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
import { getUsers } from "@/assets/axios/api.js"
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
  methods: {
		/* 
			name: 获取用户信息
			desc: 传入变量获取用户信息，并判断是否已经加载全部
			time: 2020/11/29
		*/
		getUserData(clear=false)
		{
			if(clear)
				this.pageNum = 1
			const data = {
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				sortBy: this.sortBy,
				orderBy: this.orderBy,
				signedNotice: this.signedNotice,
				signedContract: this.signedContract,
			}
			data[this.searchType] = this.searchText
			getUsers(data)
			.then(res => {
				console.log(res.data.pageData);
				const resArr = res.data.pageData.map(item => {
					const date = new Date(item.createdTime)
					return {
						...item,
						createdTime: `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`, // 格式化日期
						name: item.trueName || item.nickname
					}
				})
				if(clear)
					this.users = resArr
				else
					this.users = this.users.concat(resArr)
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
			if(column.order)
				this.orderBy = column.order === "descending" ? "desc" : "asc"
			else
				this.orderBy = column.order
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
		/* 
			name: handleShowMore
			desc: if not showAll,request more users data
			time: 2020/11/29
		*/
	  handleShowMore()
		{
			if(this.isShowAll)
				return
			this.getUserData()
		},
	},
	mounted() {
		this.getUserData()
	}
}
</script>

<style lang="stylus" scoped>
.users
	min-width 1070px
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