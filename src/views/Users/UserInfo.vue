<template>
	<div v-if="userInfo" class="user-info">
		<!-- 基本信息 -->
		<el-form label-width="80px">
			<h2 class="center">用户基础信息</h2>
			<!-- 头像 -->
			<div class="center">
				<el-image
					style="width: 80px;height:80px;border-radius: 50%;"
					:src="userInfo.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'"
					fit="fill"
					:preview-src-list="[userInfo.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png']">
				</el-image>
			</div>
			<!-- 身份 -->
			<el-form-item label="用户身份">
				{{userInfo.role.name}}
				<!-- <el-select 
					placeholder="请选择用户身份"
					v-model="userInfo.role.name"
					@change="setUserRole">
				    <el-option
				      v-for="item in arr_roles"
				      :key="item"
				      :label="item"
				      :value="item">
				    </el-option>
				  </el-select> -->
			</el-form-item>
			<!-- id -->
			<el-form-item label="userId">
				{{userInfo.id}}
			</el-form-item>
			<!-- 昵称 -->
			<el-form-item label="昵称">
				{{userInfo.nickname}}
			</el-form-item>
			<!-- 真实姓名 -->
			<el-form-item label="真实姓名">
				{{userInfo.trueName || "未填写"}}
			</el-form-item>
			<!-- 比赛标签 -->
			<el-form-item label="特长标签">
				<el-tag
					v-for="(tag,index) in specialtyTags"
					:key="index"
					:closable="false"
					:disable-transitions="false"
					@close="removeTag('specialtyTags',index)">
				  {{tag}}
				</el-tag>
			</el-form-item>
			<!-- 特长标签 -->
			<el-form-item label="比赛标签">
				<el-tag
					v-for="(tag,index) in compTags"
					:key="index"
					:closable="false"
					:disable-transitions="false"
					@close="removeTag('compTags',index)">
					{{tag}}
				</el-tag>
			</el-form-item>
			<!-- 用户简历 -->
			<el-form-item label="用户简历">
				<a class="link-resume" :href="'http://localhost:8082/resume/'+userInfo.id" target="_blank">查看用户简历</a>
			</el-form-item>
			<!-- 按键 -->
			<el-form-item>
				<el-button icon="el-icon-bell" @click="isSendInform=true">发送通知</el-button>
				<el-button icon="el-icon-warning" type="danger">禁止登录</el-button>
			</el-form-item>
		</el-form>
		<!-- 重要信息 -->
		<el-form label-width="80px">
			<h2 class="center">用户重要信息</h2>
			<!-- 手机号 -->
			<el-form-item label="手机号">
				{{userInfo.phone || "未绑定"}}
			</el-form-item>
			<!-- 余额 -->
			<el-form-item label="Aha币">
				<strong>{{userInfo.ahaCredit}}</strong>
			</el-form-item>
			<!-- 贡献点 -->
			<el-form-item label="Aha点">
				<strong>{{userInfo.ahaPoint}}</strong>
			</el-form-item>
			<!-- 协议签署 -->
			<el-form-item label="协议状态">
				<el-radio-group v-model="userInfo.signedNotice" @change="setNotice">
					<el-radio :label="true">已签署</el-radio>
					<el-radio :label="false">未签署</el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 合同签署 -->
			<el-form-item label="合同状态">
				<el-radio-group v-model="userInfo.signedContract" @change="setNotice">
					<el-radio :label="true">已签署</el-radio>
					<el-radio :label="false">未签署</el-radio>
					<el-button v-if="userInfo.signedContract" size="mini">查看合同</el-button>
				</el-radio-group>
			</el-form-item>
			<!-- 合同图片 -->
			<el-form-item v-if="userInfo.signedContract" label="合同图片">
				<el-image 
					style="width: 100px;"
					:src="contarctImg" 
					:preview-src-list="[contarctImg]">
				</el-image>
			</el-form-item>
		</el-form>
		<!-- 活跃程度 -->
		<el-form>
			<h2 class="center">用户活跃程度</h2>
			<div class="charts" ref="liveness"></div>
		</el-form>
		<!-- 用户账单记录 -->
		<el-form 
			class="orders" 
			label-width="80px"
			:infinite-scroll-disabled="orderLoad.is_showAll"
			v-infinite-scroll="loadOrders"
			infinite-scroll-distance=30>
			<h2 class="center">用户账单</h2>
			<div 
				class="order-card"
				v-for="(order,index) in arr_orders"
				:key="index"
				@click="readOrder(order)">
				<el-row class="header">
				  <el-col :span="20">附件购买 - {{order.contribPointOrder.project.name}}</el-col>
				  <el-col class="time" :span="4"><small>{{order.purchaseTime}}</small></el-col>
				</el-row>
				<el-row class="main">
					<el-col class="left" :span="20">
						<ul>
							<li
								class="filename"
								 v-for="(file,index) in order.contribPointOrder.orderResources"
								 :key="index">
								{{file.resource.name}}
							</li>
						</ul>
					</el-col>
					<el-col class="right" :span="4">
						<h1 class="amount">-{{order.contribPointOrder.totalCost}}</h1>
						<div 
							:style="{
								color: order.contribPointOrder.status === 0 ? 'var(--red)' : 'var(--origin2)'
							}">
							<small><strong>{{order.contribPointOrder.status === 0 ? "已取消" : "已支付"}}</strong></small>
						</div>
					</el-col>
				</el-row>
			</div>
			<p class="center remark">{{orderLoad.is_showAll ? "已加载全部" : ""}}</p>
		</el-form>
		<SendInform 
			v-if="isSendInform"
			:receiver="{...userInfo,title: '私信用户'}"
			@close="isSendInform=false"
			@success="sendInform">
		</SendInform>
		<!-- 订单详细 -->
		<OrderDetail v-if="order" :order="order" @close="order=null"></OrderDetail>
	</div>
