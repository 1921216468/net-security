<template>
        <lay-card class="card-container ">
            <template v-slot:title>
                <h2>{{ questionBank.title }}</h2>
            </template>
            <template v-slot:body>
<!--                截断15个字符-->

                <p>{{ truncatedContent }}</p>
            </template>
            <template v-slot:footer>
                <div class="card-footer">
                    <p>题目数量: {{questionNum}}</p>
<!--                    <p>题目数量: {{ questionBank.questionCount }}</p>-->
                    <p> {{ questionBank.createTime }}</p>
                    <lay-button type="primary" @click="startTrain" size="sm">开始训练</lay-button>
                </div>
            </template>
        </lay-card>
</template>

<script>
import {router} from "../../router/index.ts";
import {toRefs, ref, watchEffect } from 'vue';
export default {
    props: {
        questionBank: {
            type: Object,
            required: true
        }
    },
    computed: {
        truncatedContent() {
            return this.questionBank.content.length > 15 ? this.questionBank.content.substring(0, 15) + '...' : this.questionBank.content;
        }
    },

    setup(props) {
        const { questionBank } = toRefs(props);
        const questionNum = ref(0)

        const startTrain = () => {
            //跳转到刷题页面
            const id = questionBank.value.id;
            const name = questionBank.value.title;
            router.push({
                name: 'exam',
                query: { id,name }, // 使用 query 参数携带文章id
            });
            console.log('开始训练');
        }

        // // 使用watchEffect监听questionBank的变化，更新questionNum的值
        // watchEffect(() => {
        //     questionNum.value = Object.keys(questionBank.value).length;
        //     console.log(questionNum.value)
        //     console.log(questionBank.value.length)
        // });
        return {
            startTrain,
            questionNum

        }

    }
}
</script>

<style>
.card-container {
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: box-shadow 0.3s;
}
.card-footer {
    display: flex;
    justify-content: space-between;
    color: #8592a6;
}
</style>



