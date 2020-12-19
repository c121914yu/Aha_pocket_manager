<template>
	<div v-if="receiver" class="send-inform">
		<el-form 
			class="content"
			ref="informForm"
			label-width="80px"
			:rules="rules"
			:model="informInfo">
			<h3 class="center">{{receiver.title}}</h3>
			<el-form-item v-if="receiver.id" label="收件人ID" size="mini">
				{{receiver.id}}
			</el-form-item>
			<el-form-item label="收件人" size="mini">
				{{receiver.trueName || receiver.nickname}}
			</el-form-item>
			<el-form-item label="发件人" size="mini">管理员</el-form-item>
			<el-form-item label="通知主题" prop="title">
				<el-input v-model="informInfo.title" placeholder="请输入通知主题"></el-input>
			</el-form-item>
			<el-form-item label="通知内容" prop="content">
				<el-input
					type="textarea"
					:autosize="{ minRows: 2, maxRows: 6}"
					placeholder="请输入通知内容"
					resize="none"
					v-model="informInfo.content">
				</el-input>
			</el-form-item>
			<div class="btns">
				<el-button class="send" type="primary" plain @click="send">发送</el-button>
				<el-button class="cancel" type="info" @click="$emit('close')">取消</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
export default{
	data(){
		return{
			informInfo: {
				title: "",
				content: "",
			},
			rules: {
				title: [
					{ required: true, message: '请输入通知主题', trigger: 'blur' },
				],
				content: [
					{ required: true, message: '请输入通知内容', trigger: 'blur' },
				]
			}
		}
	},
	props: {
		receiver: {
			type: Object,
			default: () => {}
		}
	},
	methods:{
		/* 发送信息 */
		send()
		{
			this.$refs.informForm.validate((valid) => {
				if (valid) {
					this.$confirm(`您即将发送通知给 ${this.receiver.trueName || this.receiver.nickname},请确认！`,() => {
						this.$emit("success",{
							receiverUserId: this.receiver.id,
							...this.informInfo
						})
					})
				} 
				else {
					return false
				}
			})
		}
	},
	created() {
		console.log(this.receiver);
	}
}
</script>

<style lang="stylus" scoped>
.send-inform
	z-index 10
	position fixed
	top 0
	left 0
	right 0
	bottom 0
	background-color rgba(0,0,0,0.2)
	display flex
	align-items center
	justify-content center
	.content
		width 400px
		padding 10px
		border-radius var(--radius2)
		background-color #FFFFFF
		.btns 
			.el-button
				width 40%
			.cancel
				float right
</style>
