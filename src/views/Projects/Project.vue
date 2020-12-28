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
					{{project.collect}}
				</span>
				<span style="margin-left: 10px;color: var(--gray);">
					<i class="el-icon-view"></i>
					{{project.read}}
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
				<!-- 如果是已有比赛则直接展示，如果是新比赛，则显示为输入框以确认新比赛的正确名称 -->
				{{project.awardTime}},{{awardLevel}}: 
				<strong v-if="project.compId>0">{{project.compName}}</strong>
				<strong
					v-else
					class="new-compeition"
					@click="addComp">
					{{project.compName}}
				</strong>
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
		<el-form label-width="80px">
			<h2 class="center">附件信息</h2>
			<!-- 附件列表 -->
			<ul>
				<li
					class="file"
					v-for="(file,index) in project.resources"
					:key="index">
					<span class="filename" @click="clickFile(file)">{{file.name}}</span>
					<div class="count">
						<span class="loadAmount">
							<i class="el-icon-download"></i>
							{{file.download}}
						</span>
						<span class="score" style="color: #F56C6C">
							<i class="el-icon-star-on"></i>
							{{file.score}}
						</span>
						<span class="score-count" style="color: #956134">
							<i class="el-icon-chat-dot-round"></i>
							{{file.scoreCount}}
						</span>
						<span class="point" style="color: #f8b86b">
							<i class="iconfont icon-point"></i>
							{{file.price}}
						</span>
					</div>
				</li>
			</ul>
			<!-- 评论 -->
			<h3 class="center">评论信息</h3>
			<div 
				class="comments" 
				v-infinite-scroll="getCommentsInfo"
				infinite-scroll-distance="20"
				:infinite-scroll-disabled="commentLoad.showAll">
				<div 
					class="comment"
					v-for="(comment,index) in comments"
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
							<i class="delete el-icon-delete"></i>
						</footer>
					</div>
				</div>
			</div>
		</el-form>
		<!-- 购买记录 -->
		<el-form>
			<h2 class="center">用户购买记录</h2>
			<el-table
				class="purchase-records"
				max-height="600"
				style="width: 100%"
				stripe
				:data="purchaseRecords"
				@row-click="readRecord">
				<el-table-column type="index"></el-table-column>
				<el-table-column
					label="购买人"
					prop="name"
					align="center">
				</el-table-column>
				<el-table-column
					label="购买附件"
					prop="filename"
					align="center">
				</el-table-column>
				<el-table-column
					label="时间"
					prop="time"
					align="center">
				</el-table-column>
				<el-table-column
					label="花费"
					prop="point"
					align="center">
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
	</div>
</template>

<script>
import { getProject,getComments,getLoadSignature,checkProject,sendInform } from "@/assets/axios/api.js"
import EditCompetition from "@/components/EditCompetition/EditCompetition.vue"
import SendInform from "@/components/SendInform/SendInform.vue"
export default{
	data(){
		return{
			project: null,
			comments: [],
			purchaseRecords: [
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
			],
			editCompetitionInfo: null,
			meaning: 100,
			checkRes: false,
			inform: {
				header: "",
				receiver: null,
				inform: null,
				is_send: false
			},
			is_sendInform: false,
			commentLoad: {
				pageNum: 1,
				pageSize: 20,
				showAll: false
			}
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
	created() {
		this.getProjectInfo()
	},
	components: {
		EditCompetition,
		SendInform
	},
	methods:{
		/* 获取项目信息 */
		getProjectInfo()
		{
			getProject(this.$route.params.id)
			.then(res => {
				if(!res.data.avatarUrl){
					res.data.avatarUrl = "https://aha-public.oss-cn-hangzhou.aliyuncs.com/AhaIcon/logo.png"
				}
				this.project = res.data
				console.log(this.project);
			})
		},
		/* 获取评论信息 */
		getCommentsInfo()
		{
			if(this.commentLoad.showAll){
				return
			}
			this.commentLoad.showAll = true
			getComments({
				pageNum: this.commentLoad.pageNum,
				pageSize: this.commentLoad.pageSize,
				projectId: this.project.id
			})
			.then(res => {
				if(res.data.pageSize < this.commentLoad.pageSize){
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
					this.comments.push(comment)
				})
				console.log(this.comments)
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
			if(this.project.compId === 0){
				this.$showWarn("该比赛未在数据库中,请将该比赛信息录入数据库后再进行操作。",5000)
				return
			}
			if(!this.meaning){
				this.$showWarn("请正确填写项目完整度")
				return
			}
			if(bool){
				this.inform.header = "项目审核结果通知"
				this.inform.inform = {
					title: "项目审核 - 通过",
					content: `恭喜你,你的项目<<${this.project.name}>>成功通过审核！评估完整度为: ${this.meaning}%。`
				}
			}
			else{
				this.inform.inform = {
					title: "项目审核 - 未通过",
					content: `很遗憾的告诉你,你的项目<<${this.project.name}>>未成功通过审核,原因如下:`
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
				this.inform = {
					header: "",
					receiver: null,
					inform: null,
					is_send: false
				}
			})
		},
		/* 点击附件 */
		clickFile(file)
		{
			/* 图片/视频直接打开 */
			getLoadSignature(file.id)
			.then(res => {
				console.log(res.data.url);
				window.open(res.data.url)
			})
		},
		/* 查看购买记录 */
		readRecord(row,column)
		{
			console.log(row);
		}
	},
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
		ol,ul
			margin-left 15px
		.el-image
			border-radius 4px
			cursor pointer
		.el-form-item
			margin 5px 0
			.new-compeition
				color var(--red)
				text-decoration underline
				cursor pointer
			.meaning
				width 200px
			&.check
				.el-button
					margin 0 15px 0 0
		/* 附件信息 */
		.file
			margin-bottom 10px
			.filename
				margin-right 5px
				color var(--blue)
				text-decoration underline
				cursor pointer
			.count
				line-height 1
			span
				margin-right 15px
		/* 介绍 */
		.intro
			margin auto
			max-width 400px
			max-height 80vh
			overflow-y auto
		/* 评论 */
		.comments
			max-height 400px
			overflow-y auto
			.comment
				margin 5px
				padding 10px
				background-color #FFFFFF
				box-shadow var(--shadow1)
				border-radius var(--radius2)
				display flex
				.right
					padding 0 10px
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
						.filename
							color var(--gray)
						.delete
							color var(--red)
							cursor pointer
							font-size 16px
		/* 购买记录 */
		// .purchase-records
		// 	*
</style>
