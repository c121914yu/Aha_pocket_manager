<template>
	<div class="resume">
		<h1 class="center">{{name}}</h1>
		<p class="center">(工作意愿: {{workPlace}} {{profession}})</p>
		<p>
			<span>{{gender}}</span>
			<span>{{age}}岁</span>
			<span>{{highestDegree}}{{identity === "学生" ? "在读" : "毕业"}}</span>
			<span>{{currentGrade}}</span>
		</p>
		<p class="border">
			<span>手机号: {{phone}}</span>
			<span>邮箱: {{email}}</span>
		</p>
		<!-- 列表 -->
		<div v-if="eduExperiences && eduExperiences.length>0" class="list">
			<h3>教育经历</h3>
			<p
				class="item"
				v-for="(item,index) in eduExperiences"
				:key="index">
				<span>{{item.startTime.replace("-",".")}} - {{item.endTime.replace("-",".")}}</span>
				<span>{{item.degree}}</span>
				<span>{{item.school}}</span>
				<span>{{item.specialty}}</span>
				<span>成绩排名{{item.grade}}</span>
			</p>
		</div>
		<div v-if="practiceExperiences && practiceExperiences.length>0" class="list">
			<h3>实习经历</h3>
			<div
				class="item"
				v-for="(item,index) in practiceExperiences"
				:key="index">
				<span>{{item.startTime.replace("-",".")}} - {{item.endTime.replace("-",".")}}</span>
				<span><strong>{{item.company}}</strong></span>
				<span><strong>{{item.post}}</strong></span>
				<p>{{item.description}}</p>
			</div>
		</div>
		<div v-if="projectExperiences && projectExperiences.length>0" class="list">
			<h3>项目经历</h3>
			<div
				class="item"
				v-for="(item,index) in projectExperiences"
				:key="index">
				<p>{{item.startTime.replace("-",".")}} - {{item.endTime.replace("-",".")}}</p>
				<p>项目名称: <strong>{{item.name}}</strong></p>
				<p>负责内容: <strong>{{item.content}}</strong></p>
				<p>{{item.description}}</p>
			</div>
		</div>
		<div v-if="schoolExperiences && schoolExperiences.length>0" class="list">
			<h3>校园经历</h3>
			<div
				class="item"
				v-for="(item,index) in schoolExperiences"
				:key="index">
				<p>{{item.startTime.replace("-",".")}} - {{item.endTime.replace("-",".")}}</p>
				<p class="main">
					<span>{{item.organization}}</span>
					<span>{{item.post}}</span></p>
				<p class="description">{{item.description}}</p>
			</div>
		</div>
		<div v-if="honors && honors.length>0" class="list">
			<h3>荣誉情况</h3>
			<div
				class="item"
				v-for="(item,index) in honors"
				:key="index">
				<p>
					<span>{{item.time.replace("-",".")}}</span>
					<span>{{item.name}}</span>
				</p>
				<p>{{item.description}}</p>
			</div>
		</div>
		<!-- 专业技能 -->
		<div v-if="projectSkill" class="desc">
			<h3>个人技能</h3>
			<p>{{projectSkill}}</p>
		</div>
		<!-- 自我介绍 -->
		<div v-if="intro" class="desc">
			<h3>自我介绍</h3>
			<p>{{intro}}</p>
		</div>
	</div>
</template>

<script>
import { getUser,getResume } from "@/assets/axios/api.js"
export default{
	data(){
		return{
			userId: "",
			name: "",
			phone: "",
			email: "",
			gender: "",
			birth: "",
			highestDegree: "",
			identity: "",
			currentGrade: "",
			workPlace: "",
			profession: "",
			eduExperiences: [],
			schoolExperiences: [],
			projectExperiences: [],
			practiceExperiences: [],
			projectSkill: [],
			honors: [],
			intro: ""
		}
	},
	computed: {
		age(){
			return Math.floor((Date.now() - new Date(this.birth)) / 1000 / 60 / 60 / 24 / 365)
		}
	},
	methods:{
		
	},
	created() {
		getResume(this.$route.params.id)
		.then(res => {
			for(let key in res.data){
				this[key] = res.data[key]
			}
			console.log(res.data);
		})
	}
}
</script>

<style lang="stylus" scoped>
.resume
	margin auto
	width 600px
	min-height 100vh
	padding 20px
	border 1px solid var(--boder-color1)
	p
		line-height 1.6
	span
		margin-right 10px
	.border
		padding-bottom 5px
		border-bottom 1px solid var(--boder-color1)
	.list,.desc
		margin 10px 0
		h3
			padding-left 10px
			border-left 8px solid #f8d99f
		.item
			margin 5px 0
	.desc
		h3
			margin-bottom 5px
</style>
