<template>
    <div class="navigation-bar">
        <div class="logo">Logo</div>
        <ul>
            <li v-for="item in navItems" :key="item.id" :class="{ active: isActive(item.link) }">
                <router-link :to="item.link">{{ item.text }}</router-link>
                <div class="underline" v-if="isActive(item.link)"></div>
            </li>
            <!-- 动态显示系统管理菜单项 -->
            <li v-if="getUserInfo() === 'admin'" :class="{ active: isActive('/admin') }">
                <router-link to="/admin">系统管理</router-link>
                <div class="underline" v-if="isActive('/admin')"></div>
            </li>
        </ul>
        <div class="login-buttons" v-if="!user.isLoggedIn">
            <lay-button type="primary" radius @click="login" class="login-btn">登录</lay-button>
            <lay-button type="default" radius @click="register" class="register-btn">注册</lay-button>
        </div>

        <div class="login-buttons" v-if="user.isLoggedIn">
            <lay-button type="default" radius @click="logout" class="register-btn">注销</lay-button>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { UserApi } from "../servie/UserApi.ts";
import useUserStore from "../store/user";

export default {
    setup() {
        const navItems = ref([
            { id: 1, text: '首页', link: '/index' },
            { id: 2, text: '能力评估', link: '/ability' },
            { id: 3, text: '社区论坛', link: '/community' },
            { id: 4, text: '公示公告', link: '/public' },
            { id: 5, text: '个人中心', link: '/center' },
        ]);

        const user = useUserStore();
        const route = useRoute();
        const router = useRouter();

        const isActive = (link) => route.fullPath === link;

        const logout = () => {
            UserApi.logout().then((res) => {
                user.isLoggedIn = false;
            });
        };

        const login = () => {
            router.push('/login');
        };

        const register = () => {
            router.push('/login');
        };

        const getUserInfo = () => {
            if (user.isLoggedIn === false) {
                return 'user';
            } else {

                const userStore = JSON.parse(localStorage.getItem('user') || '{}');
                if (userStore && userStore.user && userStore.user.userRole) {
                    return userStore.user.userRole;
                } else {
                    return 'user'; // 或者返回适当的默认值
                }
            }
        };

        // Watch for route changes
        watch(route, () => {
            // Handle route changes if needed
        });

        // Component mounted
        onMounted(() => {
            // Perform any initial setup or data fetching
            getUserInfo();
        });

        return {
            navItems,
            user,
            isActive,
            logout,
            login,
            register,
            getUserInfo,
        };
    },
};
</script>


<style scoped>
.navigation-bar {
    background-color: #ffffff;
    padding: 15px 50px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 18px;
    font-weight: bold;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
}

li {
    margin: 0 20px;
    cursor: pointer;
    color: #333333;
    font-size: 14px;
    font-weight: bold;
    position: relative; /* Make the li relative for absolute positioning */
}

li.active a,
li:hover a {
    color: #16baaa;
}


.underline {
    position: absolute;
    bottom: -4px;
    left: 0;
    height: 3px;
    background-color: #16baaa;
    width: 102%;
    transition: width 0.3s;
}

.login-buttons {
    display: flex;
    gap: 10px;
}

.login-btn, .register-btn {
    padding: 8px 15px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    border-radius: 3px;
    border: 1px solid #16baaa;
    display: flex;
    align-items: center; /* Center the text vertically */
}

.login-btn:hover {
    background-color: #16baaa;
}

.register-btn:hover {
    border: 1px solid #16baaa;
    color: #16baaa;
}
</style>
