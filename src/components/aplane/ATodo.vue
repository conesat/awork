<!-- 待完成 -->
<template>
	<div class="a-todo" :style="{'background':this.$store.state.theme.bfColor}">
		<div class="list" :style="{'width':showAdd||showAddText?'0':'100%'}">
			<div style="width: 252px;height: 100%;">
				<div style="width: 100%;display: flex;flex-direction: column;height: 100%;overflow: hidden;">
					<div class="title" style="position: relative;">
						<span class="fa fa-plus" title="新建任务" @click="add()"></span>
						<span class="fa fa-edit" title="新建任务" @click="addText()"></span>
						代办事项
					</div>
					<div class="list">
						<div v-if="list.length==0" class="no-todo">
							暂无任务，<span @click.stop="add()">新建一个</span> 吧
						</div>
						<div class="item" :class="{'on-edit':editIndex==index}" v-for="(item,index) in list" @contextmenu.prevent="showRightMenu($event,index)">
							<span class="item-title" :title="item.title" @click="edit(index)" :style="{'font-size':item.title.length>8?'0.8rem':'1rem'}">{{item.title}}</span>
							<span v-if="item.status!='已完成'" class="fa fa-check" title="完成任务" @click="finishWork(index,true)"></span>
							<span v-if="item.status=='已完成'" class="fa fa-repeat" title="重置任务" @click="finishWork(index,false)"></span>
							<span class="fa fa-trash" title="删除任务" @click="remove(index)"></span>
						</div>
					</div>
					<div class="vpopmenu" v-if="rightMenuStyle.show" :style="{left:rightMenuStyle.left+'px',top:rightMenuStyle.top+'px'}">
						<div @click="edit(editIndex);">
							<i class="fa fa-pencil"></i>
							编辑
						</div>
						<!-- <div @click.stop="top(editIndex);">
              <i class="fa fa-arrow-up"></i>
              置顶
            </div> -->
						<!-- <div @click.stop="finish(editIndex);" >
              <i class="fa fa-check"></i>
              完成
            </div> -->
						<div @click="nextTodo(editIndex);" title="添加到明天任务清单">
							<i class="fa fa-calendar-plus-o"></i>
							预排
						</div>
						<div @click="toNextDay(editIndex);" title="顺延至下一天">
							<i class="fa fa-flag-o"></i>
							延期
						</div>
						<!-- <div class="delete" @click.stop="remove(editIndex);">
              <i class="fa fa-trash"></i>
              删除
            </div> -->
					</div>
				</div>
			</div>
		</div>
		<div class="add-pane" :style="{'width':showAdd?'100%':'0'}">
			<div style="width: 252px;display: flex;flex-direction: column;height: 100%;">
				<div class="title" style="position: relative;">
					<span class="fa fa-arrow-left" title="" @click="closeAdd()"></span>
					新建任务
					<span class="fa fa-check" title="添加" @click="addWork()"></span>
				</div>
				<div style="flex: 1;overflow-y: auto;">
					<input v-model="addWorkForm.title" placeholder="请输入标题,最多20字" class="input-title" maxlength="20" />
					<div class="select-type">
						<div class="input-div" @click.stop="showTypeSelectFun">
							<span class="text" v-if="addWorkForm.type==''">请选择分类</span>
							<span class="text" v-if="addWorkForm.type!=''" v-html="addWorkForm.type"></span>
							<span class="fa fa-angle-down"></span>
						</div>
						<div class="type-select" v-show="showTypeSelect">
							<div class="items">
								<div class="item" v-for="(type,index) in typeList">
									<span @click="selectWorkType(type)">{{type.name}}</span>
									<span class="fa fa-trash delete" title="删除" @click.stop="removeWorkType(type)"></span>
								</div>
							</div>
							<div class="add-bottom" @click.stop="addWorkType()">新建分类</div>
						</div>
					</div>
					<textarea v-model="addWorkForm.detail" placeholder="请输入内容,最多1000字,必填" maxlength="1000" />
					</div>
      </div>
    </div>
    <div class="add-pane-text" :style="{'width':showAddText?'100%':'0'}">
      <div style="width: 252px;display: flex;flex-direction: column;height: 100%;">
        <div class="title" style="position: relative;">
          <span class="fa fa-arrow-left" title="" @click="closeAdd()"></span>
          批量新建
          <span class="fa fa-check" title="添加" @click="addWorkText()"></span>
        </div>
        <div style="flex: 1;overflow-y: auto;height: 100%;position: relative;">
          <textarea v-model="addWorkForm.planeText" maxlength="1000"></textarea>
					<div v-if="!addWorkForm.planeText" class="textarea-bg">【任务类型】<br>1.任务标题<br>任务内容（选填）<br><br>2.任务标题<br>任务内容（选填）<br><br>【任务类型】<br>1.任务标题<br>任务内容（选填）<br></div>
				</div>
			</div>
		</div>
		<script type="text/html" id="swalHtml">
			<div style="display: flex;width: 20rem;margin: 3rem auto;padding: 14px;background: #FFFFFF;box-sizing: border-box;border-radius: 4px;box-shadow: 0 0 4px #B3E5FC;">
       <input style="color: #607D8B;flex: 1;outline: none;border: none;font-size: 1rem;" placeholder="请输入类型"/>
       <span class="sweetalert2-add">添加</span>
     </div>
   </script>
	</div>
