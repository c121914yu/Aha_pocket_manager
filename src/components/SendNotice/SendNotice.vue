<template>
	<div class="send-notice popup">
		<el-form
			class="content"
			ref="noticeForm"
			label-width="100px"
			:rules="rules"
			:model="notice">
			<h2 class="center">发布系统公告</h2>
			<el-form-item label="收件人" size="mini">全体成员</el-form-item>
			<el-form-item label="发件人" size="mini">Aha口袋</el-form-item>
			<el-form-item label="通知主题" prop="title">
				<el-input v-model="notice.title" placeholder="请输入通知主题"></el-input>
			</el-form-item>
			<el-form-item label="通知内容" prop="content">
				<el-input
					type="textarea"
					:autosize="{ minRows: 2, maxRows: 6}"
					placeholder="请输入通知内容"
					resize="none"
					v-model="notice.content">
				</el-input>
			</el-form-item>
			<el-form-item class="btns">
				<el-button class="sure" type="primary" plain @click="sure">确认</el-button>
				<el-button class="cancel" type="info" @click="$emit('close')">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default{
	data(){
		return{
			notice: {
				title: "",
				content: ""
			},
			rules: {
				title: [
					{ required: true, message: '请输入公告主题', trigger: 'blur' },
				],
				content: [
					{ required: true, message: '请输入公告内容', trigger: 'blur' },
				]
			}
		}
	},
	methods:{
		/* 确认发布 */
		sure()
		{
			this.$refs.noticeForm.validate((valid) => {
				if (valid) {
					this.$confirm(`您将发布系统公告,请确认！`,() => {
						console.log(this.notice);
					})
				} 
				else {
					return false
				}
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.send-notice
	.content
		width 400px
</style>
