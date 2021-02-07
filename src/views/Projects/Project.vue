<template>
	<div v-if="project" class="project">
		<!-- 项目信息 -->
		<el-form label-width="80px">
			<!-- 头像 -->
			<div class="center">
				<el-image
					style="width: 100px;"
					:src="project.avatarUrl"
					fit="fill"
					:preview-src-list="[project.avatarUrl]">
				</el-image>
			</div>
			<el-form-item label="项目标题">
				<h2>{{project.name}}</h2>
			</el-form-item>
			<el-form-item label="项目成员">
				<ol>
					<li
						v-for="(member,index) in members"
						:key="index">
						{{member.name}}: {{member.job}}
					</li>
				</ol>
			</el-form-item>
			<el-form-item label="热度统计">
				<span style="color: var(--red);">
					<i class="iconfont icon-shoucang"></i>
					{{project.collect || 0}}
				</span>
				<span style="margin-left: 10px;color: var(--gray);">
					<i class="el-icon-view"></i>
					{{project.read || 0}}
				</span>
			</el-form-item>
			<el-form-item label="综合得分">
				<el-rate
				  style="line-height: 2.5;"
				  disabled
				  show-score
				  text-color="#ff9900"
				  disabled-void-color="#e0e0e0"
				  score-template="{value}"
				  v-model="project.collect">
				</el-rate>
			</el-form-item>
			<el-form-item v-if="project.compName" label="参赛信息">
				{{project.awardTime}},{{awardLevel}} 
				<strong v-if="!is_changeCompInfo">:{{project.compName}}</strong>
				<div v-else>
					<el-select style="width: 270px;" v-model="project.compId" filterable>
					    <el-option
					      v-for="item in arr_competitions"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					</el-select>
					<el-button v-if="project.compId===0" @click="addComp">添加新比赛</el-button>
				</div>
			</el-form-item>
			<el-form-item v-else label="参赛信息">
				无参赛信息
			</el-form-item>
			<el-form-item v-if="project.compName" style="margin-top: 10px;" label="获奖证明">
				<el-image
					style="width: 100px;"
					:src="project.awardProveUrl"
					fit="fill"
					:preview-src-list="[project.awardProveUrl]">
				</el-image>
			</el-form-item>
			<el-form-item
				:style="{
					color: project.passed ? 'var(--green)' : 'var(--red)'
				}" 
				label="项目状态">
				{{project.passed ? "已通过" : "未通过"}}
			</el-form-item>
			<el-form-item label="完整度">
				<el-input
					class="meaning" 
					type="number" 
					placeholder="输入项目完整度" 
					max="100"
					min="0"
					v-model.number="meaning">
					<template slot="append">%</template>
				</el-input>
				<div class="remark">项目完整程度将影响发放给作者的Aha币,但不影响其标价。</div>
			</el-form-item>
			<el-form-item class="check" label="审核">
				<div class="btns">
					<el-button type="success" @click="openCheckProject(true)">通过</el-button>
					<el-button type="danger" @click="openCheckProject(false)">拒绝</el-button>
				</div>
			</el-form-item>
		</el-form>
		<!-- 项目介绍 -->
		<el-form>
			<h2 class="center">项目介绍</h2>
			<div class="intro" v-html="project.intro"></div>
		</el-form>
		<!-- 附件信息 -->
		<el-form>
			<h2 class="center">附件信息</h2>
			<!-- 附件列表 -->
			<div class="files">
				<div
					class="file"
					v-for="(file,index) in arr_files"
					:key="index">
					<span 
						class="filename"
						:style="{
							color: file.passed ? 'var(--blue)' : '#727171'
						}"
						@click="clickFile(file)">
						{{file.name}}
					</span>
					<div class="count">
						<div style="margin: 5px 0;">
							<span class="price" style="color: #f8b86b">
								<i class="iconfont icon-qian"></i>
								{{file.price || 0}}
							</span>
							<span class="loadAmount">
								<i class="el-icon-download"></i>
								{{file.download || 0}}
							</span>
							<span class="score" style="color: #F56C6C">
								<i class="el-icon-star-on"></i>
								{{file.score || 0}}
							</span>
							<span class="score-count" style="color: #956134">
								<i class="el-icon-chat-dot-round"></i>
								{{file.scoreCount || 0}}
							</span>
						</div>
						<div>
							<span class="check-file">
								<small>状态:</small>
								<el-radio-group v-model="file.passed" @change="checkFileStatus($event,file,index)">
									<el-radio :label="true">已通过</el-radio>
									<el-radio :label="false">未通过</el-radio>
								</el-radio-group>
							</span>
							<span @click="deleteFile(file,index)">
								<el-button type="danger" circle icon="el-icon-delete" size="mini"></el-button>
							</span>
						</div>
					</div>
				</div>
			</div>
		</el-form>
		<!-- 评论 -->
		<el-form>
			<h2 class="center">评论信息</h2>
			<div
				class="comments" 
				v-infinite-scroll="getCommentsInfo"
				infinite-scroll-distance="20"
				:infinite-scroll-disabled="commentLoad.showAll">
				<div 
					class="comment"
					v-for="(comment,index) in arr_comments"
					:key="index">
					<el-avatar :size="50" :src="comment.user.avatarUrl">
					  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
					</el-avatar>
					<div class="right">
						<header>
							<span class="name">{{comment.user.nickname}}</span>
							<span class="score"><i class="el-icon-star-on"></i>{{comment.score}}</span>
							<span class="time">{{comment.time}}</span>
						</header>
						<div class="comment-content">{{comment.comment}}</div>
						<footer>
							<span class="filename">{{comment.filename}}</span>
							<i class="delete el-icon-delete" @click="deleteComment(comment,index)"></i>
						</footer>
					</div>
				</div>
			</div>
		</el-form>
		<!-- 购买记录 -->
		<el-form class="purchased-record">
			<h2 class="center">用户购买记录</h2>
			<el-table
				class="purchase-records"
				max-height="600"
				stripe
				:data="arr_purchasedFile"
				v-infinite-scroll="getPurchased"
				infinite-scroll-distance="20"
				:infinite-scroll-disabled="purcharsedLoad.showAll"
				@row-click="order=$event">
				<el-table-column type="index"></el-table-column>
				<el-table-column
					label="购买人"
					prop="contribPointOrder.user.nickname"
					align="center">
				</el-table-column>
				<el-table-column
					label="购买附件"
					align="center"
					min-width="200">
					<template slot-scope="scope">
						<div
							v-for="(file,index) in scope.row.contribPointOrder.orderResources"
							:key="index">
							{{file.resource.name}}
						</div>
					</template>
				</el-table-column>
				<el-table-column
					label="时间"
					width="100"
					prop="purchaseTime"
					align="center">
				</el-table-column>
				<el-table-column
					label="花费"
					align="center">
					<template slot-scope="scope">
						<div><strong>{{scope.row.contribPointOrder.chargedAhaCredit}}</strong>Aha币</div>
						<div><strong>{{scope.row.contribPointOrder.chargedAhaPoint}}</strong>Aha点</div>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
		
		<!-- 拒绝项目，输入邮件内容 -->
		<SendInform
			v-if="inform.is_send"
			:header="inform.header"
			:receiver="inform.receiver"
			:inform="inform.inform"
			@close="inform.is_send=false"
			@success="check">
		</SendInform>
		<!-- 比赛编辑 -->
		<EditCompetition
			v-if="editCompetitionInfo"
			:competitionInfo="editCompetitionInfo" 
			:type="0"
			@close="editCompetitionInfo=null"
			@finish="getProjectInfo">
		</EditCompetition>
		<!-- 订单详细 -->
		<OrderDetail v-if="order" :order="order" @close="order=null"></OrderDetail>
	</div>
