<template>
    <div class="login-wrap">
        <div class="login-root">
            <div class="login-main">
                <img class="login-one-ball"
                     src="https://assets.codehub.cn/micro-frontend/login/fca1d5960ccf0dfc8e32719d8a1d80d2.png"/>
                <img class="login-two-ball"
                     src="https://assets.codehub.cn/micro-frontend/login/4bcf705dad662b33a4fc24aaa67f6234.png"/>
                <div class="login-container">
                    <div class="login-side">
                        <div class="login-bg-title">
                            <h1>网络安全知识教育普及系统</h1>
                        </div>
                    </div>
                    <div class="login-ID">
                        <div style="font-size: 22px; margin-bottom: 15px; margin-top: 5px">
                            🎯 Sign in
                        </div>
                        <lay-tab type="brief" v-model="method">
                            <lay-tab-item title="登录" id="1">
                                <div style="height: 250px">
                                    <lay-form :model="loginForm" :rules="rules" required>
                                        <lay-form-item :label-width="0" prop="account">
                                            <lay-input :allow-clear="true" prefix-icon="layui-icon-username"
                                                       placeholder="用户名"
                                                       v-model="loginForm.account"></lay-input>
                                        </lay-form-item>
                                        <lay-form-item :label-width="0" prop="password">
                                            <lay-input :allow-clear="true" prefix-icon="layui-icon-password"
                                                       placeholder="密码" password
                                                       type="password" v-model="loginForm.password"></lay-input>
                                        </lay-form-item>
                                        <lay-form-item :label-width="0" prop="vercode">
                                            <div style="width: 264px; display: inline-block">
                                                <lay-input :allow-clear="true" prefix-icon="layui-icon-vercode"
                                                           placeholder="验证码"
                                                           v-model="loginForm.vercode"></lay-input>
                                            </div>

                                            <div class="login-captach" @click="verificationImg">
                                                <img style="width: 100%" :src="verificationImgUrl" alt="获取验证码"/>
                                            </div>
                                        </lay-form-item>
                                        <div value="" name="like"  skin="primary" label="1">
                                        </div>
                                        <lay-form-item :label-width="0">
                                            <lay-button style="margin-top: 20px" type="primary" :loading="loging"
                                                        :fluid="true"
                                                        loadingIcon="layui-icon-loading" @click="loginSubmit">登录
                                            </lay-button>
                                        </lay-form-item>
                                    </lay-form>
                                </div>
                            </lay-tab-item>

                            <lay-tab-item title="注册" id="2">
                                <div style="height: 250px">
                                    <lay-form :model="registerForm" :rules="rules" required>
                                        <lay-form-item :label-width="0" prop="userAccount">
                                            <lay-input :allow-clear="true" prefix-icon="layui-icon-username"
                                                       placeholder="用户名"
                                                       v-model="registerForm.userAccount"></lay-input>
                                        </lay-form-item>
                                        <lay-form-item :label-width="0" prop="userPassword">
                                            <lay-input :allow-clear="true" prefix-icon="layui-icon-password"
                                                       placeholder="密码" password
                                                       type="password" v-model="registerForm.userPassword"></lay-input>
                                        </lay-form-item>
                                        <lay-form-item :label-width="0" prop="checkPassword">
                                            <lay-input :allow-clear="true" prefix-icon="layui-icon-password"
                                                       placeholder="确认密码" password
                                                       type="password" v-model="registerForm.checkPassword"></lay-input>
                                        </lay-form-item>
                                        <lay-form-item :label-width="0">
                                            <lay-button style="margin-top: 20px" type="primary" :loading="loging"
                                                        :fluid="true"
                                                        loadingIcon="layui-icon-loading" @click="registerSubmit">注册
                                            </lay-button>
                                        </lay-form-item>
                                    </lay-form>
                                </div>
                            </lay-tab-item>
                        </lay-tab>
                        <br>
                        <lay-line>其他方式</lay-line>
                        <ul class="other-ways">
                            <li>
                                <div class="line-container">
                                    <img class="icon" src="../../assets/login/w.svg"/>
                                    <p class="text">微信</p>
                                </div>
                            </li>
                            <li>
                                <div class="line-container">
                                    <img class="icon" src="../../assets/login/q.svg"/>
                                    <p class="text">钉钉</p>
                                </div>
                            </li>
                            <li>
                                <div class="line-container">
                                    <img class="icon" src="../../assets/login/a.svg"/>
                                    <p class="text">Gitee</p>
                                </div>
                            </li>
                            <li>
                                <div class="line-container">
                                    <img class="icon" src="../../assets/login/f.svg"/>
                                    <p class="text">Github</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue';
