<template>
	<div v-if="project" class="project">
		<!-- 项目信息 -->
		<el-form label-width="80px">
			<!-- 头像 -->
			<div class="center" v-if="project.avatarUrl">
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
				<span style="color: var(--red)">
					<i class="el-icon-star-on"></i>
					{{project.collect}}
				</span>
			</el-form-item>
			<el-form-item label="参赛信息">
				{{project.awardTime}},{{awardLevel}}: 
				<!-- 如果是已有比赛则直接展示，如果是新比赛，则显示为输入框以确认新比赛的正确名称 -->
				<strong v-if="project.compId>0">{{project.compName}}</strong>
				<strong
					v-else
					class="new-compeition"
					@click="addComp">
					{{project.compName}}
				</strong>
			</el-form-item>
			<el-form-item style="margin-top: 10px;" label="获奖证明">
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
			</el-form-item>
			<el-form-item label="审核">
				<el-input
					class="cause" 
					placeholder="项目拒绝的原因" 
					v-model="cause">
				</el-input>
				<div class="btns">
					<el-button type="success" @click="check(true)">通过</el-button>
					<el-button type="danger" @click="check(false)">拒绝</el-button>
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
		<!-- 比赛编辑 -->
		<EditCompetition
			v-if="competition"
			:competitionInfo="competition" 
			:type="0"
			@close="competition=null"
			@finish="getProjectInfo">
		</EditCompetition>
	</div>
</template>

<script>
import { getProject,getComments,getLoadSignature,checkProject } from "@/assets/axios/api.js"
import EditCompetition from "@/components/EditCompetition/EditCompetition.vue"
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
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
				{name: "余金隆",filename:"dsgsd.mp4",time:"2020/5/5 20:50",point: 50},
			],
			competition: null,
			meaning: 100,
			cause: "",
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
			if(level)
				return level.label
			return ""
		}
	},
	created() {
		this.getProjectInfo()
	},
	components: {
		EditCompetition,
	},
	methods:{
		/* 获取项目信息 */
		getProjectInfo()
		{
			this.competition = null
			getProject(this.$route.params.id)
			.then(res => {
				this.project = res.data
				this.newCompName = this.project.compName
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
				this.comments =  this.comments.concat(res.data.pageData.map(comment => {
					const file = this.project.resources.find(item => item.id === comment.resourceId)
					return{
						...comment,
						time: this.gformatDate(comment.time),
						filename: file.name
					}
				}))
				console.log(this.comments)
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
		/* 添加新比赛 */
		addComp()
		{
			this.competition = {
				name: this.project.compName,
				intro: "",
				picUrl: null
			}
		},
		/* 审批项目 */
		check(bool)
		{
			const text = bool ? "通过" : "拒绝"
			this.$confirm(`你即将 ${text} 该项目,请确认！`,() => {
				checkProject(this.project.id,{
					meaning: this.meaning,
					passed: bool
				})
				.then(res => {
					this.project.passed = bool
					this.project.meaning = this.meaning
					if(bool){
						this.$showSuccess("项目已通过")
					}
					else{
						this.$showError("已拒绝该项目")
					}
				})
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
		.el-form-item
			margin 5px 0
			.new-compeition
				color var(--red)
				text-decoration underline
				cursor pointer
			
			/* 项目意义输入框 */
			.meaning
				width 200px
			.btns .el-button
				margin 10px 20px 0 0
		/* 介绍 */
		.intro
			margin auto
			max-width 400px
			max-height 80vh
			overflow-y scroll
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
