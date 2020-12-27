<template>
	<div>
		<div class="menu-left">
			<div class="date">
				<div class="date-top">
					<i class="fa fa-chevron-left" @click="beforMoth()"></i>
					<span>
						<span>{{pikerDateYear}}</span>
						年
						<span>{{pikerDateMoth}}</span>
						月
					</span>
					<i class="fa fa-chevron-right" @click="nextMoth()"></i>
				</div>
				<div class="line"></div>
				<div class="date-title">
					<span>日</span>
					<span>一</span>
					<span>二</span>
					<span>三</span>
					<span>四</span>
					<span>五</span>
					<span>六</span>
				</div>
				<div class="date-day">
					<div class="date-day-line" v-for="(item,indexDay) in day">
						<span :class="{'now':item.type == 'now'}" v-for="(item,index) in date" v-if="index<7*(indexDay+1)&&index>=7*indexDay">{{item.date}}</span>
					</div>
				</div>
			</div>
		</div>
		<div class="plan-right">

		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				date: [],
				day: [], //周
				pickerDate: undefined, //日历
				pikerDateYear: '2',
				pikerDateMoth: '2',
			}
		},
		methods: {
			add() {

			},
			beforMoth() {
				var currentDate = this.pickerDate;
				var nowYear = currentDate.getFullYear(); //得到年份
				var nowMonth = currentDate.getMonth() - 1; //得到月份
				var nowDate = currentDate.getDate(); //得到日期
				this.pickerDate = new Date(nowYear, nowMonth, nowDate);
				this.initDate();
			},
			nextMoth() {
				var currentDate = this.pickerDate;
				var nowYear = currentDate.getFullYear(); //得到年份
				var nowMonth = currentDate.getMonth() + 1; //得到月份
				var nowDate = currentDate.getDate(); //得到日期
				this.pickerDate = new Date(nowYear, nowMonth, nowDate);
				this.initDate();
			},
			initDate() {
				this.date.splice(0, this.date.length);
				var currentDate = this.pickerDate;
				var nowYear = currentDate.getFullYear(); //得到年份
				var nowMonth = currentDate.getMonth(); //得到月份
				var nowDate = currentDate.getDate(); //得到日期
				this.pikerDateYear = nowYear;
				this.pikerDateMoth = nowMonth + 1;

				var hour = currentDate.getHours(); //得到小时
				var minu = currentDate.getMinutes(); //得到分钟
				var sec = currentDate.getSeconds(); //得到秒

				var setDate = new Date(nowYear, nowMonth, 1);
				var day = setDate.getDay(); //得到周几
				setDate.setDate(setDate.getDate() - 1);
				var date = setDate.getDate(); //得到日期
				//填充前日期
				for (var x = day - 1; x >= 0; x--) {
					this.date.push({
						type: 'befor',
						date: date - x
					});
				}

				//获取本月最后一天
				var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
				for (var x = 1; x <= monthEndDate.getDate(); x++) {
					this.date.push({
						type: 'now',
						date: x
					});
				}
				for (var x = 1; this.date.length < 42; x++) {
					this.date.push({
						type: 'after',
						date: x
					});
				}
			},
			//初始化周
			initDay() {
				for (var x = 0; x < 6; x++) {
					this.day.push({
						index: x,
						type: 'normal'
					})
				}
			}
		},
		mounted() {
			this.pickerDate = new Date();
			this.initDate();
			this.initDay();
		}
	}
</script>

<style lang="scss">
	html {
		-webkit-user-select: none;
		-moz-user-select: none;
		-o-user-select: none;
		user-select: none;
		overflow: hidden;
	}

	.menu-left .date {
		font-size: 0.8rem;
		height: 400px;
		display: inline-block;
		background: #333333;
		border-radius: 10px;
		background-image: url('../../static/img/date-bg.png');
		background-size: auto 100%;
		box-shadow: 2px 2px 6px #acacac;
	}

	.menu-left .date {
		padding: 20px;
	}

	.menu-left .date .date-top {
		display: flex;
	}

	.menu-left .date .date-top {
		color: #d2d8dc;
	}

	.menu-left .date .date-top span {
		font-size: 0.8rem;
		text-align: center;
		flex: 1;
	}

	.menu-left .date .date-top span span,
	.menu-left .date .date-top i {
		cursor: pointer;
	}

	.menu-left .date .date-top span span:hover,
	.menu-left .date .date-top i:hover {
		color: #6DC9FF;
	}


	.line {
		margin: 20px auto;
		background-color: #95a5a6;
		width: 100%;
		height: 1px;
	}

	.menu-left .date {
		.date-title {
			margin-bottom: 8px;
			display: flex;
			
			color: #dfe6ea;
		}

		.date-title,
		.date-day .date-day-line {
			font-size: 0.8rem;
		}

		.date-day .date-day-line {
			color: #484b4c;
			transition: all 0.3s linear;
		}

		.date-day .date-day-line:hover {
			background: #546d8d;
			border-radius: 2rem;
		}

		.date-day .date-day-line .now {
			color: #bdc3c7;
		}
	}

	.menu-left .date .date-title span,
	.menu-left .date .date-day .date-day-line span {
		text-align: center;
		height: 2rem;
		width: 2rem;
		line-height: 2rem;
		display: inline-block;
	}

	.menu-left .date .date-day .date-day-line span {
		cursor: pointer;
		transition: all 0.3s linear;
	}

	.menu-left .date .date-day .date-day-line span:hover {
		background: #6DC9FF;
		border-radius: 50%;
		color: #FFFFFF;
	}
</style>
