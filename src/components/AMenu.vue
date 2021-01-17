<template>
	<div class="a-menu">
		<div class="menus-table">
			<div class="menus" :style="{'background':this.$store.state.theme.bfColor}">
				<div class="item home" @click="choiceMenuFun('/','/')">
					<img src="../assets/icon/menu/a-menu-home.png" :class="{'active':choiceMenu=='/'}" title="首页" />
				</div>
				<div class="active-app">
					<div class="item" @click="choiceMenuFun('/aReport','/aReport')" v-for="(app,index) in activeApps">
						<img :src="app.icon" :class="{'active':choiceMenu=='/aReport'}" :title="app.name" />
					</div>
				</div>
				<div class="item setting" @click="choiceMenuFun('/setting/theme','/setting/theme')">
					<img src="../assets/icon/menu/a-menu-setting.png" :class="{'active':choiceMenu=='/setting/theme'}" title="设置" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		globalBus
	} from '@/assets/js/globalBus.js';
	export default {
		components: {},
		data() {
			return {
				choiceMenu: 'home',
				activeApps: []
			}
		},
		created() {
			globalBus.$on('openApp', (app) => {
				for (var x in this.activeApps) {
					if (app.url == this.activeApps[x].url) {
						this.choiceMenu = app.url
						this.$router.push(app.url).catch(err => {
							err
						})
						return
					}
				}
				if (app.type == "app") {
					this.activeApps.push(app);
					this.choiceMenu = app.url
					this.$router.push(app.url).catch(err => {
						err
					})
				}
			});
		},
		methods: {
			choiceMenuFun(menu, url) {
				this.choiceMenu = menu;
				this.$router.push(url).catch(err => {
					err
				})
			},
			addActiveApp(app) {

			}
		},
		mounted() {
			this.choiceMenu = this.$route.path
		}
	}
</script>

<style lang="scss">
	.a-menu {
		height: 100%;
		display: table;

		.menus-table {
			display: table-cell;
			vertical-align: middle;

			.menus {
				height: 100%;
				width: 1.8rem;
				position: relative;
				display: flex;
				flex-direction: column;
				transition: all 0.2s ease-in-out;
				padding: 20px 10px;
				margin-left: auto;
				margin-right: auto;
				border-radius: 10px;
				background: #FFFFFF;
				box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);

				.active-app {
					margin-top: 10px;
					border-top: 2px #c6c6c6 solid;
					padding: 10px 0;
					flex: 1;
				}

				.home {
					/* position: absolute;
          top: 0.8rem; */
				}

				.setting {
					/* position: absolute;
          bottom: 0.2rem; */
				}

				.item {
					height: 2.4rem;

					img {
						cursor: pointer;
						transition: all 0.1s linear;
						border-radius: 4px;
						height: auto;
						margin-left: 0.2rem;
						margin-top: 0.5rem;
						width: 1.4rem;
						-webkit-filter: grayscale(100%);
						-moz-filter: grayscale(100%);
						-ms-filter: grayscale(100%);
						-o-filter: grayscale(100%);
						filter: grayscale(100%);
						filter: gray;
					}

					.active,
					img:hover {
						margin-left: 0;
						margin-top: 0.3rem;
						width: 1.8rem;
						-webkit-filter: grayscale(0%);
						-moz-filter: grayscale(0%);
						-ms-filter: grayscale(0%);
						-o-filter: grayscale(0%);
						filter: grayscale(0%);
						filter: none;
					}
				}
			}

			.menus:hover {
				box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
			}
		}
	}
</style>
