<!-- 爱计划 -->
<template>
	<div class="a-plane">
		<div class="top">
			<div class="show-type">
				<div :class="{'active':showType=='week'}" @click="changeShowType('week')">周</div>
				<div :class="{'active':showType=='moth'}" @click="changeShowType('moth')">月</div>
				<div class="bottom-tag" :class="{'to-right':showType=='moth','to-left':showType=='week'}"></div>
			</div>
			<div class="tools">
				<span class="item" @click="showDayReportFun('')">
					<i class="fa fa-file-text-o" aria-hidden="true" title="日报"></i>
					<div></div>
				</span>
				<span class="item" @click="showWeekReportFun('')" v-if="showType=='week'">
					<i class="fa fa-file-word-o" aria-hidden="true" title="周报"></i>
					<div></div>
				</span>
				<span class="item">
					<i class="fa fa-refresh" aria-hidden="true" @click="reload()" title="重置表格"></i>
				</span>
			</div>
		</div>
		<div class="bottom">
			<table @dblclick="reloadTable()" ref='table' @mousedown="move" :style="{'left':positionX+'px','top':positionY+'px','transform':'scale('+tableScale+')'}">
				<thead>
					<tr>
						<th style="white-space: nowrap;">分类</th>
						<th v-for="(day,wIndex) in dates">
							{{day.year+'/'+((day.moth+1)<10?'0'+(day.moth+1):(day.moth+1))+'/'+(day.date<10?'0'+day.date:day.date)}}
						</th>
					</tr>
				</thead>
				<tbody id="tableBody">
					<tr v-for="(item,index) in works">
						<td>
							<div class="work-item-type" style="white-space: nowrap;">
								{{item.type}}
							</div>
						</td>
						<td v-for="(work,wIndex) in item.data">
							<div v-if="work.show" class="work-item" v-for="(detail,dIndex) in work.data" :class="detail.status" :style="{'margin-left':getTdLeft(detail.left,work.colspan),'width':getTdWidth(detail.colspan,work.colspan),'font-size':getFontSize(detail.title)}"
							 :title="'['+detail.status+'] 持续'+detail.colspan+'天'">
								{{detail.title}}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="modal-report" v-show="showDayReport" :style="{'opacity':showDayReportOpacity}">
			<div class="modal-report-div">
				<div class="modal-report-top">
					<span class="copy-text" :style="{'opacity':showDayReportTxtOpacity}">已复制</span>
					<i class="fa fa-copy" @click="copyDayReport"></i>
					<i class="fa fa-close" @click="closeDayReportFun"></i>
				</div>
				<textarea id="dayReport">

        </textarea>
			</div>
		</div>

		<div class="modal-report" v-show="showWeekReport" :style="{'opacity':showWeekReportOpacity}">
			<div class="modal-report-div" style="height: calc(100% - 200px);width: 600px;">
				<div class="modal-report-top">
					<span class="copy-text" :style="{'opacity':showWeekReportTxtOpacity}">已复制</span>
					<i class="fa fa-copy" @click="copyWeekReport"></i>
					<i class="fa fa-close" @click="closeWeekReportFun"></i>
				</div>
				<textarea id="weekReport">

		    </textarea>
			</div>
		</div>
	</div>
</template>

