<template>
	<div class="url-main">
		<div class="url-main-left">
			<div class="url-main-top">
				<div class="item" :class="{'active':item.active}" v-for="(item,index) in itemLeft" :index="index" @click="choiceItem('left',index)">
					<span>
						{{item.before?item.before.substring(0,3):item.title}}
					</span>
					<i class="fa fa-close" @click.stop="closeItem('left',index)"></i>
				</div>
				<div class="item add" @click="addItem('left')">
					<i class="fa fa-plus"></i>
				</div>
			</div>
			<div class="detail">
				<div class="top">
					<input placeholder="粘贴需要转换的文本" v-model="inputTextLeft" />
				</div>
				<div class="bottom">
					<textarea  placeholder="请在上方粘贴文本" v-model="itemLeft[itemLeftIndex].after"></textarea>
				</div>
			</div>
		</div>
		<div class="url-main-right">
			<div class="url-main-top">
				<div class="item" :class="{'active':item.active}" v-for="(item,index) in itemRight" :index="index" @click="choiceItem('right',index)">
					<span>
						{{item.before?item.before.substring(0,3):item.title}}
					</span>
					<i class="fa fa-close" @click.stop="closeItem('right',index)"></i>
				</div>
				<div class="item add" @click="addItem('right')">
					<i class="fa fa-plus"></i>
				</div>
			</div>
			<div class="detail">
				<div class="top">
					<input placeholder="粘贴需要转换的文本" v-model="inputTextRight" />
				</div>
				<div class="bottom">
					<textarea placeholder="请在上方粘贴文本" v-model="itemRight[itemRightIndex].after"></textarea>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'urlToJson',
		components: {},
		data() {
			return {
				leftNum:1,
				rightNum:1,
				inputTextLeft: "",
				inputTextRight: "",
				itemLeft: [{
					title: '#1',
					active: true,
					before: '',
					after: ''
				}],
				itemRight: [{
					title: '#1',
					active: true,
					before: '',
					after: ''
				}],
				itemLeftIndex: 0,
				itemRightIndex: 0,
			}
		},
		watch: {
			inputTextLeft() {
				try {
					if(!this.inputTextLeft){
						this.itemLeft[this.itemLeftIndex].after = "";
						return;
					}
					var jsonString = decodeURIComponent(this.inputTextLeft)
					var jsonObj = JSON.parse(jsonString) //把json字符串转为json对象
					this.itemLeft[this.itemLeftIndex].after = JSON.stringify(jsonObj, null, 4);
					this.itemLeft[this.itemLeftIndex].before = this.inputTextLeft;
				} catch (e) {
					this.itemLeft[this.itemLeftIndex].after = e;
					//this.afterLeftTxt = this.leftTxt;
				}
			},
			inputTextRight() {
				try {
					if(!this.inputTextRight){
						this.itemRight[this.itemRightIndex].after = "";
						return;
					}
					var jsonString = decodeURIComponent(this.inputTextRight)
					var jsonObj = JSON.parse(jsonString) //把json字符串转为json对象
					this.itemRight[this.itemRightIndex].after = JSON.stringify(jsonObj, null, 4);
					this.itemRight[this.itemRightIndex].before = this.inputTextRight;
				} catch (e) {
					this.itemRight[this.itemRightIndex].after = e;
				}
			},
			itemLeftIndex() {
				this.inputTextLeft = this.itemLeft[this.itemLeftIndex].before;
			},
			itemRightIndex() {
				this.inputTextRight = this.itemRight[this.itemRightIndex].before;
			},
		},
		methods: {
			addItem(type) {
				if (type == 'left') {
					this.itemLeft.push({
						title: '#' + (++this.leftNum),
						active: false
					})
				} else if (type == 'right') {
					this.itemRight.push({
						title: '#' + (++this.rightNum),
						active: false
					})
				}
			},
			choiceItem(type, index) {
				this.caloseAll(type)
				if (type == 'left') {
					this.itemLeft[index].active = true;
					this.itemLeftIndex = index;
				} else if (type == 'right') {
					this.itemRight[index].active = true;
					this.itemRightIndex = index;
				}
			},
			closeItem(type, index) {
				if (type == 'left') {
					if(this.itemLeft.length==1){
						return;
					}
					this.itemLeft.splice(index, 1);
					if (this.itemLeftIndex != index) {
						if(index<this.itemLeftIndex){
							this.itemLeftIndex--;
						}
						return;
					}
					this.itemLeftIndex = index - 1;
					this.itemLeftIndex = this.itemLeftIndex == -1 ? 0 : this.itemLeftIndex;
					this.itemLeft[this.itemLeftIndex].active = true;
				} else if (type == 'right') {
					if(this.itemRight.length==1){
						return;
					}
					this.itemRight.splice(index, 1);
					if (this.itemRightIndex != index) {
						if(index<this.itemRightIndex){
							this.itemRightIndex--;
						}
						return;
					}
					this.itemRightIndex = index - 1;
					this.itemRightIndex = this.itemRightIndex == -1 ? 0 : this.itemRightIndex;
					this.itemRight[this.itemRightIndex].active = true;
				}
			},
			caloseAll(type) {
				if (type == 'left') {
					for (var x = 0; x < this.itemLeft.length; x++) {
						this.itemLeft[x].active = false;
					}
				} else if (type == 'right') {
					for (var x = 0; x < this.itemRight.length; x++) {
						this.itemRight[x].active = false;
					}
				}
			}
		},
		mounted() {

		}
	}
