<template>
	<div 
		v-if="projectId>0" 
		class="memberInfo" 
		@mouseup="dragend"
		@mousemove="drag">
		<!-- 搜索成员 -->
		<div class="search">
			<el-input placeholder="输入ID添加项目成员" v-model="userId">
				<el-button slot="append" icon="el-icon-search" @click="searchMember"></el-button>
			</el-input>
		</div>
		<!-- 项目成员 -->
		<div class="members">
			<div 
				class="member"
				:style="{
					transform: `translateY(${member.translate}px)`,
					'z-index': dragIndex === index ? 10 : 1
				}"
				v-for="(member,index) in members"
				:key="member.memberUserId">
				<el-image
					style="width: 40px; height: 40px;border-radius: 50%;" 
					:src="member.avatarUrl" 
					placeholder="头像加载中..." 
					fit="cover">
				</el-image>
				<div class="name">{{member.nickname}} : {{member.job}}</div>
				<i class="edit el-icon-edit" @click="openSetMember(member)"></i>
				<i 
					class="sort el-icon-sort"
					@mousedown="dragstart($event,index)">
				</i>
			</div>
		</div>
		<SetMember
			v-if="member" 
			:member="member"
			@close="member=null"
			@finish="setMemberInfo"
			@remove="removeMember">
		</SetMember>
	</div>
</template>

<script>
import { getUser } from "@/assets/axios/api_user.js"
import { postMember,putMember,putMembers,deleteMember } from "@/assets/axios/api_project.js"
import SetMember from "./SetMember.vue"
var dragstartY,memberPosition
export default{
	props:{
		projectId: {
			type: Number,
			default: 0
		}
	},
	data(){
		return{
			userId: "",
			members: [],
			member: null,
			dragIndex: null
		}
	},
	components: {
		SetMember,
	},
	methods:{
		/* 拖拽开始 */
		dragstart(e,index)
        {
			this.members[index].draging = true
			this.dragIndex = index
			dragstartY = e.pageY
			memberPosition = index*60+30
        },
        /* 拖拽中 */
        drag(e)
        {
			if(this.dragIndex !== null && this.members[this.dragIndex].draging){
				this.members[this.dragIndex].translate = e.pageY - dragstartY 
				const position = memberPosition+this.members[this.dragIndex].translate
				this.members.forEach((member,index) => {
					if(index !== this.dragIndex){
						const center = 60*index
						/* 在拖拽DOM下方 */
						if(index > this.dragIndex && position > center){
							member.translate = -60
						}
						/* 在拖拽DOM上方 */
						else if(index < this.dragIndex && position < center+60){
							member.translate = 60
						}
						else{
							member.translate = 0
						}
					}
				})
			}
        },
		/* 拖拽结束 */
		dragend(e)
		{
			if(this.dragIndex === null){
				return
			}
			/* 判断拖拽DOM应在下标 */
			const index = Math.floor((this.members[this.dragIndex].translate + memberPosition) / 60)
			/* 将拖拽DOM从原来数组的位置，替换到对应index的位置 */
			let temp = this.members.slice(0)
			temp.splice(this.dragIndex,1)
			temp.splice(index,0,this.members[this.dragIndex])
			this.members = temp.map((item,index) => {
				item.draging = false
				item.translate = 0
				item.rank = index+1
				return item
			})
			this.dragIndex = null
			/* 更新成员 */
			putMembers(this.projectId,this.members)
			.then(res => {
				this.$showSuccess("修改排序成功")
			})
		},
		/* 搜索项目成员 */
		searchMember()
		{
			if(this.userId){
                /* 判断是否已存在*/
                const member = this.members.find(member => member.memberUserId === Number(this.userId))
                if(member){
                    this.$showWarn("成员已存在！")
                    return
                }
				getUser(this.userId)
				.then(res => {
					if(res.data){
						this.member = {
							memberUserId: res.data.id,
							avatarUrl: res.data.avatarUrl,
							nickname: res.data.nickname,
							editable: true,
							job: "",
							index: -1,
                            rank: this.members.length,
							draging: false
						}
					}
					else{
						this.$showWarn("该用户不存在")
					}
				})
			}
		},
		openSetMember(member)
		{
			this.member = member
		},
		/* 批量更新成员信息 */
		updateMembers()
		{
			putMembers(this.projectId,this.members)
		},
		/* 设置成员信息 */
		setMemberInfo(member)
		{
			this.userId = ""
			this.$store.commit("setLoading",true)
			/* 新增成员 */
			if(member.index === -1){
				postMember(this.projectId,member)
				.then(res => {
					member.index = this.members.length
					this.members.push(member)
					this.member = null
					this.$showSuccess("修改成员信息成功")
					this.$store.commit("setLoading",false)
				})
			}
			/* 修改成员 */
			else{
				putMember(this.projectId,member)
				.then(res => {
					this.members[member.index] = member
					this.member = null
					this.$showSuccess("修改成员信息成功")
					this.$store.commit("setLoading",false)
				})
			}
		},
		/* 删除项目成员 */
		removeMember(member)
		{
			/* 判断是否仅剩一个成员 */
			if(this.members.length === 1){
				this.$showWarn("项目成员不能少于1个")
				return
			}
			/* API */
			deleteMember(this.projectId,member.memberUserId)
			.then(res => {
				/* 移除该成员 */
				this.members.splice(member.index,1)
				/* 重新排序位置 */
				this.members.forEach((item,index) => {
					item.rank = index+1
				})
				putMembers(this.projectId,this.members)
				.then(res => {
					this.$showSuccess("删除成员成功")
				})
				this.member = null
			})
		}
	}
}
</script>

<style lang="stylus" scoped>
.memberInfo
	.members
		height 100%
		margin-top 15px
		border-radius var(--radius2)
		overflow auto
		.member
			position relative
			height 60px
			padding 0 10px
			background-color #FFFFFF
			border-bottom 1px solid var(--boder-color1)
			display flex
			align-items center
			user-select none
			.name
				margin 0 5px
				flex 1
			.edit,.sort
				margin 0 5px
				cursor pointer
				font-size 20px
			.edit:hover
				color var(--blue)
			.sort:hover
				color var(--origin2)
</style>