<script>
	const nedb = require('nedb');
	import {
		globalBus
	} from '@/assets/js/globalBus.js';
	export default {
		components: {

		},
		data() {
			return {
				//任务类型数据库
				aplaneTypeDb: undefined,
				//任务数据库
				aplaneTodoDb: undefined,
				//当前加载的数据库
				startLoadDate: {
					year: '',
					moth: '',
					date: '',
					week: ''
				},
				//当前加载的数据库
				endLoadDate: {
					year: '',
					moth: '',
					date: '',
					week: ''
				},
				showType: 'week',
				dates: [],
				works: [],
				typeListMap: new Map(),
				planeMap: new Map(), //按日期分类的全部任务
				types: [],
				typeDate: {},
				//table的移动缩放
				positionX: 0,
				positionY: 0,
				tableScale: 1,
				dateTag: new Map(), //用于更新日历打标记
				choiceDate: {}, //当前日历选择的日期


				showDayReport: false, //是否展示日报框
				showDayReportTxtOpacity: 0, //提示文字透明度
				showDayReportOpacity: 0, //拷贝弹窗显示透明度
				showWeekReport: false, //是否展示日报框
				showWeekReportTxtOpacity: 0, //提示文字透明度
				showWeekReportOpacity: 0, //拷贝弹窗显示透明度
				onload: false, //是否正在加载

			}
		},
		created() {
			globalBus.$on('aPlane_reload', (res) => {
				this.startLoadDate = {};
				this.endLoadDate = {};
				this.loadTypes();
			});
			globalBus.$on('aPlane_changeShowTypeBack', (res) => {
				this.changeShowTypeBack(res);
			});
			globalBus.$on('aDate_changeDateBack', (res) => {
				this.choiceDate = res;
				this.showDayReportFun(res);
			});
		},
		methods: {
			getTdLeft(left, colspan) {
				return 'calc(' + left * 100 + "%" + ' + ' + left + 'px)';
			},
			copyWeekReport() {
				var _this = this;
				let url = document.getElementById("weekReport");
				url.select(); // 选择对象
				document.execCommand("Copy");
				_this.showWeekReportTxtOpacity = 1;
				setTimeout(function() {
					_this.showWeekReportTxtOpacity = 0;
				}, 1500)
			},
			copyDayReport() {
				var _this = this;
				let url = document.getElementById("dayReport");
				url.select(); // 选择对象
				document.execCommand("Copy");
				_this.showDayReportTxtOpacity = 1;
				setTimeout(function() {
					_this.showDayReportTxtOpacity = 0;
				}, 1500)
			},
			closeWeekReportFun() {
				var _this = this;
				_this.showWeekReportOpacity = 0;
				setTimeout(function() {
					_this.showWeekReport = false;
				}, 200)
			},
			closeDayReportFun() {
				var _this = this;
				_this.showDayReportOpacity = 0;
				setTimeout(function() {
					_this.showDayReport = false;
				}, 200)
			},
			//日报
			showDayReportFun(date) {
				var _this = this;
				if (date) {
					var dayReport = document.getElementById("dayReport")
					if (!_this.showDayReport || !dayReport) return;
					// 查询所有结果集
					_this.aplaneTodoDb.find({
						year: date.year,
						moth: date.moth,
						date: date.date
					}, function(err, docs) {
						var timeNow = new Date();
						var allTxt = timeNow.getHours() > 12 ? "今日完成\n" : "今日计划\n";
						var map = new Map();
						for (var x in docs) {
							var type = docs[x].type ? docs[x].type : '未分类'
							var txtArr = map.get(type);
							if (!txtArr) {
								txtArr = [];
								map.set(type, txtArr)
							}
							var txt = (txtArr.length + 1) + '. ' + docs[x].title;
							if (docs[x].status && docs[x].status != 0) {
								txt += "（" + docs[x].status + "）\n";
							} else {
								txt += "（进行中）\n";
							}
							if (docs[x].detail) {
								txt += '   ' + docs[x].detail + "\n";
							}
							txtArr.push(txt)
						}
						map.forEach(function(value, key) {
							allTxt += key + ":\n";
							for (var x in value) {
								allTxt += value[x];
							}
							allTxt += "\n";
						})
						document.getElementById("dayReport").value = allTxt.trim();
					});
				} else {
					_this.showDayReport = true;
					globalBus.$emit('aDate_getDate', _this.dateTag);
					setTimeout(function() {
						_this.showDayReportOpacity = 1;
					}, 50)
				}
			},
			//日报
			showWeekReportFun(date) {
				var _this = this;
				var timeMap = new Map();
				var all = 0;
				var loopDates;
				loopDates = _this.dates.slice(1, 6);
				var allTxt = "本周工作（" + (loopDates[0].moth + 1) + "." + loopDates[0].date + "~" + (loopDates[4].moth + 1) +
					"." + loopDates[4].date + "）\n";
				for (var x in loopDates) {
					var w;
					switch (x) {
						case '0':
							w = "一";
							break;
						case '1':
							w = "二";
							break;
						case '2':
							w = "三";
							break;
						case '3':
							w = "四";
							break;
						case '4':
							w = "五";
							break;
					}
					allTxt += "周" + w + "（" + (loopDates[x].moth + 1) + "." + loopDates[x].date + "）\n";
					var date = loopDates[x].year + '-' + loopDates[x].moth + '-' + loopDates[x].date;
					var data = _this.planeMap.get(date);
					var map = new Map();
					for (var i in data) {
						var listD = map.get(data[i].title);
						if (!listD) {
							listD = new Array();
							map.set(data[i].type, listD);
						}
						listD.push(data[i])
					}
					map.forEach(function(value, key) {
						allTxt += (key ? " " + key + ":\n" : ' 其他:\n');
						all += value.length;
						if (!timeMap.get(key)) {
							timeMap.set(key, 0)
						}
						timeMap.set(key, timeMap.get(key) + 1)
						for (var j in value) {
							allTxt += " " + (parseInt(j) + 1) + ". " + value[j].title + "（" + (value[j].status == '延期' ? '进行中' : value[j].status) +
								"）\n";
							allTxt += "    " + value[j].detail + "\n";
						}
					});
					allTxt += "\n";
				}
				allTxt += "\n下周计划:\n";
				this.loadNextWeekPlane(function(text) {
					allTxt += text;
					allTxt += "当前工作时间占比:\n";
					timeMap.forEach(function(value, key) {
						var k = (key ? " " + key  : ' 其他');
						var t='';
						for(var l=0;l<3-k.length/4;l++){
							t+='\t';
						}
						allTxt += k + t + Math.round(value / all * 100) + "%\n";
					})
					allTxt += "\n\n";
					allTxt += "存在问题:\n无\n";
					allTxt += "存在风险:\n无\n";
					allTxt += "需要支持:\n无\n";
					document.getElementById("weekReport").value = allTxt.trim();
					_this.showWeekReport = true;
					setTimeout(function() {
						_this.showWeekReportOpacity = 1;
					}, 50)
				});

			},
			//加载下周计划
			loadNextWeekPlane(callBack) {
				var _this = this;
				var map = new Map();
				var titleSet = new Set();
				var db = _this.aplaneTodoDb;
				var choiceDate = this.dates[6];
				var newDate = new Date(choiceDate.year, choiceDate.moth, choiceDate.date);
				var endDate = newDate.getDate();
				var moth = choiceDate.moth;
				var text = "";
				for (var x = 1; x <= 6; x++) {
					(function(xx) {
						newDate.setDate(newDate.getDate() + 1);
						if (newDate.getMonth() != moth) {
							moth = newDate.getMonth();
							db = new nedb({
								filename: '/data/aplane-todo_' + newDate.getFullYear() + '-' + newDate.getMonth() + '.db',
								autoload: true
							});
						}
						db.find({
							year: newDate.getFullYear(),
							moth: newDate.getMonth(),
							date: newDate.getDate()
						}, function(err, docs) {
							for (var x in docs) {
								var data = map.get(docs[x].type);
								if (!data) {
									data = new Array();
									map.set(docs[x].type, data);
								}
								if (!titleSet.has(docs[x].title)) {
									titleSet.add(docs[x].title)
									data.push(docs[x]);
								}
							}

							if (xx == 6) {
								map.forEach(function(value, key) {
									text += (key ? " " + key + ":\n" : ' 其他:\n');
									for (var i in value) {
										text += ' ' + (parseInt(i) + 1) + ". " + value[i].title + "\n";
									}
								})
								text += '\n\n';
								callBack(text);
							}
						})
					})(x)
				}
			},
			getFontSize(txt) {
				return txt.length > 10 ? '0.8rem' : '1rem';
			},
			//计算占据宽度 col自身比例  allCol总的宽比
			getTdWidth(col, allCol) {
				return 'calc(' + col * 100 + '% - 10px)';
			},
			reload() {
				this.startLoadDate = {};
				this.endLoadDate = {};
				this.loadTypes();
				this.reloadTable();
			},
			reloadTable() {
				this.positionX = 0;
				this.positionY = 0;
				this.tableScale = 1;
			},
			move(e) {
				let odiv = e.target; //获取目标元素
				//算出鼠标相对元素的位置
				let disX = e.clientX;
				let disY = e.clientY;
				let oldX = this.positionX;
				let oldY = this.positionY;
				document.onmousemove = (e) => { //鼠标按下并移动的事件
					//用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
					let left = e.clientX - disX;
					let top = e.clientY - disY;
					//绑定元素位置到positionX和positionY上面
					this.positionX = oldX + left;
					this.positionY = oldY + top;
				};
				document.onmouseup = (e) => {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			},
			changeShowTypeBack(res) {
				var _this = this;
				if (_this.onload) {
					return;
				}
				_this.onload = true;
				_this.dates.splice(0, _this.dates.length)
				_this.works.splice(0, _this.works.length);
				_this.planeMap.clear();
				_this.typeListMap.forEach(function(value, key) {
					value.splice(0, value.length)
				});

				var start = false;
				if (this.showType == 'moth') {
					if (_this.startLoadDate.year + "-" + _this.startLoadDate.moth != res.year + "-" + res.moth) {
						_this.aplaneTodoDb = new nedb({
							filename: '/data/aplane-todo_' + res.year + '-' + res.moth + '.db',
							autoload: true
						});
					}
					_this.startLoadDate = res;
					var monthEndDate = new Date(res.year, res.moth + 1, 0).getDate();
					for (var x = 1; x <= monthEndDate; x++) {
						_this.dateTag.set(res.year + "-" + res.moth + "-" + x, false);
						_this.dates.push({
							year: res.year,
							moth: res.moth,
							date: x
						});
						(function(x, max) {
							_this.findAndAddPlane({
								year: res.year,
								moth: res.moth,
								date: x,
								max: max,
								x: x
							});
						})(x, monthEndDate)
					}
				} else if (res.dates && res.dates.length > 0) {
					var startDate = res.dates[0];
					_this.endLoadDate = startDate;
					_this.startLoadDate = startDate;
					_this.aplaneTodoDb = new nedb({
						filename: '/data/aplane-todo_' + startDate.year + '-' + startDate.moth + '.db',
						autoload: true
					});
					for (var x = 0; x < res.dates.length; x++) {
						this.dates.push({
							year: res.dates[x].year,
							moth: res.dates[x].moth,
							date: res.dates[x].date
						});
						_this.dateTag.set(res.dates[x].year + "-" + res.dates[x].moth + "-" + res.dates[x].date, false);
						//进入另一个月份
						if (res.dates[x].year != _this.endLoadDate.year || res.dates[x].moth != _this.endLoadDate.moth) {
							_this.aplaneTodoDb = new nedb({
								filename: '/data/aplane-todo_' + res.dates[x].year + '-' + res.dates[x].moth + '.db',
								autoload: true
							});
							_this.endLoadDate = res.dates[x];
						}
						(function(x, max) {
							_this.findAndAddPlane({
								year: res.dates[x].year,
								moth: res.dates[x].moth,
								date: res.dates[x].date,
								max: max,
								x: x
							});
						})(x, res.dates.length - 1)
					}
				}
				_this.typeListMap.forEach(function(value, key) {
					_this.works.push({
						type: key,
						data: value
					});
				});
			},
			//res 日期 找到这个日期下所有计划
			findAndAddPlane(res) {
				var _this = this;
				// 查询所有结果集
				_this.aplaneTodoDb.find({
					year: res.year,
					moth: res.moth,
					date: res.date
				}, function(err, docs) {
					_this.planeMap.set(res.year + '-' + res.moth + '-' + res.date, docs);
					//先添加一个空计划占行
					_this.typeListMap.forEach(function(value, key) {
						value.push({
							colspan: 1,
							data: [],
							show: true
						})
					});
					//遍历找到的全部计划
					for (var x in docs) {
						//如果找不到对应分类就是未分类
						var type = docs[x].type ? docs[x].type : '未分类';
						if (!_this.typeListMap.get(type)) {
							type = '未分类';
						}
						//默认一个任务一天
						docs[x].colspan = 1;
						docs[x].show = true;

						//获取这个分类下所及计划 把计划归到这下面
						var data = _this.typeListMap.get(type);
						if (data.length > 1) {
							var pyl = 1; //便偏移量
							for (var y = data.length - 2; y >= 0; y--, pyl++) {
								var beforDatas = data[y]; //前一天的任务
								if (!beforDatas.show) {
									continue
								};
								for (var i in beforDatas.data) {
									if (docs[x].title == beforDatas.data[i].title) { //如果前一天有同一个任务就不在添加  把天数+1
										beforDatas.colspan++;
										beforDatas.data[i].status = beforDatas.data[i].status != '已完成' ? '延期' : beforDatas.data[i].status;
										beforDatas.data[i].colspan++;
										if (data[data.length - 1].data.length > 0 && data[data.length - 1].show) {
											for (var dd in data[data.length - 1].data) {
												data[data.length - 1].data[dd].left = pyl;
												beforDatas.data.push(data[data.length - 1].data[dd]);
											}
										}
										data[data.length - 1].show = false;
										docs[x].show = false;
									}
								}
								break;
							}
						}
						if (!data[data.length - 1].show && docs[x].show) {
							var pyl = 0; //便偏移量
							for (var y = data.length - 1; y >= 0; y--, pyl++) {
								var beforDatas = data[y]; //前一天的任务
								if (beforDatas.show) {
									docs[x].left = pyl;
									beforDatas.data.push(docs[x]);
									break;
								};
							}
						}
						_this.dateTag.set(res.year + "-" + res.moth + "-" + res.date, true);
						data[data.length - 1].data.push(docs[x]);
					}
					if (res.x == res.max) {
						//通知日历打标
						globalBus.$emit('aDate_tag', _this.dateTag);
						_this.onload = false;
					}
				});
			},
			changeShowType(type) {
				if (this.showType != type) {
					this.reloadTable();
				}
				this.showType = type;
				globalBus.$emit('aDate_getDateList', type);
			},
			loadTypes() {
				var _this = this;
				if (_this.onload) {
					return;
				}
				_this.onload = true;
				_this.typeListMap.clear();
				_this.typeListMap.set('未分类', []);
				_this.aplaneTypeDb = new nedb({
					filename: '/data/aplane-type.db',
					autoload: true
				});
				// 查询所有结果集
				_this.aplaneTypeDb.find({}, function(err, docs) {
					_this.onload = false;
					for (var x in docs) {
						_this.typeListMap.set(docs[x].name, []);
					}
					if (_this.showType) {
						_this.changeShowType(_this.showType);
					} else {
						_this.changeShowType('moth');
					}
				});
			}
		},
		mounted() {
			this.loadTypes();
			var _this = this;
			this.$nextTick(function() {
				var scrollFunc = function(e) {
					e = e || window.event;
					if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件
						if (e.wheelDelta > 0) { //当滑轮向上滚动时
							if (_this.tableScale > 1.5) {
								return;
							}
							_this.tableScale += 0.1;
						}
						if (e.wheelDelta < 0) { //当滑轮向下滚动时
							if (_this.tableScale < 0.6) {
								return;
							}
							_this.tableScale -= 0.1;
						}
					} else if (e.detail) { //Firefox滑轮事件
						if (e.detail > 0) { //当滑轮向上滚动时
							if (_this.tableScale > 1.5) {
								return;
							}
							_this.tableScale += 0.1;
						}
						if (e.detail < 0) { //当滑轮向下滚动时
							if (_this.tableScale < 0.6) {
								return;
							}
							_this.tableScale -= 0.1;
						}
					}
				};
				//给页面绑定滑轮滚动事件
				if (this.$refs.table.addEventListener) {
					this.$refs.table.onmousewheel = scrollFunc;
				}
				//滚动滑轮触发scrollFunc方法

			});
		}
	}
