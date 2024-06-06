<template>
    <div>
        <QuestionBankList />
        <ShowCard />
    </div>
</template>

<script>
import QuestionBankList from "../../components/ability/QuestionBankList.vue";
import ShowCard from "../../components/ability/ShowCard.vue"; // 导入题库卡片列表组件


export default {
    components: {
        ShowCard,
        QuestionBankList
    },

    setup() {

    }
};
</script>

<style scoped>
/* 如果需要添加页面特定的样式，可以在此处添加 */
</style>
