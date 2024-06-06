<template>
<PersonCard  />
</template>

<script>
import { reactive, toRefs,onMounted } from 'vue';
import user from "../../store/user.ts";
import PersonCard from "../../components/center/PersonCard.vue";

export default {
    components: {PersonCard},
    methods: {user},
    setup() {
        // 用户信息状态
        // const state = reactive({
        //     user: {
        //         userAccount: '',
        //         userPassword: '',
        //         userName: '',
        //         userAvatar: '',
        //         userProfile: '',
        //         userRole: '',
        //         createTime: new Date(),
        //         updateTime: new Date(),
        //     },
        // });
        // const userInfo = reactive({
        //     userAccount: '',
        //     userPassword: '',
        //     userName: '',
        //     userAvatar: '',
        //     userProfile: '',
        //     userRole: '',
        //     createTime: '',
        //     updateTime: '',
        // });
        //
        // const editedInfo = reactive({
        //     userName: '',
        //     userAvatar: '',
        //     userProfile: '',
        // });

        // 获取用户信息
        onMounted(async () => {
            // const userInfo = await UserApi.getUserInfo();
            // state.user = userInfo;
        });

        // 更新用户简介
        const updateUserProfile = async () => {
            // state.user.updateTime = new Date();
            // await UserApi.updateUserProfile(state.user);
        };

        // 处理头像上传
        const handleAvatarUpload = async (event) => {
            // const file = event.target.files[0];
            // // 这里假设你有一个处理文件上传的方法，实际开发中请替换为实际的上传逻辑
            // const avatarUrl = await uploadFile(file);
            // if (avatarUrl) {
            //     state.user.userAvatar = avatarUrl;
            //     await UserApi.updateUserAvatar(avatarUrl);
            // }
        };

        // 使用 toRefs 将响应式对象的属性转换为响应式引用
        // const userRefs = toRefs(state.user);
        return {updateUserProfile, handleAvatarUpload};
    },
};
</script>

<style scoped>

</style>