</script>

<style lang="scss">
	@keyframes toRightKF {
		0% {
			left: 0;
			width: 2rem;
		}

		50% {
			left: 0%;
			width: 4rem;
		}

		100% {
			left: 50%;
			width: 2rem;
		}
	}

	@keyframes toLeftKF {
		0% {
			left: 50%;
			width: 2rem;
		}

		50% {
			left: 0%;
			width: 4rem;
		}

		100% {
			left: 0;
			width: 2rem;
		}
	}

	.a-plane {
		height: 100%;
		box-sizing: border-box;
		display: flex;
		padding: 14px;
		flex-direction: column;

		.modal-report {
			transition: all 0.2s ease-in-out;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.3);

			.modal-report-div {
				width: 400px;
				height: 500px;
				background: #ffffff;
				margin: 100px auto;
				border-radius: 4px;
				padding: 8px 14px;
				display: flex;
				flex-direction: column;

				textarea {
					margin-top: 10px;
					width: 100%;
					flex: 1;
					border: none;
					outline: none;
					resize: none;
					color: #607D8B;
				}

				.modal-report-top {
					text-align: right;

					i {
						margin-left: 10px;
						cursor: pointer;
						color: #607D8B;
					}

					i:hover {
						color: #03A9F4;
					}

					.copy-text {
						transition: all 0.2s ease-in-out;
						font-size: 0.8rem;
						color: #7092a2;
						opacity: 0
					}
				}
			}
		}

		.bottom {
			width: 100%;
			flex: 1;
			padding-top: 4px;
			overflow: hidden;

			.work-item-type {
				padding: 10px;
			}

			.work-item.延期 {
				color: #e67e22;
				background: #f4e8ca;
				border-left: 3px #e67e22 solid;
			}

			.work-item.已完成 {
				background: #bef4de;
				color: #2ecc71;
				border-left: 3px #2ecc71 solid;
			}

			.work-item {
				display: inline-block;
				z-index: 9999999999999;
				margin: 10px 0;
				margin-right: 10px;
				width: calc(100% - 10px);
				box-sizing: border-box;
				background: #E1F5FE;
				color: #03A9F4;
				border-left: 3px #03A9F4 solid;
				border-top-right-radius: 10px;
				border-bottom-right-radius: 10px;
				padding: 14px;
				padding-left: 4px !important;
				cursor: pointer;
				transition: all 0.2s linear;
			}

			.work-item:hover {
				box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
			}

			table {
				transition: transform 0.2s linear;
				cursor: move;
				border: none;
				position: relative;
				display: block;
				border-collapse: collapse;
				transform-origin: center;
			}

			table th {
				padding: 10px !important;
			}

			table td,
			table th {
				width: 8rem;
				padding: 10px 0;
				color: #607D8B;
				text-align: left;
				border: 1px solid rgba(#ECEFF1, 0.6);
			}

		}

		.top {
			padding-bottom: 10px;
			border-bottom: 1px rgba(#ECEFF1, 0.6) solid;
			display: flex;
			color: #90A4AE;

			.tools {
				flex: 1;
				text-align: right;

				.item {
					display: inline-flex;
					line-height: 1rem;
					cursor: pointer;
					margin-left: 10px;
					transition: all 0.2s linear;

					div {
						font-size: 0.8rem;
						margin-left: 4px;
						transition: all 0.2s linear;
						display: inline-block;
						width: 0px;
						overflow: hidden;
						white-space: nowrap;
					}
				}

				.item:hover {
					color: #1E88E5;

					div {
						//width: 3.2rem;
					}
				}
			}

			.show-type {
				height: 1.4rem;
				display: flex;
				position: relative;

				.to-right {
					animation: toRightKF 0.5s;
					animation-fill-mode: forwards
				}

				.to-left {
					animation: toLeftKF 0.5s;
					animation-fill-mode: forwards
				}

				.bottom-tag {
					border-radius: 4px;
					height: 3px;
					width: 2rem;
					background: #1E88E5;
					position: absolute;
					bottom: -4px;
				}

				div {
					width: 2rem;
					cursor: pointer;
					text-align: center;
					line-height: 1.2rem;
					transition: all 0.1s linear;
				}

				div:hover {
					color: #1E88E5;
				}

				.active {
					font-weight: bold;
					font-size: 1.2rem;
					color: #1E88E5;
					width: 2rem;
					//  border-bottom: 3px #1E88E5 solid;
					padding-bottom: 4px;
				}
			}



		}
	}
</style>
