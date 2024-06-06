<template>
    <lay-container fluid class="container">
        <div class="question-bank-list">
            <div class="bank-card" v-for="(questionBank, index) in questionBanks" :key="questionBank.id">
                <BankCard :questionBank="questionBank" />
            </div>
        </div>
        <lay-page simple :total="total1" v-model="current1" :limit="limit1" @change="handle_change()"></lay-page>
    </lay-container>
</template>

<script>
import BankCard from "../ability/BankCard.vue";
import {onMounted, ref} from 'vue';
import {BankApi} from "../../servie/BankApi.ts";

import {router} from "../../router";
import {layer} from "@layui/layer-vue";
import useUserStore from "../../store/user.ts";

export default {
    components: {
        BankCard
    },
    setup() {
        const limit1 = ref(4);
        const total1 = ref('');
        const current1 = ref(1);
        const questionBanks = ref([]); // 创建题库列表的响应式数据


        const user = useUserStore();


        const fetch_bank = () => {
            if (user.isLoggedIn === false) {
                layer.confirm(
                    '会话超时, 请重新登录',
                    {
                        icon: 2, yes: function () {
                            router.push('/login');
                            layer.closeAll()
                        }
                    });
            } else {
                // 从后端获取题库列表
                BankApi.getBankList({pageSize:limit1.value,current:current1.value}).then((res) => {
                    total1.value = res.data.total;
                    questionBanks.value = res.data.records
                });
            }

        }
        const handle_change = () => {
            fetch_bank();
        }

        onMounted(() => {
            fetch_bank();
        });

        return {
            limit1,
            total1,
            current1,
            handle_change,
            questionBanks
        }
    }

};
</script>

<style scoped>
.container {
    padding: 20px;
}
.question-bank-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    justify-content: space-between; /* 让每行卡片平均分布 */
}
.bank-card {
    width: calc(25% - 15px); /* 计算每个卡片的宽度，减去间距 */
    margin-bottom: 20px;
}

@media (max-width: 1200px) {
    .bank-card {
        width: calc(33.33% - 15px); /* 在较小屏幕上每行最多显示三个卡片 */
    }
}

@media (max-width: 992px) {
    .bank-card {
        width: calc(50% - 15px); /* 在小屏幕上每行最多显示两个卡片 */
    }
}

@media (max-width: 768px) {
    .bank-card {
        width: calc(100% - 15px); /* 在较小屏幕上每行最多显示一个卡片 */
    }
}
</style>
