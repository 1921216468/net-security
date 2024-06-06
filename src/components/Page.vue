<template>
    <lay-page  v-model="currentPage" :limit="limit" :total="total"></lay-page>
</template>

<script>
import { ref } from 'vue'

export default {
    setup() {
        const limit = ref(10)
        const total = ref(500)
        const currentPage = ref(1);

        return {
            limit,
            total,
            currentPage
        }
    }
}
</script>
