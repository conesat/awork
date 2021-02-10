<template>
	<div class="enc-main">
		<div class="enc-main-left">
			<div class="enc-main-top">
				<div class="item" :class="{'active':item.active}" v-for="(item,index) in items" :index="index" @click="choiceItem(index)">
					<select v-model="item.title">
						<option value="md5">md5</option>
						<option value="rsa">rsa</option>
						<option value="aes">aes</option>
					</select>
					<i class="fa fa-close" @click.stop="closeItem(index)"></i>
				</div>
				<div class="item add" @click="addItem()">
					<i class="fa fa-plus"></i>
				</div>
			</div>
			<div class="detail" v-if="items[itemIndex].title=='md5'">
				<div class="top">
					<div class="line btns">
						<label style="display: block;color:#34495e;margin-right: 10px;">文本:</label>
						<input placeholder="粘贴需要转换的文本" v-model="items[itemIndex].before" />
					</div>
					<div class="line btns">
						<div class="btn" @click="md5Encrypt()">加密</div>
					</div>
				</div>
				<div class="bottom">
					<label style="display: block;color:#34495e ;">结果:</label>
					<textarea placeholder="请在上方粘贴文本" v-model="items[itemIndex].after"></textarea>
				</div>
			</div>

			<div class="detail" v-if="items[itemIndex].title=='aes'">
				<div class="top">
					<div class="line">
						<label style="color:#34495e;margin-right: 10px;">秘钥:</label>
						<input placeholder="请输入秘钥" v-model="items[itemIndex].aesKey" />
					</div>
					<div class="line">
						<label style="color:#34495e;margin-right: 10px">文本:</label>
						<input placeholder="粘贴需要处理的文本" v-model="items[itemIndex].before" />
					</div>
					<div class="line btns">
						<div class="btn" @click="generatekey()">随机秘钥</div>
						<div class="btn" @click="aesEncrypt()">加密</div>
						<div class="btn" @click="aesDecrypt()">解密</div>
					</div>
				</div>
				<div class="bottom">
					<label style="display: block;color:#34495e ;">结果:</label>
					<textarea placeholder="请在上方粘贴文本" v-model="items[itemIndex].after"></textarea>
				</div>
			</div>

			<div class="detail" v-if="items[itemIndex].title=='rsa'">
				<div class="top">
					<div class="line">
						<div class="flex1">
							<label style="display: block;color:#34495e ;">公钥:</label>
							<textarea style="width: 100%;height: 200px;border: none;outline: none;" placeholder="公钥文本" v-model="items[itemIndex].rsaPubliceKey"></textarea>
						</div>
						<div class="flex1">
							<label style="display: block;color: #34495e;">私钥:</label>
							<textarea style="width: 100%;height: 200px;border: none;outline: none;" placeholder="私钥文本" v-model="items[itemIndex].rsaPrivateKey"></textarea>
						</div>
					</div>

					<div class="line" style="display: block;">
						<label style="display: block;color:#34495e ;">文本:</label>
						<textarea style="width: 100%;height: 200px;border: none;outline: none;" placeholder="需要处理的文本" v-model="items[itemIndex].before"></textarea>
					</div>
					<div class="line btns">
						<div class="btn" @click="encrypt()">公钥加密</div>
						<div class="btn" @click="decrypt()">私钥解密</div>
					</div>
				</div>
				<div class="bottom">
					<label style="display: block;color:#34495e ;">结果:</label>
					<textarea placeholder="请在上方粘贴文本" v-model="items[itemIndex].after"></textarea>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import CryptoJS from 'crypto-js';
	import md5 from 'js-md5';
	import JSEncrypt from 'jsencrypt/bin/jsencrypt.min.js'
	export default {
		name: 'urlToJson',
		components: {},
		data() {
			return {
				tabNum: 1,
				items: [],
				nomarlItem: {
					title: 'md5',
					active: false,
					before: '',
					after: '',
					rsaPubliceKey: '-----BEGIN PUBLIC KEY-----\n' +
						'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw12CqAdzFrjFGWpPMYPS' +
						'HmgctloezQVzKO80P7LGBc+tvDZY5PS7gg3Pa/2dgsOclhjoqu52E8l+ayLt25WR' +
						'rn3OhpMohjJURpe0S/VqoxUfqE3CCkwCEC+lLXnms5bHu9kGkBMXpr++vYLP8Rg5' +
						'XGhNc4tpTnE7NLUNeDHQh9pjAWYFTKKTgiYKCRhGBzi2r4OOe4S447As40UqmUj3' +
						'tR2b1bvJIzRUjGqYU6a5ilmMpsfv95rO6rlAjDhzYHfQanf7IVQ/YXN6YGk4FvIG' +
						'Vw1KK1AXg2RoGngaTcUl5wzFc6vnX+Avhm3kLy6pE6YEbbdfYZY6wXf95sZAXD4N' +
						'CQIDAQAB\n' +
						'-----END PUBLIC KEY-----',
					rsaPrivateKey: '-----BEGIN PRIVATE KEY-----\n' +
						'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDXYKoB3MWuMUZ' +
						'ak8xg9IeaBy2Wh7NBXMo7zQ/ssYFz628Nljk9LuCDc9r/Z2Cw5yWGOiq7nYTyX5r' +
						'Iu3blZGufc6GkyiGMlRGl7RL9WqjFR+oTcIKTAIQL6Uteeazlse72QaQExemv769' +
						'gs/xGDlcaE1zi2lOcTs0tQ14MdCH2mMBZgVMopOCJgoJGEYHOLavg457hLjjsCzj' +
						'RSqZSPe1HZvVu8kjNFSMaphTprmKWYymx+/3ms7quUCMOHNgd9Bqd/shVD9hc3pg' +
						'aTgW8gZXDUorUBeDZGgaeBpNxSXnDMVzq+df4C+GbeQvLqkTpgRtt19hljrBd/3m' +
						'xkBcPg0JAgMBAAECggEAQrAR4I+ibpgl17YdUFaiC/UYD/sVVoDMvaVhnXjF9cfd' +
						'k0it8YHE2/Eg48kP0ko5klbwXSDHN5vpRmMG9JTKxNh2/iMPizd04x/30JH2k7Kr' +
						'OsVIPkGR1rqc1Lgu0xDeHzZG8jlCMo5zardTigXt1qhX/+AP01H9ltFSxruiZizB' +
						'xDuK+ETAVi/PRIXkPIm3FklFsSXSycjhEwDBMUvRfunOf7ASS4OkdHG0wTVpsMJH' +
						'EK1x0RGzNVdYxVvXFAzgTIABocMejf4fh72uasc3qqKs1I5c9uoVKfzvIh3Zhobr' +
						'2HV0QxbH3iK0OVkdAjouXfUtv4GpHSafCv6boRdVAQKBgQDyGAysIuSt4Typw6kG' +
						'2GBn7Sw1qbi/9ORzXDZyIaYIo4gNANgZYipPca6bR9G5H1hLAHYW3ZjOyXZk3rRP' +
						'vCurUhnfkGvnTi9j5Ex3eWyRdd40WevT8uBszUnJqd2Bn+ivfqCGojoJeRBHLY+0' +
						'zr+SsgtI4LEpd1XuEF5l7VKUqQKBgQDOllLeeB7oNylfrCAs/pml4Kxq1oo1PnIR' +
						'QQDHwU8RUmJ4TivcNHU14vgHlihkB9waDltulKbxOuwdr8ZkNOWHLv/HQPp3fG8z' +
						'VcwktJKN3LqBkPOkwu9ARRy5ofuIzzh5P0NIMzHrLUwxPk0kLb9+4UTZWogpvBy6' +
						'Hpg0s8CRYQKBgQDZbOX8tz3gODjOUw58OlqjG+wnqe1mYN/IB5pSeIvwmEY5P3fV' +
						'nEdZoETr6t2dQFyAx8JHGPADUAaH40fXkK07qXnZQpDWZW7EbSaL6r6qCUzugY/+' +
						'g9Qxg1HwzyFEKMTG0JgFMq+jEFqhQncdMM33RvZBlqMmFapUK9lL+4++OQKBgQCV' +
						'Jorl+6u01D6WyFrioV6lGDTjXcmi71bDhj7d+X7wbp6RZT7dWTJWmWuhbpPyxInw' +
						'dfUlPUXaXEQkmseNiXM9ynz4ir1Kjxhp48PjrEszCO3OpayChArgSAWZMI2+FH4d' +
						'a8NT2UJtHOMpmmVvfWgIXvOqSWaNWzcSWQxi4HRjgQKBgHheyJB37nHuxmI4oD+7' +
						'U2Y05KC4TPUG5FBOl9x2bfyMxgivSMTOLH1HauykMQgTC4zb+tDY1nWb1YXmR8If' +
						'dlVZ7IYcSkQaRn3V2L0US7oUPL+g4zLybjudDSR9eqS/NCQtQkRk9Bk28fLXK8B3' +
						'XzCIq41gxMu0DLjirmb4agnO\n' +
						'-----END PRIVATE KEY-----',
					aesKey: '',
				},
				itemIndex: 0,
			}
		},
		watch: {},
		methods: {
			addItem() {
				this.items.push(JSON.parse(JSON.stringify(this.nomarlItem)))
			},
			choiceItem(index) {
				this.caloseAll()
				this.items[index].active = true;
				this.itemIndex = index;
			},
			closeItem(index) {
				if (this.items.length == 1) {
					return;
				}
				this.items.splice(index, 1);
				if (this.itemIndex != index) {
					if (index < this.itemIndex) {
						this.itemIndex--;
					}
					return;
				}
				this.itemIndex = index - 1;
				this.itemIndex = this.itemIndex == -1 ? 0 : this.itemIndex;
				this.items[this.itemIndex].active = true;
			},
			caloseAll() {
				for (var x = 0; x < this.items.length; x++) {
					this.items[x].active = false;
				}
			},
			encrypt() {
				try {
					var key = this.items[this.itemIndex].rsaPubliceKey.replace(/[\r\n]/g, "");
					var txt = this.items[this.itemIndex].before;
					if (!key) {
						alert("请输入公钥!");
						return
					}
					if (!txt) {
						alert("请输入待加密文本!");
						return
					}
					let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
					encryptor.setPublicKey(key); // 设置公钥
					var af = encryptor.encrypt(txt); // 进行加密
					if (!af) {
						af = "加密失败请检查文本，是否过长";
					}
					this.items[this.itemIndex].after = af; // 进行加密
				} catch (e) {
					this.items[this.itemIndex].after = e;
				}
			},
			decrypt() {
				try {
					var key = this.items[this.itemIndex].rsaPrivateKey.replace(/[\r\n]/g, "");
					var txt = this.items[this.itemIndex].before;
					if (!key) {
						alert("请输入私钥!");
						return
					}
					if (!txt) {
						alert("请输入待解密文本!");
						return
					}
					let decryptor = new JSEncrypt(); // 新建JSEncrypt对象
					decryptor.setPrivateKey(key); // 设置私钥
					var af = decryptor.decrypt(txt); // 进行解密
					if (!af) {
						af = "解密失败请检查文本";
					}
					this.items[this.itemIndex].after = af; // 进行加密
				} catch (e) {
					this.items[this.itemIndex].after = e;
				}
			},
			md5Encrypt() {
				var txt = this.items[this.itemIndex].before;
				if (!txt) {
					alert("请输入待加密文本!");
					return
				}
				this.items[this.itemIndex].after = md5(this.items[this.itemIndex].before);
			},
			//随机生成指定数量的16进制key
			generatekey() {
				let library = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
				let key = "";
				for (var i = 0; i < 16; i++) {
					let randomPoz = Math.floor(Math.random() * library.length);
					key += library.substring(randomPoz, randomPoz + 1);
				}
				this.items[this.itemIndex].aesKey = key;
			},
			//加密
			aesEncrypt() {
				var key1 = this.items[this.itemIndex].aesKey;
				var txt = this.items[this.itemIndex].before;
				if (!key1) {
					alert("请输入秘钥!");
					return
				}
				if (!txt) {
					alert("请输入待加密文本!");
					return
				}
				var key = CryptoJS.enc.Utf8.parse(key1);
				var srcs = CryptoJS.enc.Utf8.parse(txt);
				var encrypted = CryptoJS.AES.encrypt(srcs, key, {
					mode: CryptoJS.mode.ECB,
					padding: CryptoJS.pad.Pkcs7
				});
				this.items[this.itemIndex].after = encrypted.toString();
			},
			//解密
			aesDecrypt() {
				var key1 = this.items[this.itemIndex].aesKey;
				var txt = this.items[this.itemIndex].before;
				if (!key1) {
					alert("请输入秘钥!");
					return
				}
				if (!txt) {
					alert("请输入待解密文本!");
					return
				}
				var key = CryptoJS.enc.Utf8.parse(key1);
				var decrypt = CryptoJS.AES.decrypt(txt, key, {
					mode: CryptoJS.mode.ECB,
					padding: CryptoJS.pad.Pkcs7
				});
				this.items[this.itemIndex].after = CryptoJS.enc.Utf8.stringify(decrypt).toString();
			}

		},
		created() {
			var item = JSON.parse(JSON.stringify(this.nomarlItem));
			item.active = true;
			this.items.push(item)
			this.generatekey();
		}
	}