</template>

<script>
	// 加载模块
	var ipcRenderer;
	if (window.require) {
		ipcRenderer = window.require('electron').ipcRenderer;
	}
	const nedb = require('nedb');
	const aplaneTypeDb = new nedb({
		filename: '/data/aplane-type.db',
		autoload: true
	});
	import {
		globalBus
	} from '@/assets/js/globalBus.js';
	import Swal from 'sweetalert2'
	export default {
		name: 'ATodo',
		components: {},
		data() {
			return {
				//任务数据库
				aplaneTodoDb: undefined,
				typeList: [],
				list: [],
				editIndex: -1,
				rightMenuStyle: {
					top: 0,
					left: 0,
					show: false,
				},
				showAddText: false,
				showAdd: false,
				showAddType: false,
				addWorkForm: {
					index: '',
					_id: '',
					title: '',
					detail: '',
					status: '',
					type: '',
					planeText: ''
				},
				showTypeSelect: false,
				//当前加载的数据库
				loadDate: {
					year: '',
					moth: '',
					date: '',
					week: ''
				}
			}
		},
		created() {
			var _this = this;
			//获取日期后回调这里
			globalBus.$on('aDate_changeDateBack', (date) => {
				_this.loadTodo(date);
			});
		},
		methods: {
			//完成任务
			finishWork(index, finish) {
				var _this = this;
				var data = this.list[index];
				if (finish) {
					data.status = '已完成';
				} else {
					data.status = '进行中';
				}
				var finishTag = 0;
				var finishFun = function() {
					finishTag++;
					if (finishTag == 2) {
						//_this.list.splice(index, 1, data)
						_this.refreshMini(data)
						globalBus.$emit('aPlane_reload', (date) => {});
					}
				}
				_this.updateBeforeAndNext(data, 'before', finishFun);
				var nextDate = new Date(data.year, data.moth, data.date);
				nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
				_this.updateBeforeAndNext({
					year: nextDate.getFullYear(),
					moth: nextDate.getMonth(),
					date: nextDate.getDate(),
					title: data.title,
					status: data.status,
				}, 'after', finishFun);


				/* 
				_this.aplaneTodoDb.find({
					_id: data._id
				}, function(err, docs) {
					if (docs.length == 1) {
						
					} else {
						Swal.fire({
							title: `操作失败`,
							icon: 'error'
						})
					}
				}) */
			},
			//如果这是一个延期工作 更新时候全部更新
			updateBeforeAndNext(data, to, callBack) {
				var _this = this;
				var db;
				if (_this.loadDate.year != data.year || _this.loadDate.moth != data.moth) {
					db = new nedb({
						filename: '/data/aplane-todo_' + data.year + '-' + data.moth + '.db',
						autoload: true
					});
				} else {
					db = _this.aplaneTodoDb;
				}
				db.find({
					year: data.year,
					moth: data.moth,
					date: data.date,
					title: data.title,
				}, (err, docs) => {
					if (docs.length > 0) {
						docs[0].status = data.status;
						_this.aplaneTodoDb.update({
							_id: docs[0]._id
						}, docs[0], {}, (err, ret) => {
							var nextDate = new Date(data.year, data.moth, data.date);
							if (to == 'before') {
								nextDate = new Date(nextDate.setDate(nextDate.getDate() - 1));
							} else if (to == 'after') {
								nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
							}
							_this.updateBeforeAndNext({
								year: nextDate.getFullYear(),
								moth: nextDate.getMonth(),
								date: nextDate.getDate(),
								title: data.title,
								status: data.status,
							}, to, callBack);
						});
					} else {
						callBack();
					}
				});
			},
			addWorkText() {
				if (!this.addWorkForm.planeText) {
					alert("请输入内容");
				}
				var text = this.addWorkForm.planeText.trim();
				var texts = text.split("\n\n");
				var type = "";
				var _this = this;
				for (var x in texts) {
					var planeInfo = texts[x].split("\n");
					var titleIndex = 0;
					var title, deatil;
					var okNum = 0;
					if ((planeInfo[0].charAt(0) == '【' || planeInfo[0].charAt(0) == '[') &&
						planeInfo[0].charAt(planeInfo[0].length - 1) == '】' || planeInfo[0].charAt(planeInfo[0].length - 1) == ']') {
						type = planeInfo[0].substring(1, planeInfo[0].length - 1);
						titleIndex = 1;
					}
					title = planeInfo[titleIndex];
					deatil = planeInfo[titleIndex + 1];
					var reg = /^(\d{1,2})+[.,、。， ]+/g;
					title = title.replace(reg, '').trim();
					if (type) {
						aplaneTypeDb.find({
							name: type
						}, function(err, docs) {
							if (docs.length == 0) {
								aplaneTypeDb.insert({
									name: type
								}, (err, ret) => {});
							}
						});
					}
					(function(x) {
						_this.insertWork({
							title: title,
							detail: deatil,
							status: '进行中',
							type: type,
							year: _this.loadDate.year,
							moth: _this.loadDate.moth,
							date: _this.loadDate.date,
						}, (err, ret) => {
							if (err) {
								okNum++;
								_this.list.push(ret)
							}
							if (x == texts.length - 1) {
								Swal.fire({
									title: `成功添加` + okNum + `个任务` + (okNum == texts.length ? '' : ",失败" + (texts.length - okNum) +
										"个"),
									icon: okNum == texts.length ? 'success' : 'error'
								})
								_this.closeAdd();
							}
						});
					})(x)
				}
			},
			addNextTodoAfter(data, date, type) {
				var _this = this;
				var db;
				if (_this.loadDate.year != date.getFullYear() || _this.loadDate.moth != date.getMonth()) {
					db = new nedb({
						filename: '/data/aplane-todo_' + date.getFullYear() + '-' + date.getMonth() + '.db',
						autoload: true
					});
				} else {
					db = _this.aplaneTodoDb;
				}
				if (type == '预排') {
					_this.aplaneTodoDb.find({
						year: date.getFullYear(),
						moth: date.getMonth(),
						date: date.getDate(),
						title: data.title,
					}, function(err, docs) {
						if (docs.length == 0) {
							var newItem = docs[0];
							newItem.status = '进行中'
							newItem.year = date.getFullYear();
							newItem.moth = date.getMonth();
							newItem.date = date.getDate();
							db.update({
								_id: data._id
							}, newItem, {}, (err, ret) => {
								_this.list.splice(_this.addWorkForm.index, 1, newItem)
								_this.refreshMini(newItem)
								globalBus.$emit('aPlane_reload', (date) => {});
							});
						} else {
							Swal.fire({
								title: `任务重复`,
								icon: 'error'
							})
						}
					})
				} else if (type == '延期') {
					var _this = this;
					db.find({
						year: date.getFullYear(),
						moth: date.getMonth(),
						date: date.getDate(),
						title: data.title,
					}, function(err, docs) {
						if (docs.length == 0) {
							db.insert({
								year: date.getFullYear(),
								moth: date.getMonth(),
								date: date.getDate(),
								title: data.title,
								detail: data.detail,
								status: '进行中',
								tag: '延期',
								type: data.type,
							}, (err, docs) => {
								data.status = '进行中 '
								data.tag = '延期'
								_this.aplaneTodoDb.update({
									_id: data._id
								}, data, {}, (err, ret) => {
									Swal.fire({
										title: `已延期`,
										icon: 'success'
									})
									_this.refreshMini(data)
									globalBus.$emit('aPlane_reload', (date) => {});
								});
							});
						} else {
							Swal.fire({
								title: `任务已存在`,
								icon: 'error'
							})
						}
					});

				}
			},
			addNextTodo(nextDate, data, type) {
				var _this = this;
				var week = nextDate.getDay();
				if (week == 0 || week == 6) {
					Swal.fire({
						title: '明天是周末哦，继续添加吗?',
						showDenyButton: true,
						showCancelButton: true,
						showConfirmButton: true,
						denyButtonText: `添加`,
						confirmButtonText: `顺延下个工作日`,
						cancelButtonText: `取消`,
					}).then((result) => {
						var insert = false;
						if (result.isConfirmed) {
							if (week == 6) {
								nextDate = new Date(nextDate.setDate(nextDate.getDate() + 2));
							} else if (week == 0) {
								nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
							}
							insert = true;
						} else if (result.isDenied) {
							insert = true;
						}
						if (!insert) {
							return
						}
						_this.addNextTodoAfter(data, nextDate, type);
					})
				} else {
					_this.addNextTodoAfter(data, nextDate, type);
				}
			},
			//预排 安排到明天
			nextTodo(index) {
				var curTime = new Date();
				var nextDate = new Date(curTime.setDate(curTime.getDate() + 1));
				this.addNextTodo(nextDate, this.list[index], '预排');
			},
			//延期
			toNextDay(index) {
				var curTime = new Date(this.loadDate.year, this.loadDate.moth, this.loadDate.date);
				var nextDate = new Date(curTime.setDate(curTime.getDate() + 1));
				this.addNextTodo(nextDate, this.list[index], '延期');
			},
			remove(index) {
				var _this = this;
				Swal.fire({
					title: '确认删除"' + this.list[index].title + '"吗?',
					showDenyButton: true,
					showCancelButton: true,
					showConfirmButton: false,
					denyButtonText: `确认`,
					cancelButtonText: `取消`,
				}).then((result) => {
					if (result.isDenied) {
						// 删除
						_this.aplaneTodoDb.remove({
							_id: this.list[index]._id
						}, {}, function(err, numRemoved) {
							_this.refreshMini(_this.list[index])
							_this.list.splice(index, 1);
							globalBus.$emit('aPlane_reload', (date) => {});
						});
					}
				})
			},
			addText() {
				this.showAddText = true;
			},
			add() {
				this.showAdd = true;
			},
			selectWorkType(type) {
				this.addWorkForm.type = type.name;
			},
			showTypeSelectFun() {
				this.showTypeSelect = !this.showTypeSelect;
			},
			removeWorkType(type) {
				var _this = this;
				Swal.fire({
					title: '确认删除"' + type.name + '"吗?',
					showDenyButton: true,
					showCancelButton: true,
					showConfirmButton: false,
					denyButtonText: `确认`,
					cancelButtonText: `取消`,
				}).then((result) => {
					if (result.isDenied) {
						aplaneTypeDb.remove({
							_id: type._id
						}, {}, function(err, numRemoved) {
							_this.loadTypes();
							globalBus.$emit('aPlane_reload', (date) => {});
						});
						if (type.name == _this.addWorkForm.type) {
							_this.addWorkForm.type = '';
						}
					}
				})
			},
			saveWorkType(name) {
				var _this = this;
				aplaneTypeDb.find({
					name: name
				}, function(err, docs) {
					if (docs.length == 0) {
						// 插入单项
						aplaneTypeDb.insert({
							name: name
						}, (err, ret) => {
							if (ret) {
								Swal.fire({
									title: `已添加`,
									icon: 'success'
								})
								globalBus.$emit('aPlane_reload', (date) => {});
								_this.loadTypes();
							} else {
								Swal.fire({
									title: `添加失败`,
									icon: 'error'
								})
							}
						});
					} else {
						Swal.fire({
							title: `该类型已存在`,
							icon: 'error'
						})
					}
				});
			},
			addWorkType() {
				Swal.fire({
					input: 'text',
					inputPlaceholder: '请输入类型',
					inputAttributes: {
						autocapitalize: 'off'
					},
					showCancelButton: false,
					confirmButtonText: '添加',
					showLoaderOnConfirm: true,
				}).then((result) => {
					if (result.isConfirmed && result.value) {
						this.saveWorkType(result.value);
					}
				})
			},
			addWork() {
				var _this = this;
				if (!this.addWorkForm.title) {
					alert("标题不能为空！")
				} else {
					this.addWorkForm.title = this.addWorkForm.title.trim();
					this.addWorkForm.detail = this.addWorkForm.detail ? this.addWorkForm.detail.trim() : "";
					if (!this.addWorkForm._id) {
						_this.insertWork({
							title: _this.addWorkForm.title,
							detail: _this.addWorkForm.detail,
							status: '进行中',
							type: _this.addWorkForm.type,
							year: _this.loadDate.year,
							moth: _this.loadDate.moth,
							date: _this.loadDate.date,
						}, (err, ret) => {
							if (err) {
								_this.list.push(ret)
								_this.closeAdd();
							} else {
								Swal.fire({
									title: `任务已存在`,
									icon: 'error'
								})
							}
						});
					} else {
						var newItem = {
							_id: this.addWorkForm._id,
							title: _this.addWorkForm.title,
							detail: _this.addWorkForm.detail,
							status: '进行中',
							type: _this.addWorkForm.type,
							year: _this.loadDate.year,
							moth: _this.loadDate.moth,
							date: _this.loadDate.date,
						}
						_this.aplaneTodoDb.find({
							year: newItem.year,
							moth: newItem.moth,
							date: newItem.date,
							title: newItem.title,
						}, function(err, docs) {
							if (docs.length == 0 || (docs.length == 1 && newItem._id == docs[0]._id)) {
								_this.aplaneTodoDb.update({
									_id: _this.addWorkForm._id
								}, newItem, {}, (err, ret) => {
									_this.list.splice(_this.addWorkForm.index, 1, newItem)
									_this.closeAdd();
									_this.refreshMini(newItem)
								});
							} else {
								Swal.fire({
									title: `任务已存在`,
									icon: 'error'
								})
							}
						})
					}
					globalBus.$emit('aPlane_reload', (date) => {});
				}
			},
			refreshMini(date) {
				if (!ipcRenderer) {
					return;
				}
				var curTime = new Date();
				if (curTime.getFullYear() == date.year &&
					curTime.getMonth() == date.moth &&
					curTime.getDate() == date.date) {
					ipcRenderer.send('mini-plane-refresh');
				}
			},
			insertWork(data, callBack) {
				var _this = this;
				_this.aplaneTodoDb.find({
					year: data.year,
					moth: data.moth,
					date: data.date,
					title: data.title,
				}, function(err, docs) {
					if (docs.length == 0) {
						_this.aplaneTodoDb.insert({
							year: data.year,
							moth: data.moth,
							date: data.date,
							title: data.title,
							detail: data.detail,
							status: '进行中',
							type: data.type,
						}, (err, docs) => {
							_this.refreshMini(data)
							callBack(true, docs);
							globalBus.$emit('aPlane_reload', (date) => {});
						});
					} else {
						callBack(false, docs);
					}
				});
			},
			closeAdd() {
				this.showAddText = false;
				this.showAdd = false;
				this.addWorkForm.index = '';
				this.addWorkForm._id = '';
				this.addWorkForm.title = '';
				this.addWorkForm.detail = '';
				this.addWorkForm.type = '';
			},
			edit(index) {
				this.addWorkForm = {
					index: index,
					_id: this.list[index]._id,
					title: this.list[index].title,
					detail: this.list[index].detail,
					status: this.list[index].status,
					type: this.list[index].type
				};
				this.showAdd = true;
			},
			showRightMenu(e, index) {
				this.editIndex = index;
				this.rightMenuStyle.left = e.x;
				this.rightMenuStyle.top = e.y;
				if (e.y + 130 > e.view.innerHeight) {
					this.rightMenuStyle.top = e.view.innerHeight - 130;
				}
				this.rightMenuStyle.show = true
			},
			clickOther(e) {
				if (e.srcElement.className.indexOf("swal2") != -1) {
					return;
				}
				this.showAddType = false;
				this.rightMenuStyle.show = false;
				this.editIndex = -1;
				this.showTypeSelect = false;
			},
			loadTypes() {
				var _this = this;
				// 查询所有结果集
				aplaneTypeDb.find({}, function(err, docs) {
					_this.typeList = docs;
					if (docs.length == 0) {
						_this.addWorkForm.type = '';
					}
				});
			},
			//加载任务  一个月一个库
			loadTodo(date) {
				var _this = this;
				if (_this.loadDate.year + "-" + _this.loadDate.moth != date.year + "-" + date.moth) {
					_this.aplaneTodoDb = new nedb({
						filename: '/data/aplane-todo_' + date.year + '-' + date.moth + '.db',
						autoload: true
					});
				}
				_this.loadDate = date;
				// 查询所有结果集
				_this.aplaneTodoDb.find({
					year: _this.loadDate.year,
					moth: _this.loadDate.moth,
					date: _this.loadDate.date
				}, function(err, docs) {
					_this.list = docs.sort(function(a, b) {
						var x = b.status == '进行中' ? 0 : 1;
						var y = a.status == '进行中' ? 0 : 1;
						return y - x;
					})
				});
			}
		},
		mounted() {
			var _this = this;
			window.addEventListener("click", this.clickOther);
			this.loadTypes();
			if (ipcRenderer) {
				//监听窗口变化
				ipcRenderer.on('main-plane-refresh-call', (event, data) => {
					var curTime = new Date();
					if (curTime.getFullYear() == _this.loadDate.year &&
						curTime.getMonth() == _this.loadDate.moth) {
						_this.aplaneTodoDb = new nedb({
							filename: '/data/aplane-todo_' + _this.loadDate.year + '-' + _this.loadDate.moth + '.db',
							autoload: true
						});
						_this.loadTodo(_this.loadDate)
						globalBus.$emit('aPlane_reload', (date) => {});
					}
				});
			}
		},
		beforeDestroy() { // 实例销毁之前对点击事件进行解绑
			window.removeEventListener('click', this.clickOther);
		}
	}