</template>

<script>
import { getProject,putProject,getComments,removeComment,getFiles,checkFile,removeFile,getLoadSignature,checkProject } from "@/assets/axios/api_project.js"
import { sendInform } from "@/assets/axios/api_message.js"
import { getOrders } from "@/assets/axios/api_order.js"
import EditCompetition from "@/components/EditCompetition/EditCompetition.vue"
import SendInform from "@/components/SendInform/SendInform.vue"
import OrderDetail from "@/components/OrderDetail/OrderDetail.vue"
export default{
	data(){
		return{
			project: null,
			arr_competitions: this.$store.state.arr_competitions, //比赛列表
			editCompetitionInfo: null, //需要编辑比赛的信息
			is_changeCompInfo: false, //是否需要修改该项目的比赛信息
			meaning: 100, // 项目完整度
			checkRes: false, // 审核结果
			inform: {
				header: "",
				receiver: null,
				inform: null,
				is_send: false
			},
			is_sendInform: false,
			filesLoad: { // 评论加载
				pageNum: 1,
				pageSize: 20,
				showAll: false
			},
			arr_files: [],
			commentLoad: { // 评论加载
				pageNum: 1,
				pageSize: 20,
				showAll: false,
			},
			arr_comments: [],
			purcharsedLoad: {
				pageNum: 1,
				pageSize: 20,
				showAll: false,
				fileId: null,
			},
			arr_purchasedFile: [],
			order: null
		}
	},
	computed: {
		members(){
			let sortRes = this.project.members.sort((a,b) => a.rank - b.rank)
			return sortRes.map(item => {
				return {
					name: item.memberUser.nickname,
					job: item.job
				}
			})
		},
		awardLevel(){
			const level = this.$store.state.prizeLevels.find(item => item.value === this.project.awardLevel)
			if(level){
				return level.label
			}
			return ""
		}
	},
	components: {
		EditCompetition,
		SendInform,
		OrderDetail
	},
	created() {
		this.getProjectInfo()
		this.getFiles()
	},
	methods:{
		/* 获取项目信息 */
		getProjectInfo()
		{
			this.editCompetitionInfo = null
			getProject(this.$route.params.id)
			.then(res => {
				if(!res.data.avatarUrl){
					res.data.avatarUrl = "https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png"
				}
				this.meaning = res.data.meaning || 100
				/* 如果该比赛不存在数据库中 */
				if(res.data.compId === 0){
					const comp = this.arr_competitions.find(item => item.name === res.data.compName)
					/* 1. 已经是新增至库中，则直接修改该项目compId */
					if(comp){
						res.data.compId = comp.id
						this.is_changeCompInfo = true
					}
					/* 2. 完全新的比赛，有可能是字打错，此时可以通过选框选择正确的比赛或者添加新的比赛 */
					else{
						this.arr_competitions.unshift({id: 0,name: res.data.compName})
						this.is_changeCompInfo = true
					}
				}
				this.project = res.data
				console.log(this.project)
			})
		},
		/* 添加新比赛 */
		addComp()
		{
			this.editCompetitionInfo = {
				name: this.project.compName,
				intro: "",
				type: "",
				picUrl: null
			}
		},
		/* 点击审核项目按键，调出发送通知按键 */
		openCheckProject(bool)
		{
			if(this.project.compName && this.project.compId === 0){
				this.$showWarn("该比赛未在数据库中,请将该比赛信息录入数据库后再进行操作。",5000)
				return
			}
			if(!this.meaning){
				this.$showWarn("请正确填写项目完整度")
				return
			}
			/* 修改该项目的比赛信息 */
			if(this.is_changeCompInfo){
				putProject({
					id: this.project.id,
					compId: this.project.compId,
					compName: this.arr_competitions.find(item => item.id === this.project.compId).name,
				})
			}
			if(bool){
				this.inform.header = "项目审核结果通知"
				this.inform.inform = {
					title: "项目审核 - 通过",
					content: `恭喜你,你的项目{{${this.project.name}}}成功通过审核！评估完整度为: ${this.meaning}%。`
				}
			}
			else{
				this.inform.inform = {
					title: "项目审核 - 未通过",
					content: `很遗憾的告诉你,你的项目{{${this.project.name}}}未成功通过审核,原因如下:`
				}
			}
			this.inform.receiver = {
				id: this.project.creatorUser.userId,
				name: this.project.creatorUser.nickname
			}
			this.checkRes = bool
			this.inform.is_send = true
		},
		/* 审核项目 */
		check(e)
		{
			sendInform({
				...e,
				type: 0,
			})
			/* 发送通知 */
			checkProject(this.project.id,{
				passed: this.checkRes,
				meaning: this.meaning
			})
			.then(res => {
				if(this.checkRes){
					this.$showSuccess("已通过该项目")
				}
				else{
					this.$showWarn("该项目未通过")
				}
				this.project.passed = this.checkRes
				this.arr_files.forEach(file => file.passed = this.checkRes)
				this.inform = {
					header: "",
					receiver: null,
					inform: null,
					is_send: false
				}
			})
		},
		/* 获取文件信息 */
		getFiles()
		{
			getFiles({
				projectId: this.$route.params.id,
				pageNum: 1,
				pageSize: 50
			})
			.then(res => {
				this.arr_files = res.data.pageData
				console.log(this.arr_files);
			})
		},
		/* 修改附件通过状态 */
		checkFileStatus(e,file,index)
		{
			checkFile(file.id,e)
			.then(res => {
				if(e){
					this.$showSuccess("该附件已通过")
				}
				else{
					this.$showWarn("该附件已被取消")
				}
			})
			.catch(err => {
				this.arr_files[index].passed = !e
			})
		},
		deleteFile(file,index)
		{
			this.$confirm("确认删除该附件？请勿随意使用该操作！",() => {
				removeFile(file.id)
				.then(res => {
					this.$showSuccess("已删除该附件")
					this.arr_files.splice(index,1)
				})
			})
		},
		/* 点击附件 */
		clickFile(file)
		{
			/* 图片/视频直接打开 */
			getLoadSignature(file.id)
			.then(res => {
				this.gGetFileUrl(res.data)
				.then(url => {
					window.open(url)
				})
			})
		},
		/* 获取评论信息 */
		getCommentsInfo()
		{
			this.commentLoad.showAll = true
			getComments({
				pageNum: this.commentLoad.pageNum,
				pageSize: this.commentLoad.pageSize,
				projectId: this.$route.params.id
			})
			.then(res => {
				if(res.data.pageData.length < this.commentLoad.pageSize){
					this.commentLoad.showAll = true
				}
				else{
					this.pageNum++
					this.commentLoad.showAll = false
				}
				res.data.pageData.forEach(comment => {
					const file = this.project.resources.find(item => item.id === comment.resourceId)
					comment.time = this.gformatDate(comment.time)
					comment.filename = file.name
					this.arr_comments.push(comment)
				})
				// console.log(this.arr_comments)
			})
		},
		deleteComment(comment,index)
		{
			this.$confirm("确认删除该附件？请勿随意使用该操作！",() => {
				removeFile(comment.resourceId,comment.user.userId)
				.then(res => {
					this.$showWarn("已该评论")
					this.arr_comments.splice(index,1)
				})
			})
		},
		/* 获取购买记录 */
		getPurchased(fileId=null)
		{
			this.purcharsedLoad.showAll = true
			getOrders({
				pageNum: this.purcharsedLoad.pageNum,
				pageSize: this.purcharsedLoad.pageSize,
				projectId: this.$route.params.id,
			})
			.then(res => {
				if(res.data.pageData.length < this.purcharsedLoad.pageSize){
					this.purcharsedLoad.showAll = true
				}
				else{
					this.purcharsedLoad.pageNum++
					this.purcharsedLoad.showAll = false
				}
				res.data.pageData.forEach(order => {
					order.purchaseTime = this.gformatDate(order.purchaseTime,true)
					order.contribPointOrder.createTime = this.gformatDate(order.contribPointOrder.createTime,true)
					order.contribPointOrder.payTime = this.gformatDate(order.contribPointOrder.payTime,true)
					this.arr_purchasedFile.push(order)
				})
				// console.log(this.arr_purchasedFile);
			})
		},
	}
}
</script>