</script>

<style lang="scss">
	.enc-main {
		box-sizing: border-box;
		padding: 10px;
		padding-top: 0;
		width: 100%;
		height: 100%;
		display: flex;

		textarea {
			resize: none;
		}

		.flex1 {
			margin: 10px;
			flex: 1;
		}

		* {
			font-size: 0.8rem;
			color: #6e797a;
			transition: all 0.1s linear;
		}

		.enc-main-left {
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
					flex-direction: column;

					.line {
						display: flex;
						margin: 10px 0;
						padding-bottom: 10px;
						border-bottom: 1px #afc2c3 solid;

						.btn {
							border-radius: 4px;
							background: #ecf0f1;
							cursor: pointer;
							margin-right: 10px;
							margin-bottom: 10px;
							padding: 6px 20px;
						}

						.btn:hover {
							background: #3498db;
							color: #ffffff;
						}
					}

					input {
						flex: 1;
						outline: none;
						border: none;
					}
				}
			}

			.enc-main-top {
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
					width: 6rem;
					color: #34495e;
					padding: 4px 20px;
					padding-right: 8px;
					box-sizing: border-box;

					select {
						background: transparent;
						border: none;
						outline: none;
					}

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
					box-shadow: 4px 0 6px rgba(0, 0, 0, 0.2);

					.fa-close {
						display: inline-block;
					}
				}
			}
		}
	}
</style>
