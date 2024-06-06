<!-- SystemManagement.vue -->

<template>
        <div style="color: white">
            ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        </div>

        <div class="layout">
        <div class="menu">
    <lay-menu lay-menu v-model:selected-key="selectedKey" v-model:open-keys="openKeys5"  v-model:tree="isTree" theme="light" class="custom-menu">
            <lay-menu-item id="menu1">
                <router-link to="/admin/system-management/menu-1">
                    <lay-icon type="layui-icon-console"></lay-icon>
                    仪表盘
                </router-link>
            </lay-menu-item>
            <lay-menu-item id="sub-1">
                <router-link to="/admin/system-management/sub-1">
                    <lay-icon type="layui-icon-video"></lay-icon>
                    视频管理
                </router-link>
            </lay-menu-item>
            <lay-menu-item id="sub-2">
                <router-link to="/admin/system-management/sub-2">
                    <lay-icon type="layui-icon-align-left"></lay-icon>
                    图文管理
                </router-link>
            </lay-menu-item>
            <lay-menu-item id="sub-3">
                <router-link to="/admin/system-management/sub-3">
                    <lay-icon type="layui-icon-carousel"></lay-icon>
                    轮播图管理
                </router-link>
            </lay-menu-item>

        <lay-sub-menu id="menu2" has-children>
            <template v-slot:title>
                <router-link to="">
                    <lay-icon type="layui-icon-template"></lay-icon>
                    考试管理
                </router-link>
            </template>
            <lay-menu-item id="8">
                <router-link to="/admin/system-management/menu-4">
                    <lay-icon></lay-icon>
                    题库管理
                </router-link>
            </lay-menu-item>
            <lay-menu-item id="9">
                <router-link to="/admin/system-management/menu-5">
                    <lay-icon></lay-icon>
                    试题管理
                </router-link>
            </lay-menu-item>
        </lay-sub-menu>
        <lay-menu-item id="menu3">
            <router-link to="/admin/system-management/menu-3">
                <lay-icon type="layui-icon-notice"></lay-icon>
                公告管理
            </router-link>
        </lay-menu-item>
    </lay-menu>
        </div>


    <!-- 右侧内容区域，根据子路由渲染不同组件 -->
        <div class="content">
            <router-view></router-view>
        </div>
    </div>

</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const isTree = ref(true);
        const selectedKey = ref("menu1"); // 默认选中首页
        const openKeys5 = ref([""])


        return {
            isTree,
            selectedKey,
            openKeys5
        };
    },
};
</script>

<style scoped>
.custom-menu {
    margin-top: 8px; /* 调整菜单的上边距，避免与导航栏重叠 */
    margin-left: 8px; /* 调整菜单的左边距 */
}
.layout {
    display: flex;
}

.menu {
    width: 200px; /* 菜单宽度 */
    padding: 16px;
    border-right: 1px solid #e5e5e5; /* 菜单右边框 */
}

.content {
    flex-grow: 1; /* 自动扩展填充剩余空间 */
    padding: 16px;
}

</style>
