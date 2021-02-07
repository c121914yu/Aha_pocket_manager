<template>
	<div 
		class="orders"
		v-infinite-scroll="loadOrders"
		infinite-scroll-distance="20"
		:infinite-scroll-disabled="is_loadAll">
		<h1>订单管理</h1>
		<!-- 数据统计 -->
		<el-table
			ref="table"
			style="width: 100%"
			stripe
			:data="arr_orders"
			@row-click="order=$event">
			<el-table-column label="订单ID">
				<template slot="header" slot-scope="scope">
					<el-input
						class="search-input"
						size="mini"
						placeholder="订单ID"
						clearable
						v-model.number="orderId"
						@change="loadOrders(true)"/>
				</template>
				<template slot-scope="scope">
					{{scope.row.contribPointOrder.id}}
				</template>
			</el-table-column>
			<el-table-column
				label="时间"
				width="100"
				prop="purchaseTime"
				align="center">
			</el-table-column>
			<el-table-column
				label="相关用户"
				align="center">
				<template slot="header" slot-scope="scope">
					<el-input
						class="search-input"
						size="mini"
						placeholder="用户ID"
						clearable
						v-model.number="userId"
						@change="loadOrders(true)"/>
				</template>
				<template slot-scope="scope">
					{{scope.row.contribPointOrder.user.userId}} - {{scope.row.contribPointOrder.user.nickname}}
				</template>
			</el-table-column>
			<el-table-column
				label="类型"
				min-width="150"
				align="center">
				<template slot-scope="scope">
					<div>附件购买</div>
					<div><strong>{{scope.row.contribPointOrder.project.name}}</strong></div>
				</template>
			</el-table-column>
			<el-table-column
				label="商品说明"
				min-width="200"
				align="center">
				<template slot-scope="scope">
					<ul>
						<li
							v-for="(file,index) in scope.row.contribPointOrder.orderResources"
							:key="index">
							{{file.resource.name}}
						</li>
					</ul>
				</template>
			</el-table-column>
			<el-table-column
				label="花费"
				align="center">
				<template slot-scope="scope">
					<div>{{scope.row.contribPointOrder.chargedAhaCredit}}Aha币</div>
					<div>{{scope.row.contribPointOrder.chargedAhaPoint}}Aha点</div>
					<div>总: {{scope.row.contribPointOrder.totalCost}}</div>
				</template>
			</el-table-column>
			<el-table-column
				label="状态"
				align="center">
				<template slot-scope="scope">
					<div>{{scope.row.contribPointOrder.status === 0 ? "已取消" : "已支付"}}</div>
				</template>
			</el-table-column>
		</el-table>
		<p class="remark center">{{is_loadAll ? "已加载全部" : "点击加载更多"}}</p>
		<!-- 订单详细 -->
		<OrderDetail v-if="order" :order="order" @close="order=null"></OrderDetail>
	</div>
</template>

<script>
import { getOrders } from "@/assets/axios/api_order.js"
import OrderDetail from "@/components/OrderDetail/OrderDetail.vue"
export default{
	data(){
		return{
			pageNum: 1,
			pageSize: 20,
			is_loadAll: false,
			orderId: "",
			userId: "",
			arr_orders: [],
			order: null
		}
	},
	components: {
		OrderDetail
	},
	methods:{
		loadOrders(init=false)
		{
			if(init){
				this.pageNum = 1
			}
			this.is_loadAll = true
			getOrders({
				pageNum: this.pageNum,
				pageSize: this.pageSize,
				orderId: this.orderId || null,
				userId: this.userId || null
			})
			.then(res => {
				if(res.data.pageData.length < this.pageSize){
					this.is_loadAll = true
				}
				else{
					this.pageNum++
					this.is_loadAll = false
				}
				if(init){
					this.arr_orders = []
				}
				res.data.pageData.forEach(order => {
					order.purchaseTime = this.gformatDate(order.purchaseTime,true)
					order.contribPointOrder.createTime = this.gformatDate(order.contribPointOrder.createTime,true)
					order.contribPointOrder.payTime = this.gformatDate(order.contribPointOrder.payTime,true)
					this.arr_orders.push(order)
				})
				console.log(this.arr_orders);
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.orders
	h1
		margin-bottom 10px
		color var(--blue)
	.remark
		margin-top 10px
</style>
