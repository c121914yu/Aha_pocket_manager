<!-- 项目成员设置 -->
<template>
	<div class="popup set-member" @click="$emit('close')">
		<div class="content" @click.stop>
			<h3 class="center">成员设置</h3>
			<el-image
				class="avatar"
				:src="memberInfo.avatarUrl"
				fit="fill"
				:preview-src-list="[memberInfo.avatarUrl]">
			</el-image>
			<div class="member-info">
				<small class="label">ID:</small>
				<span class="value">{{memberInfo.memberUserId}}</span>
			</div>
			<div class="member-info">
				<small class="label">昵称:</small>
				<span class="value">{{memberInfo.nickname}}</span>
			</div>
			<div class="member-info">
				<small class="label">允许编辑项目:</small>
				<el-radio-group v-model="memberInfo.editable">
				    <el-radio :label="true">允许</el-radio>
				    <el-radio :label="false">不允许</el-radio>
				 </el-radio-group>
			</div>
			<div class="member-info">
				<small class="label">负责内容:</small>
				<el-input size="small" type="text" placeholder="负责项目内容" v-model="memberInfo.job"></el-input>
			</div>
			<div class="btns">
				<el-button size="mini" type="primary" @click="$emit('finish',memberInfo)">确认</el-button>
				<el-button v-if="member.index===-1" size="mini" @click="$emit('close')">取消</el-button>
				<el-button v-else size="mini" type="danger" @click="remove">删除</el-button>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	props: {
		member: {
			type: Object,
			default: () => {}
		}
	},
	data(){
		return{
			memberInfo: null
		}
	},
	created() {
		this.memberInfo = {...this.member}
	},
	methods:{
		remove()
		{
			this.$confirm("确认删除成员?",() => {
				this.$emit("remove",this.memberInfo)
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.set-member
	.content
		width 400px
		padding 10px 20px
		h3
			color var(--origin1)
		.avatar
			margin 10px auto
			width 65px
			height 65px
			border-radius 50%
			display block
		.member-info
			margin 10px 0
			display flex
			align-items center
			.label
				margin-right 10px
				white-space nowrap
			.value
				color var(--blue)
		.btns
			margin 15px 0 5px
			display flex
			justify-content space-around
			.el-button
				width 30%
</style>
