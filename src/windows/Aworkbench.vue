<template>
	<div class="a-workbench">
		<div class="top">
			<img src="../assets/logo.png" height="48px" />
			<span>今日好句：人生不是止水，总会出现许多出乎意料之事。泰山崩于前而色不变，风波骤起而泰然处之，就显得很重要。转危为安往往需要高超的心智，也需要好的心态。多思索少激动，多仁爱少仇恨，人生才变得更加美丽。</span>
		</div>
		<div class="center">
			<div class="change-type">
				<span class="text" :class="{'active':appType=='card'}" @click="setApptype('card')">卡片</span>
				<span class="text-line">|</span>
				<span class="text" :class="{'active':appType=='mini'}" @click="setApptype('mini')">图标</span>
			</div>
			<div class="apps" v-if="appType=='card'">
				<div class="item" v-for="(app,index) in apps" @click="openApp(app)">
					<div class="card">
						<div class="bg" :style="{'background-image': 'url('+getImgUrl(app.img)+')'}"></div>
						<div class="bottom-info">
							<span class="title">
								{{app.title}}
							</span>
							<div class="info">
								{{app.info}}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mini" v-if="appType=='mini'">
				<div class="item" v-for="(app,index) in apps" @click="openApp(app)" :title="app.info">
					<div class="card">
						<img class="icon" :src="app.icon" />
						<div class="bottom-info">
							<span class="title" :title="app.title" :style="{'font-size':app.title.length>6?'0.6rem':'1rem'}">
								{{app.title}}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="list-pop">

			</div>
		</div>
	</div>
</template>

<script>
	import {
		globalBus
	} from '@/assets/js/globalBus.js';
	import {
		apps
	} from '../common/Apps.js';
	export default {
		data() {
			return {
				apps: apps,
				appType: 'mini'
			}
		},
		methods: {
			setApptype(type){
				localStorage.setItem("appType",type);
				this.appType=type;
			},
			getImgUrl(url){
				if(url && url.trim()!=''){
					return url;
				}
				return './static/img/apps/empty_bg.png';
			},
			openApp(app) {
				globalBus.$emit('openApp', app);
			},
			loadApps() {
				var _this = this;

			}
		},
		mounted() {
			this.loadApps();
			this.appType=localStorage.getItem("appType");
			if(!this.appType){
				localStorage.setItem("appType","mini");
				this.appType="mini";
			}
		}
	}
</script>

<style lang="scss">
	.a-workbench {
		height: 100%;
		background: 100%;
		padding: 1rem;
		box-sizing: border-box;

		* {
			transition: all 0.1s linear;
		}

		.top {
			display: flex;
			height: 3rem;
			width: 100%;

			span {
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
				margin: 12px 20px;
				color: #636d6d;
				text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.2);
			}
		}

		.center {
			position: relative;
			flex: 1;
			height: 100%;
			overflow-y: auto;

			.change-type {
				position: absolute;
				color: #7f8c8d;

				.text-line {
					color: #bdc3c7;
					line-height: 1.2rem;
					transition: all 0.2s linear;
					transform: rotate(30deg);
					display: inline-block;
					width: auto;
				}

				.text {
					text-align: center;
					display: inline-block;
					width: 2.4rem;
					line-height: 1.2rem;
					cursor: pointer;
				}

				.text:hover,
				.text.active {
					font-size: 1.2rem;
					color: #2980b9;
				}

				.text.active {
					font-weight: bold;
				}
			}

			.change-type:hover {
				.text-line {
					transform: rotate(0deg);
				}
			}
		}

	}

	.a-workbench {
		display: flex;
		flex-direction: column;

		.mini {
			padding-top: 30px;
			display: table;
			margin: 0 auto;
			width: 70%;
			color: #34495e;

			.item {
				border-radius: 0.4rem;
				overflow: hidden;
				cursor: pointer;
				display: inline-block;
				height: auto !important;
				width: 8rem;
				padding: 10px;
				box-sizing: border-box;
				transition: all 0.2s cubic-bezier(1, -0.7, 0, 2);
				transition: all 0.1s ease-in-out;

				.card {
					box-sizing: border-box;
					padding: 10px;
					border: 1px transparent solid;
					text-align: center;
					position: relative;
					transition: all 0.1s ease;
					width: 100%;
					height: 100%;
					border-radius: 10px;

					.icon {
						width: 3rem;
						height: 3rem;
						border-radius: 2px;
					}

					.bottom-info {
						white-space: nowrap;
						overflow: hidden;
					}
				}

				.card:hover {
					background: rgba(184, 216, 215, 0.2);
					border: 1px #ecf0f1 solid;
				}
			}


		}

		.apps {
			padding-top: 30px;
			display: table;
			margin: 0 auto;
			width: 70%;

			.item {
				border-radius: 0.4rem;
				overflow: hidden;
				cursor: pointer;
				display: inline-block;
				height: 10rem;
				width: 25%;
				padding: 20px;
				box-sizing: border-box;
				// transition: all 0.2s cubic-bezier(1, -0.7, 0, 2);
				transition: all 0.1s ease-in-out;



				.card {
					box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
					position: relative;
					transition: all 0.1s ease;
					width: 100%;
					height: 100%;



					.bg {
						transition: all 0.2s ease-in-out;
						background-position: center center;
						background-repeat: no-repeat;
						background-size: cover;
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						height: 100%;
					}


					.bottom-info {
						transition: all 0.2s ease-in-out;
						background: rgba(0, 0, 0, 0.5);
						font-size: 0.8rem;
						line-height: 1.6rem;
						height: 1.8rem;
						text-align: center;
						position: absolute;
						width: 100%;
						bottom: 0;
						color: #FFFFFF;
						overflow: hidden;

						.info {
							padding: 1rem;
							box-sizing: border-box;
						}
					}
				}
			}

			.item:hover {
				border-radius: 0.4rem;
				padding: 10px;

				.card {
					box-shadow: 0 0 4px rgba(155, 209, 255, 0.5);
					border-radius: 0.4rem;

					.bg {
						-webkit-filter: blur(5px);
						-moz-filter: blur(5px);
						-ms-filter: blur(5px);
						-o-filter: blur(5px);
						filter: blur(5px);
						filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=4, MakeShadow=false);
					}

					.bottom-info {
						border-radius: 0.4rem;
						height: 100%;
						background: rgba(0, 0, 0, 0.5);

						.title {
							font-size: 1rem;
							line-height: 2rem;
						}
					}
				}
			}
		}
	}

	@media screen and (max-width: 1600px) {
		.a-workbench {
			.center {

				.apps {
					display: table;
					margin: 0 auto;
					width: 70%;

					.item {
						display: inline-block;
						height: 10rem;
						width: 33%;
					}
				}
			}
		}
	}

	@media screen and (max-width: 900px) {
		.a-workbench {
			.center {
				.apps {
					display: table;
					margin: 0 auto;
					width: 80%;

					.item {
						display: inline-block;
						height: 8rem;
						width: 50%;
					}
				}
			}
		}
	}
</style>
