<template>
	<div class="top-nav">
		<h1>Aha口袋管理系统</h1>
		<el-dropdown v-if="myInfo" placement="bottom-start" @command="commandMenu">
			<div class="my-info">
				<el-avatar 
					:size="45" 
					:src="myInfo.avatarUrl || 'https://aha-public-1257019972.cos.ap-shanghai.myqcloud.com/icon/logo.png'">
				</el-avatar>
				<span>
					{{ myInfo.trueName || myInfo.nickname || '管理员' }}
					<i class="el-icon-arrow-down"></i>
				</span>
			</div>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="0">资料修改</el-dropdown-item>
				<el-dropdown-item command="1">退出登录</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>

<script>
export default {
	data() {
		return {
			myInfo: null
		}
	},
	methods: {
		/* 选择菜单 */
		commandMenu(e) {
			switch (e) {
				case '0': this.$router.replace(`/userInfo/${this.myInfo.userId}`);break;
				case '1': this.logOut();break;
			}
		},
		/* 退出登录 */
		logOut() {
			this.$confirm('确认退出登录?', () => {
				this.$store.commit('logOut');
				this.$showSuccess('已退出登录');
			});
		}
	},
	created() {
		this.myInfo = this.$store.state.myInfo.userInfo
	}
};
</script>

<style lang="stylus" scoped>
.top-nav
	height 100%
	background-color #545c64
	display flex
	align-items center
	h1
		flex 1
		padding-left 20px
		color #ffffff
.el-dropdown
	margin-right 15px
	color #FFFFFF
	cursor pointer
	i
		color #FFFFFF
	.my-info
		display flex
		align-items center
		.el-avatar
			margin-right 5px
</style>
