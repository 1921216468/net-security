<template>
    <lay-layout class="example">
        <lay-header>
            <!-- 导航栏组件放在这里 -->
            <NavigationBar/>
        </lay-header>
        <lay-body class="lay-body">
            <router-view></router-view>
        </lay-body>
<!--        <lay-footer class="lay-footer"><Footer /></lay-footer>-->
    </lay-layout>
</template>

<script lang="ts">
import NavigationBar from '../src/components/NavigationBar.vue';
import Footer from "../src/components/Footer.vue";

export default {
    setup() {
        return {
            NavigationBar,
            Footer
        };
    },
};
</script>

<style>



</style>
