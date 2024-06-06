<template>
    <div class="scoreboard-container">
        <div v-for="user in users" :key="user.id" class="user-item">
            <img :src="user.userAvatar"class="user-avatar">
            <div class="user-content">
                <h2 class="user-name">{{ user.userName }}</h2>
                <div class="user-score" style="display: flex">
                    <p class="user-score_1">正确率：{{ (user.accuracy) * 100 }} %</p>
                    <p class="user-score_1">作答数：{{ user.totalCount }}</p>
                    <p class="user-score_1">作对数：{{ user.rightCount }}</p></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {UserApi} from "../../servie/UserApi.ts";

const users = ref([]);

// 示例数据，实际应用中可以从API获取
onMounted(() => {
    fetchUsers();
    users.value = [
        { id: "1", userName: "用户A", userAvatar: "avatar_url_1.jpg", accuracy: 150, totalCount: 100, rightCount: 80 },
        { id: "2", userName: "用户B", userAvatar: "avatar_url_2.jpg", accuracy: 120, totalCount: 100, rightCount: 60 },
        // 更多用户...
    ];
});

const fetchUsers = async () => {
    UserApi.getTopAccuracyThreeUser().then(res => {
        console.log(res.data);
        users.value = res.data;
    });
};

</script>

<style scoped>
.scoreboard-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 5px;
}

.user-item {
    width: 600px;
    border: 1px solid #ddd;
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.user-avatar {
    width: 18%;
    height: 90px;
    object-fit: cover;
}

.user-content {
    padding: 15px;
}

.user-name {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 1.2rem;
}

.user-score {
    color: #666;
    font-size: 0.9rem;
}

.user-score_1 {
    margin-right: 10px;
}
</style>
