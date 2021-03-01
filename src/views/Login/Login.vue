<template>
	<div class="login">
		<h1>管理员登录</h1>
		<el-form ref="loginForm" label-width="60px" :rules="Rules" :model="loginFrom">
			<el-form-item label="手机" prop="phone"><el-input type="phone" v-model="loginFrom.phone" autocomplete="off"></el-input></el-form-item>
			<el-form-item label="密码" prop="password"><el-input type="password" v-model="loginFrom.password" autocomplete="off"></el-input></el-form-item>
			<el-button type="primary" @click="Login">登录</el-button>
		</el-form>
	</div>
</template>

<script>
import { AdminLogin } from '@/assets/axios/api_user.js';
export default {
	data() {
		const checkPhone = (rule, value, callback) => {
			if (!value){
				return callback(new Error('手机号不能为空'));
			} 
			else {
				const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
				if (reg.test(value)){
					callback();
				} 
				else {
					return callback(new Error('手机号格式错误'));
				} 
			}
		};
		return {
			Rules: {
				phone: [{ validator: checkPhone }],
				password: [{ required: true, message: '密码不能为空' }]
			},
			loginFrom: {
				phone: '',
				password: ''
			}
		};
	},
	methods: {
		/* 登录 */
		Login() {
			this.$refs.loginForm.validate(valid => {
				if (!valid) return;
				AdminLogin(this.loginFrom).then(res => {
					// console.log(res.data);
					this.$store.commit('successLogin', res.data);
					this.$showSuccess(res.msg);
				});
			});
		}
	}
};
</script>

<style lang="stylus" scoped>
.login
	position absolute
	top 50%
	left 50%
	transform translate(-50%, -50%)
	width 400px
	padding 30px
	background-color #ffffff
	box-shadow var(--shadow1)
	border-radius var(--radius2)
h1
	margin-bottom 10px
	text-align center
.login-form
	.el-form
		width 100%
	.el-input
		margin 10px 0
.el-button
	width 100%
	display block
</style>
