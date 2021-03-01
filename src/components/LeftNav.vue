<template>
  <el-menu
    :default-active="currentNav"
    class="left-nav"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router>
	<!-- 单个路由 -->
    <el-menu-item 
      v-for="(item, index) in navs1" 
      :key="index"
      :index="item.index"
      :route="item.path"
      @click="currentNav=index.toString()">
      <i :class="'el-icon-'+item.icon"></i>
      <span>{{item.text}}</span>
    </el-menu-item>
	<!-- 组合路由 -->
	<el-submenu 
		v-for="(nav,index) in navs2"
		:key="nav.text"
		:index="nav.index">
		<template slot="title">
			<i :class="'el-icon-'+nav.icon"></i>
			<span>{{nav.text}}</span>
		</template>
		<el-menu-item 
			v-for="(item,index2) in nav.children"
			:key="item.text"
			:index="item.index"
			:route="item.path">
			<i :class="'el-icon-'+item.icon"></i>
			{{item.text}}
		</el-menu-item>
	</el-submenu>
  </el-menu>
</template>

<script>
export default {
	data(){
		return {
			navs1: [
				{text: "数据统计",icon: "data-analysis",path: "/admin/datashow",index: "1"},
				{text: "用户管理",icon: "user",path: "/admin/users",index: "2"},
				{text: "项目管理",icon: "folder-opened",path: "/admin/projects",index: "3"},
				{text: "订单管理",icon: "tickets",path: "/admin/orders",index: "4"},
				{text: "用户反馈",icon: "chat-dot-square",path: "/admin/feedbacks",index: "5"},
				{text: "我的通知",icon: "bell",path: "/admin/informs",index: "6"},
			],
			navs2: [
				{text: "平台管理",icon: "setting",index: "7",children: [
					{text: "轮播图管理",icon: "data-board",path: "/admin/slidecard",index: "7-1"},
					{text: "活动管理",icon: "date",path: "/admin/activities",index: "7-2"},
					{text: "系统公告",icon: "chat-dot-round",path: "/admin/notice",index: "7-3"},
					{text: "竞赛信息",icon: "trophy",path: "/admin/competitions",index: "7-4"},
					{text: "管理员设置",icon: "setting",path: "/admin/admin",index: "7-5"},
				]},
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
					this.currentNav="1";break;
				case 'Users': case "UserInfo": case "Resume":
					this.currentNav="2";break;
				case "Projects": case "Project": case "UpProject": case "EditProject": 
					this.currentNav="3";break;
				case 'Orders':
					this.currentNav="4";break;
				case 'Feedbacks':
					this.currentNav="5";break;
				case 'Informs':
					this.currentNav="6";break;
				case 'Activities':
					this.currentNav="7-2";break;
				case 'Notice':
					this.currentNav="7-3";break;
				case 'Competitions':
					this.currentNav="7-4";break;
				case 'Admin':
					this.currentNav="7-5";break;
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
	overflow-x hidden
</style>