</script>

<style lang="scss">
	.url-main {
		box-sizing: border-box;
		padding: 10px;
		padding-top: 0;
		width: 100%;
		height: 100%;
		display: flex;

		* {
			font-size: 0.8rem;
			color: #6e797a;
			transition: all 0.1s linear;
		}

		.url-main-left,
		.url-main-right {
			box-sizing: border-box;
			overflow: hidden;
			width: 100%;
			border-top-right-radius: 4px;
			margin: 0 2px;
			flex: 1;
			height: 100%;
			display: flex;
			flex-direction: column;

			.detail {
				display: block;
				box-sizing: border-box;
				flex: 1;
				width: 100%;
				background: #FFFFFF;
				display: flex;
				flex-direction: column;
				z-index: 9;
				padding: 10px;

				.bottom {
					box-sizing: border-box;
					padding: 10px 0;
					flex: 1;

					textarea {
						font-size: 1.2rem;
						width: 100%;
						height: 100%;
						outline: none;
						border: none;
						resize: none;
					}
				}

				.top {
					padding-top: 10px;
					padding-bottom: 10px;
					display: flex;
					border-bottom: 1px #afc2c3 solid;

					input {
						flex: 1;
						outline: none;
						border: none;
					}
				}
			}

			.url-main-top {
				padding-top: 10px;
				white-space: nowrap;
				display: flex;
				width: 100%;
				overflow: auto;

				.item.add {
					width: auto;
					padding: 4px 20px;

					.fa {
						line-height: 1.2rem;
						color: #1abc9c;
					}

				}

				span {
					flex: 1;
				}

				.item {
					display: inline-flex;
					width: 5rem;
					color: #34495e;
					padding: 4px 20px;
					padding-right: 8px;
					box-sizing: border-box;

					.fa-close {
						margin-left: 10px;
						//flex: 1;
						line-height: 1.2rem;
						cursor: pointer;
						text-align: right;
						font-size: 0.6rem;
						display: none;
						color: #6e797a;
					}

					.fa-close:hover {
						color: #e67e22;
					}
				}

				.item:hover {
					color: #2980b9;
					background: #ffffff;
					border-top-left-radius: 10px;
					border-top-right-radius: 10px;

					.fa-close {
						display: inline-block;
					}
				}

				.item.active {
					z-index: 9;
					color: #2980b9;
					background: #ffffff;
					border-top-left-radius: 10px;
					border-top-right-radius: 10px;
					box-shadow: 4px 0 6px rgba(0,0,0,0.2);

					.fa-close {
						display: inline-block;
					}
				}
			}
		}
	}
</style>