<style lang="stylus" scoped>
.project
	display grid
	grid-template-columns 1fr 1fr
	grid-gap 10px
	.el-form
		padding 10px
		background-color rgba(64,158,255,0.04)
		border-radius 8px
		box-shadow var(--shadow1)
		h2
			margin-bottom 10px
		ol
			margin-left 15px
		.el-image
			border-radius 4px
			cursor pointer
		.delete
			color var(--red)
			cursor pointer
			font-size 16px
		.el-form-item
			margin 5px 0
			.meaning
				width 200px
			&.check
				.el-button
					margin 0 15px 0 0
		/* 介绍 */
		.intro
			margin auto
			width 400px
			max-height 70vh
			padding 0 5px
			background-color #feedcb
			overflow-y auto
		/* 附件信息 */
		.files
			max-height 500px
			overflow-y auto
			.file
				margin-bottom 10px
				padding 10px 5px 
				border 1px solid var(--boder-color1)
				border-radius var(--radius2)
				.filename
					margin-right 5px
					text-decoration underline
					cursor pointer
				.count
					line-height 1
					.iconfont
						font-size 13px
				span
					margin-bottom 5px
					margin-right 15px
		/* 评论 */
		.comments
			max-height 500px
			overflow-y auto
			.comment
				margin 5px
				padding 10px
				background-color #FFFFFF
				box-shadow var(--shadow1)
				border-radius var(--radius2)
				display flex
				.right
					padding-left 10px
					flex 1
					font-size 0.8em
					header
						display flex
						.name
							padding 0 10px
							border-radius 22px
							background-color var(--origin2)
							color #FFFFFF
						.score
							margin-left 10px
							flex 1
							color var(--origin2)
						.time
							color var(--gray)
					.comment-content
						padding 5px 0
					footer
						display flex
						justify-content space-between
						align-items flex-end
						.filename
							color var(--gray)
			
	/* 购买记录 */
	.purchased-record
		grid-column 1 / 3
		white-space pre-line
</style>
