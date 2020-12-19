<template>
  <el-menu
    :default-active="currentNav"
    class="left-nav"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router>
    <el-menu-item 
      class="item"
      v-for="(item, index) in navs" 
      :key="index"
      :index="index.toString()"
      :route="item.path"
      @click="currentNav=index.toString()">
      <i :class="'el-icon-'+item.icon"></i>
      <span slot="title">{{item.text}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
	data(){
		return {
			navs: [
				{text: "数据统计",icon: "data-analysis",path: "/datashow"},
				{text: "用户管理",icon: "user",path: "/users"},
				{text: "项目管理",icon: "folder-opened",path: "/projects"},
				{text: "订单管理",icon: "tickets",path: "/orders"},
				{text: "竞赛信息",icon: "trophy",path: "/competitions"},
				{text: "用户反馈",icon: "chat-dot-square",path: "/feedbacks"},
				{text: "我的通知",icon: "bell",path: "/informs"},
				{text: "系统公告",icon: "chat-dot-round",path: "/notice"},
				{text: "管理员设置",icon: "setting",path: "/admin"},
			],
			currentNav: '2'
		}
	},
	watch: {
		"$route": "routeChange"
	},
	methods: {
		routeChange()
		{
			switch(this.$route.name){
				case 'DataShow': 
					this.currentNav="0";break;
				case 'Users': case "UserInfo": case "Resume":
					this.currentNav="1";break;
				case "Projects": case "Project": 
					this.currentNav="2";break;
				case 'Orders':
					this.currentNav="3";break;
				case 'Competitions':
					this.currentNav="4";break;
				case 'Feedback':
					this.currentNav="5";break;
				case 'Informs':
					this.currentNav="6";break;
				case 'Notice':
					this.currentNav="7";break;
				case 'Admin':
					this.currentNav="8";break;
			}
		}
	},
	created() {
		this.routeChange()
	}
}
</script>

<style lang="stylus" scoped> 
.left-nav
  height 100%
  .item
    padding 0 40px
</style>