<template>
	<div class="email-main">
		<div style="margin: 0 auto;display: flex;">
			<div style="display: flex;width: 100px;padding-left: 40px;">
				<div style="font-size: 1.4rem;color: #7f8c8d;writing-mode: vertical-lr;">即将呈现</div>
				<div style="margin-left: 10px;writing-mode: vertical-lr;">定时发送周报，再也不用担心忘记发周报啦。邮件提醒，弹出通知...</div>
				<div style="margin-left: 10px;writing-mode: vertical-lr;">更多精彩敬请期待</div>
			</div>
			<div style="text-align: center;">
				<img src="../../../static/img/apps/email_index.png" style="margin: 0;padding: 0;max-height: 80%;max-width: 100%;" />
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'email',
		components: {},
		data() {
			return {}
		},
		watch: {},
		methods: {},
		created() {}
	}
</script>

<style lang="scss">
	.email-main {
		height: 100%;
		overflow: hidden;
		padding: 40px;
		box-sizing: border-box;

		* {
			color: #95a5a6;
		}
	}
</style>
