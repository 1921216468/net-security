<template>
    <div>
        <h2>积分排行榜</h2>
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.name }} - {{ user.score }}
            </li>
        </ul>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const users = ref([
            { id: 1, name: '用户1', score: 120 },
            { id: 2, name: '用户2', score: 110 },
            // 更多用户...
        ]);

        return { users };
    },
};
</script>