</template>

<script>
import { getUser,getUserContract,putUserPrivate,getAuthentication,getAuthenticationFile,checkAuthentication } from "@/assets/axios/api_user.js"
import { sendInform } from "@/assets/axios/api_message.js"
import { getOrders } from "@/assets/axios/api_order.js"
import SendInform from "@/components/SendInform/SendInform.vue"
import OrderDetail from "@/components/OrderDetail/OrderDetail.vue"
export default{
	data(){
		return {
			userInfo: null,
			contarctImg: "", //合同图片
			arr_roles: ["ROLE_ADMIN","ROLE_SUPERADMIN"],//身份数组
			isSendInform: false,
			orderLoad: {
				pageNum: 1,
				pageSize: 20,
				is_showAll: false
			},
			arr_orders: [],
			order: null
		}
	},
	computed: {
		specialtyTags(){
			if(this.userInfo.specialtyTags)
				return this.userInfo.specialtyTags.split(",")
			return ""
		},
		compTags(){
			if(this.userInfo.compTags)
				return this.userInfo.compTags.split(",")
			return ""
		}
	},
	watch: {
		"$route": "initData"
	},
	components: {
		SendInform,
		OrderDetail
	},
	created() {
		this.initData()
	},
	methods: {
		/* 初始化数据 */
		initData()
		{
			getUser(this.$route.params.id)
			.then(res => {
				this.userInfo = res.data
				console.log(this.userInfo)
				/* 请求合同图片 */
				this.getContract()
				/* 实名认证信息 */
				this.getAuthenticationInfo()
				/* 绘制图表 */
				this.$nextTick(this.initLiveness)
			})
		},
		/* 获取合同图片,预先判断是否签署 */
		getContract()
		{
			if(this.userInfo.signedContract){
				getUserContract(this.userInfo.id)
				.then(res => {
					this.contarctImg = this.binaryToBase64(res)
				})
			}
		},
		/* 获取实名认证信息,先判断 */
		getAuthenticationInfo()
		{
			getAuthentication(this.userInfo.id)
			.then(res => {
				console.log(res);
			})
		},
		/* 
			name：修改协议状态
			desc: 根据选中协议状态调用API更新协议状态
			time: 2020/11/28
		*/
		setNotice(e)
		{
			putUserPrivate(this.userInfo.id,{
			  signedNotice: e
			})
			.then(res => {
				if(e){
					this.$showSuccess("协议已签署")
				}
				else{
					this.$showWarn("协议取消签署")
				}
			})
		},
		/*
			name：修改合同状态
			desc: 根据选中合同状态调用API更新合同状态
			time: 2020/11/28
		*/
		setContract(e)
		{
			putUserPrivate(this.userInfo.id,{
				signedContract: e
			})
			.then(res => {
				if(e){
					this.$showSuccess("合同已签署")
				}
				else{
					this.$showWarn("合同取消签署")
				}
			})
		},
		/* 
			name: 发送通知
			desc: 调用API向用户发送通知
			params：
					receiverUserId: int,用户id
					title: String,题目
					content: String,内容
		*/
		sendInform(e)
		{
			sendInform(e)
			.then(res => {
				this.$showSuccess("发送通知成功！")
				this.isSendInform = false
			})
			.catch(err => {
				this.isSendInform = false
			})
		},
		/* 初始化用户活跃度 */
		initLiveness()
		{
			/* 请求数据 */
			/* 绘图 */
			const option = {
				tooltip: {
					trigger: 'axis'
				},
				dataZoom: [
					{
						start: 50,
						minSpan: 50
					}, 
					{
						type: 'inside'
					},
				],
				legend: {
					data: ['登录次数', "邀请好友数量","反馈问题数量" ,'项目数量', '比赛数量', '外包数量']
				},
				grid: {
					left: '3%',
					right: '3%',
					bottom: '50px',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						name: '登录次数',
						type: 'line',
						data: [120, 132, 101, 134, 90, 230, 210]
					},
					{
						name: '邀请好友数量',
						type: 'line',
						data: [220, 182, 191, 234, 290, 330, 310]
					},
					{
						name: '反馈问题数量',
						type: 'line',
						data: [150, 232, 201, 154, 190, 330, 410]
					},
					{
						name: '项目数量',
						type: 'line',
						data: [320, 332, 301, 334, 390, 330, 320]
					},
					{
						name: '比赛数量',
						type: 'line',
						data: [820, 932, 901, 934, 1290, 1330, 1320]
					},
					{
						name: '外包数量',
						type: 'line',
						data: [820, 932, 901, 934, 1290, 1330, 1320]
					}
				]
			};
			let chart = echarts.init(this.$refs.liveness)
			chart.setOption(option)
		},
		/* 加载订单信息 */
		loadOrders()
		{
			this.orderLoad.is_showAll = true
			getOrders({
				pageNum: this.orderLoad.pageNum,
				pageSize: this.orderLoad.pageSize,
				userId: this.$route.params.id
			})
			.then(res => {
				if(res.data.pageData.length < this.orderLoad.pageSize){
					this.orderLoad.is_showAll = true
				}
				else{
					this.orderLoad.pageNum++
					this.orderLoad.is_showAll = false
				}
				res.data.pageData.forEach(order => {
					order.purchaseTime = this.gformatDate(order.purchaseTime)
					order.contribPointOrder.createTime = this.gformatDate(order.contribPointOrder.createTime,true)
					order.contribPointOrder.payTime = this.gformatDate(order.contribPointOrder.payTime,true)
					this.arr_orders.push(order)
				})
				console.log(this.arr_orders);
			})
		},
		/* 阅读订单 */
		readOrder(order)
		{
			this.order = order
		}
	}
}
</script>