import {router} from "../../router";
import api from "../../api/Api.ts";
import useUserStore from "../../store/user.ts";

export default defineComponent({
    setup: function () {
        let code;
        const method = ref('1')
        const verificationImgUrl = ref('')
        const loging = ref(false);
        const remember = ref(false)
        const loginForm = reactive({
            account: 'kite',
            password: 'kite12345',
            vercode: ''
        })
        const registerForm = reactive({
            userAccount: '',
            userPassword: '',
            checkPassword: ''
        })
        const userInfo = useUserStore()

        onMounted(() => {
            verificationImg()
        })

        /**登录表单提交*/
        const loginSubmit = () => {
            if (loginForm.account === '' || loginForm.password === '') {
                layer.notifiy({
                    title: "Error",
                    content: "请将表单输入完整！",
                    icon: 2,
                    offset: 'center'
                })
            } else {
                if (loginForm.vercode === '') {
                    layer.notifiy({
                        title: "Error",
                        content: "验证码不能为空!",
                        icon: 2,
                        offset: 'center'
                    })
                } else {
                    if (loginForm.vercode !== code) {
                        layer.notifiy({
                            title: "Error",
                            content: "验证码不正确!",
                            icon: 2,
                            offset: 'center'
                        })
                    } else {
                        loginRequest();
                    }
                }
            }

        }

        /**注册表单提交*/
        const registerSubmit = () => {
            ('点我注册...')
            if (registerForm.userAccount === '' || registerForm.userPassword === '' || registerForm.checkPassword === '') {
                layer.notifiy({
                    title: "Error",
                    content: "请将表单输入完整！",
                    icon: 2,
                    offset: 'center'
                })
            } else {
                registerRequest();
            }
        }

        /**登录方法*/
        const loginRequest = () => {
            api.post('/api/user/login', {
                userAccount: loginForm.account,
                userPassword: loginForm.password
            }).then((res) => {
                (res.data)
                if (res.data.code === 0) {
                    layer.notifiy({
                        title: "Success",
                        content: "登录成功!",
                        icon: 1
                    })
                    userInfo.user = res.data.data
                    userInfo.isLoggedIn = true
                    router.push("/index")
                }

            })
        }

        /**登录方法*/
        const registerRequest = () => {
            api.post('/api/user/register', registerForm).then((res) => {
                (res.data)
                if (res.data.code === 0) {
                    layer.notifiy({
                        title: "Success",
                        content: "注册成功!",
                        icon: 1
                    })
                    router.push("/")
                }

            })
        }
        /**表单校验*/
        const rules = ref({
            account: {
                type: 'string',
            },
            password: {
                type: 'string'
            },
            vercode: {
                type: 'string'
            }
        })

        /**生成验证码*/
        const generateVerificationCode = () => {
            const codeLength = 6; // 验证码的长度
            const random = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 随机字符集
            let code = '';

            for (let i = 0; i < codeLength; i++) {
                const index = Math.floor(Math.random() * random.length);
                code += random.charAt(index);
            }
            console.log("验证码: " + code);
            return code;
        };

        /**生成验证码图片*/
        const generateVerificationImage = (code) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 设置 canvas 大小
            canvas.width = 240;
            canvas.height = 90;

            // 创建线性渐变
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#16BAAA');
            gradient.addColorStop(1, '#feb47b');

            // 设置背景色
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 设置文字样式
            ctx.font = 'bold 48px "Arial Black", Gadget, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // 添加阴影效果
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // 在 canvas 上绘制验证码文本
            ctx.fillText(code, canvas.width / 2, canvas.height / 2);

            // 将 Canvas 转换为 Data URL
            const dataUrl = canvas.toDataURL('image/png');
            return dataUrl;
        };

        /**刷新验证码*/
        const verificationImg = () => {
            code = generateVerificationCode();
            const imageUrl = generateVerificationImage(code);
// 然后将 imageUrl 返回或者使用在需要的地方
            verificationImgUrl.value = imageUrl;
        }

        /**返回*/
        return {
            loginSubmit,
            registerSubmit,
            verificationImg,
            loginRequest,
            registerRequest,
            registerForm,
            verificationImgUrl,
            loginForm,
            remember,
            method,
            loging,
            rules
        }
    }
})
</script>

