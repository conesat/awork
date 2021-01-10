<template>
	<div class="a-workbench">
		<div class="left">

		</div>
		<div class="right">
			<div class="top"></div>
			<div class="center">
				<div class="apps">
					<div class="item" v-for="(app,index) in apps">
						<div class="card">
							<div class="bottom-title">标题</div>
						</div>
					</div>
				</div>
				<div class="list-pop">

				</div>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				apps:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			}
		},
		methods: {

		},
		mounted() {

		}
	}
</script>

<style lang="scss">
	.a-workbench {
		height: 100%;
		background: 100%;
		display: flex;
		background-color: #06091d;
		background-image: linear-gradient(#06091d, #040a1d);
		padding: 3rem;
		box-sizing: border-box;

		.right {
			padding: 2rem;
			flex: 1;
			display: flex;
			flex-direction: column;

			.top {
				height: 3rem;
				width: 100%;
				background-color: #9E9E9E;
			}

			.center {
				flex: 1;
				height: 100%;
				overflow-y: auto;
				
			}
		}

		.left {
			background: #9E9E9E;
			width: 3rem;
		}
	}

	.a-workbench {
		.apps {
			display: table;
			margin: 0 auto;
			width: 70%;

			.item {
				cursor: pointer;
				display: inline-block;
				height: 10rem;
				width: 25%;
				padding: 16px;
				box-sizing: border-box;
				transition: all 0.2s cubic-bezier(1,-0.7,0,2);
				
				.card{
					position: relative;
					transition: all 0.1s ease;
					background: #EDEDED;
					width: 100%;
					height: 100%;
					.bottom-title{
						transition: all 0.2s linear;
						background: rgba(0,0,0,0.2);
						font-size: 0.8rem;
						line-height: 1.6rem;
						text-align: center;
						position: absolute;
						width: 100%;
						bottom: 0;
					}
				}
			}
			.item:hover {
				box-shadow: 0 0 20px rgba(155, 209, 255, 0.5);
				border-radius: 0.4rem;
				padding: 0;
				.card{
					border-radius: 0.4rem;
					.bottom-title{
						background: rgba(0,0,0,0.2);
						font-size: 1rem;
						line-height: 2rem;
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
