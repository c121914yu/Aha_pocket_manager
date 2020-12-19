<template>
	<div class="edit-competition">
		<div class="content">
			<h2 class="center">比赛编辑</h2>
			<el-form
				ref="informForm"
				label-width="100px"
				:rules="rules"
				:model="competition">
				<el-form-item label="比赛名称" prop="name">
					<el-input type="text" placeholder="请输入比赛名称" v-model="competition.name"></el-input>
				</el-form-item>
				<el-form-item label="比赛分类" prop="type">
					<div class="classify">
						<el-select
							v-model="competition.type[0]" 
							placeholder="选择比赛分类">
						    <el-option
						      v-for="item in compTypes1"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						</el-select>
					    <!-- 分类2 -->
						<el-select 
							v-model="competition.type[1]" 
							placeholder="选择比赛分类">
							<el-option
								v-for="item in compTypes2"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</div>
				</el-form-item>
				<el-form-item label="比赛介绍" prop="intro">
					<el-input
						type="textarea"
						:autosize="{ minRows: 2, maxRows: 8}"
						placeholder="请输入比赛介绍,从小程序中将编辑好的html复制过来"
						resize="none"
						v-model="competition.intro">
					</el-input>
				</el-form-item>
				<el-form-item class="picture" label="比赛图片" prop="picUrl">
					<el-image
						style="width: 100px;"
						v-if="competition.picUrl"
						:src="competition.picUrl"
						:preview-src-list="[competition.picUrl]">
					</el-image>
					<label>
						<i class="el-icon-upload"></i>
						<input type="file" @change="checkImg">
					</label>
				</el-form-item>
				<el-form-item class="btns">
					<el-button class="sure" type="primary" plain @click="handleSure">确认</el-button>
					<el-button class="cancel" type="info" @click="$emit('close')">取消</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { putComp,postNewComp } from "@/assets/axios/api.js"
export default{
	props: {
		competitionInfo: {
			type: Object,
			default: () => {}
		},
		/* 
			记录该比赛是新比赛或是修改比赛信息
			0 新比赛
			1 修改比赛信息
		*/
		type: {
			type: Number,
			default: 0
		}
	},
	data(){
		return{
			rules: {
				name: [
					{ required: true, message: '请输入比赛名称', trigger: 'blur' },
				],
				intro: [
					{ required: true, message: '请输入比赛介绍', trigger: 'blur' },
				]
			},
			compTypes1: [
				{
					value: "保研",
					label: "保研"
				},
				{
					value: "非保研",
					label: "非保研"
				}
			],
			compTypes2: [
				{
					value: "学科竞赛",
					label: "学科竞赛"
				},
				{
					value: "创新创业",
					label: "创新创业"
				}
			],
			competition: {
				name: "",
				intro: "",
				type: ["",""],
				picUrl: ""
			},
			pictureUrl: null
		}
	},
	created() {
		if(this.competitionInfo.name){
			this.competition = {
				...this.competitionInfo,
				type: ["",""],
			}
		}
	},
	methods:{
		/* 选择图片 */
		checkImg(e)
		{
			this.pictureUrl = e.target.files[0]
			this.competition.picUrl = window.URL.createObjectURL(this.pictureUrl)
		},
		/* 
			name: handleSure
			desc: 点击确认按键，先进行表单验证，然后根据type类型分别调用保存和修改API对比赛信息进行操作
		*/
	   handleSure()
	   {
		   this.$refs.informForm.validate((valid) => {
		   	if (valid) {
				console.log(this.competition);
		   		/* 新比赛 */
		   		if(this.type === 0){
					postNewComp(this.competition)
					.then(res => {
						this.$showSuccess("添加比赛信息成功")
						this.$emit("finish")
					})
		   		}
		   		/* 修改比赛 */
		   		else{
					putComp(this.competition)
					.then(res => {
						this.$showSuccess("修改比赛信息成功")
						this.$emit("finish")
					})
		   		}
		   	} 
		   	else {
		   		return false
		   	}
		   })

	   }
	},
	
}
</script>

<style lang="stylus" scoped>
.edit-competition
	z-index 5
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(0,0,0,0.1)
	display flex
	align-items center
	justify-content center
	.content
		width 50%
		padding 10px
		border-radius var(--radius2)
		background-color #FFFFFF
		box-shadow var(--shadow1)
		h2
			color var(--blue)
		.classify
			display grid
			grid-template-columns 1fr 1fr
			grid-gap 10px
		.picture
			i
				margin-left 20px
				font-size 2em
				color var(--blue)
				cursor pointer
			.el-image
				border 1px solid var(--border1)
		.btns
			.sure
				width 30%
</style>