<style scoped>
.login-captach {
    display: inline-block;
    vertical-align: bottom;
    width: 108px;
    height: 40px;
    color: var(--global-primary-color);
    margin-left: 8px;
    border-radius: 4px;
    border: 1px solid hsla(0, 0%, 60%, 0.46);
    transition: border 0.2s;
    box-sizing: border-box;
    background: #fff;
    overflow: hidden;
    cursor: pointer;
}

.login-one-ball {
    opacity: 0.4;
    position: absolute;
    max-width: 568px;
    left: -400px;
    bottom: 0px;
}

.login-two-ball {
    opacity: 0.4;
    position: absolute;
    max-width: 320px;
    right: -200px;
    top: -60px;
}

.login-wrap {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: auto;
    min-width: 600px;
    z-index: 9;
    background-image: url(https://assets.codehub.cn/micro-frontend/login/f7eeecbeccefe963298c23b54741d473.png);
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100vh;
}

.login-wrap :deep(.layui-input-block) {
    margin-left: 0 !important;
}

.login-root {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    width: 100%;
    min-width: 320px;
    background-color: initial;
}

.login-main {
    position: relative;
    display: block;
}

.logo-container {
    max-width: calc(100vw - 28px);
    margin-bottom: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-container .logo {
    display: inline-block;
    height: 30px;
    width: 143px;
    background: url() no-repeat 50%;
    background-size: contain;
    cursor: pointer;
}

.login-container {
    position: relative;
    overflow: hidden;
    width: 940px;
    height: 520px;
    max-width: calc(100vw - 28px);
    border-radius: 4px;
    background: hsla(0, 0%, 100%, 0.5);
    backdrop-filter: blur(30px);
    display: flex;
    box-shadow: 6px 6px 12px 4px rgba(0, 0, 0, 0.1);
}

.login-side {
    padding: 40px 20px 20px;
    background-color: var(--global-primary-color);
    flex: 1;
    height: 100%;
}

.login-bg-title {
    flex: 1;
    height: 80%;
    color: #fff;
    text-align: center;
    background-image: url('../../assets/login/login-bg.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    text-align: center;
    min-width: 200px;
}

.login-ID {
    padding: 20px;
    width: 380px;
    min-width: 380px;
}

.login-container .layui-tab-head {
    background: transparent;
}

.login-container .layui-input-wrapper {
    margin-top: 10px;
    margin-bottom: 10px;
}

.login-container .layui-input-wrapper {
    margin-top: 12px;
    margin-bottom: 12px;
}

.login-container .assist {
    margin-top: 5px;
    margin-bottom: 5px;
    letter-spacing: 2px;
}

.login-container .layui-btn {
    margin: 10px 0px 10px 0px;
    letter-spacing: 2px;
    height: 40px;
}

.login-container .layui-line-horizontal {
    letter-spacing: 2px;
    margin-bottom: 34px;
    margin-top: 24px;
}

.other-ways {
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 14px;
    font-weight: 400;
}

.other-ways li {
    width: 100%;
}

.line-container {
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
}

.line-container .icon {
    height: 28px;
    width: 28px;
    margin-right: 0;
    vertical-align: middle;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 2px 0 rgb(9 30 66 / 4%), 0 1px 4px 0 rgb(9 30 66 / 10%),
    0 0 1px 0 rgb(9 30 66 / 10%);
}

.line-container .text {
    display: block;
    margin: 12px 0 0;
    font-size: 12px;
    color: #8592a6;
}

:deep(.layui-tab-title .layui-this) {
    background-color: transparent;
}
</style>