</script>

<style lang="scss" scoped>
	.a-todo {
		* {
			transition: all 0.2s linear;
		}

		position: relative;
		transition: all 0.1s linear;
		overflow: hidden;
		display: flex;
		height: 100%;
		background-color: #FFFFFF;
		width: 100%;
		border-radius: 6px;
		box-sizing: border-box;
		padding: 0.625rem;

		.sweetalert2-add {
			cursor: pointer;
			white-space: nowrap;
			color: #78909C;
			transition: all 0.1s linear;
		}

		.sweetalert2-add:hover {
			color: #0288D1;
		}

		.add-pane-text {
			overflow: hidden;
			transition: all 0.2s linear;
			width: 0;
			padding: 10px 0;

			.textarea-bg {
				overflow: hidden;
				color: #969696;
				font-size: 0.9rem;
				position: absolute;
				left: 0;
				top: 0;
				height: calc(100% - 10px);
				width: 100%;
				padding: 10px 4px;
				box-sizing: border-box;
			}

			textarea {
				position: absolute;
				left: 0;
				top: 0;
				z-index: 99;
				height: calc(100% - 10px);
				width: 100%;
				margin: 0px;
				box-sizing: border-box;
				resize: vertical;
				background: transparent;
				padding: 10px 4px;
				font-family: auto;
				color: #546E7A;
				transition: all 0.3s linear;
				box-sizing: border-box;
				border: none;
				outline: none;
				border-bottom: 1px #CFD8DC solid;
			}

			textarea:focus+.textarea-bg {
				display: none;
			}
		}

		.add-pane {
			overflow: hidden;
			transition: all 0.2s linear;
			width: 0;
			padding: 10px 0;

			.select-type {
				display: flex;
				position: relative;

				.input-div {
					cursor: pointer;
					font-size: 0.9rem;
					padding: 10px 0;
					color: #546E7A;
					transition: all 0.3s linear;
					box-sizing: border-box;
					width: 100%;
					border-bottom: 1px #CFD8DC solid;
					display: flex;

					.text {
						padding: 0 4px;
						flex: 1;
					}

					span {
						line-height: 1.2rem;
					}
				}

				.type-select {
					font-size: 0.8rem;
					display: flex;
					flex-direction: column;
					position: absolute;
					width: 100%;
					max-height: 200px;
					margin-bottom: 10px;
					background: #fff;
					top: 44px;
					box-shadow: 0 2px 4px #6c6c6c;
					border-radius: 2px;
					width: calc(100% - 4px);
					left: 2px;

					.items {
						flex: 1;
						overflow-y: auto;

						.item {
							position: relative;
							cursor: pointer;
							height: 1.8rem;
							text-align: center;

							span {
								padding: 0.1rem;
								display: block;
								transition: all 0.1s linear;
								color: #90A4AE;
								line-height: 1.6rem;
							}

							.delete {
								top: 0;
								position: absolute;
								right: 10px;
								background: none !important;
							}
						}

						.item:hover {
							span {
								font-size: 1.2rem;
								background: #ecf0f1;
								color: #34495e;
							}

							.delete:hover {
								color: #e74c3c;
							}
						}
					}

					.add-bottom {
						background: #f5f8f9;
						cursor: pointer;
						display: block;
						color: #7f8c8d;
						text-align: center;
						padding: 10px 0;
					}

					.add-bottom:hover {
						background: #ecf0f1;
						color: #34495e;
					}

				}

				.fa-plus {

					cursor: pointer;
					line-height: 2.4rem;
					width: 3rem;
					text-align: center;
					color: #90A4AE;
				}

				.fa-plus:hover {
					color: #29B6F6;
				}
			}

			.add-bottom {
				width: 100%;
				text-align: right;
				display: flex;
			}

			.title {
				margin-bottom: 10px;
			}

			input,
			textarea,
			select {
				background: transparent;
				padding: 10px 4px;
				font-family: auto;
				color: #546E7A;
				transition: all 0.3s linear;
				box-sizing: border-box;
				margin: 0;
				width: 100%;
				border: none;
				outline: none;
				border-bottom: 1px #CFD8DC solid;
			}

			select {
				line-height: 2rem;
			}

			textarea {
				margin-top: 20px;
				min-height: 3rem;
				max-height: 8rem;
				resize: vertical;
			}

			input:focus,
			textarea:focus,
			select:focus {
				border-bottom: 1px #29B6F6 solid;
			}
		}


		.vpopmenu {
			position: fixed;
			background: #FFFFFF;
			padding: 10px;
			border-radius: 4px;
			box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
			transition: display 0.3s linear;

			.fa {
				width: 1.2rem;
			}

			div {
				transition: all 0.2s linear;
				margin: 4px 0;
				cursor: pointer;
				color: #69849B;
			}

			div:hover {
				color: #29B6F6;
			}

			.delete:hover {
				color: #F4511E;
			}
		}

		.title {
			line-height: 2rem;
			text-align: center;
			color: #69849B;
			border-bottom: 1px #a0b2c1 solid;

			.fa-plus,
			.fa-arrow-left,
			.fa-edit {
				position: absolute;
				left: 8px;
				top: 8px;
				cursor: pointer;
				transition: all 0.1s linear;
			}

			.fa-edit {
				left: 2rem;
			}

			.fa-check {
				color: #2E7D32;
				position: absolute;
				right: 8px;
				top: 8px;
				cursor: pointer;
				transition: all 0.1s linear;
			}

			.fa-plus:hover,
			.fa-arrow-left:hover,
			.fa-check:hover,
			.fa-edit:hover {
				color: #29B6F6;
			}

			.fa-check:hover {
				color: #43A047;
			}
		}

		img {
			height: 0.8rem;
			width: 0.8rem;
			margin-right: 5px;
		}

		.list {
			transition: all 0.2s linear;
			width: 100%;
			overflow-y: auto;
			padding: 10px 0;

			.no-todo {
				color: #76838F;
				text-align: center;
				margin: 20px 0;

				span {
					color: #1565C0;
					cursor: pointer;
					transition: all 0.3s linear;
				}

				span:hover {
					color: #2196F3;
				}
			}

			.item {
				display: flex;
				color: #98aab8;
				cursor: pointer;
				padding: 0px 10px;
				transition: all 0.3s linear;

				.item-title {
					flex: 1;
					white-space: nowrap;
					/* 规定文本是否折行 */
					overflow: hidden;
					/* 规定超出内容宽度的元素隐藏 */
					text-overflow: ellipsis;
				}

				span {
					line-height: 2rem;
				}



				.fa-trash,
				.fa-check {
					text-align: right;
					width: 1.8rem;
				}

				.fa {
					transition: display 3s linear;
					transition: color 0.2s linear;
					transition: font-size 0.1s linear;
				}

				.fa:hover {
					font-size: 1.4rem;
					color: #00897B;
				}

				.fa-trash:hover {
					font-size: 1.4rem;
					color: #F4511E;
				}
			}

			.on-edit {
				color: #5D85A8;
				border-radius: 4px;
				background: #ECEFF1;
			}

			.item:hover {
				color: #5D85A8;
				border-radius: 4px;
				background: #ECEFF1;
			}
		}
	}
</style>