<style lang="stylus" scoped>
.user-info
	display grid
	grid-template-columns 1fr 1fr
	grid-gap 10px
	.el-form
		padding 10px
		background-color rgba(64,158,255,0.07)
		border-radius 8px
		box-shadow var(--shadow1)
		h2
			margin-bottom 10px
		.select-file
			margin-left calc(50% - 30px)
			display inline-block
		.charts
			width 100%
			height 400px
		.el-form-item
			margin 5px 0
			.el-input
				max-width 300px
			.el-tag
				margin 0 5px 5px 0
			.button-new-tag 
				margin-left 5px
				height 32px
				line-height 30px
				padding-top 0
				padding-bottom 0
			.input-new-tag
				width 100px
				margin-left 5px
				padding 0
			.link-resume
				border 1px solid var(--boder-color1)
				padding 5px 10px
				border-radius var(--radius2)
			.save-btn
				width 300px
	/* 账单 */
	.orders
		height 461px
		overflow-y auto
		.order-card
			margin-bottom 10px
			border-radius var(--radius2)
			box-shadow var(--shadow1)
			overflow hidden
			.el-row
				padding 10px
			.header
				background-color var(--origin2)
				color #FFFFFF
				.time
					text-align right
			.main
				background-color #FFFFFF
				.filename
					color var(--origin1)
				.right
					text-align end
					.amount
						color var(--origin1)
		.remark
			font-size 12px
			color var(--gray)
</style>
