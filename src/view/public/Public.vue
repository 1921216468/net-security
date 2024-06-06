<template>
<!--    <PublicShowCard />-->
    <lay-container :fluid="true" style="padding: 10px; margin: 20px">
        <lay-row :space="10">
            <lay-col :md="6" :sm="6" :xs="12">
                <lay-card class="statistics">
                    <template #title>热门文章</template>
                    <template #extra>
                        <lay-badge theme="green">Hot</lay-badge>
                    </template>
                    <div class="statistics-body">
                        <ArticleList />
                    </div>
                </lay-card>
            </lay-col>
            <lay-col :md="6" :sm="6" :xs="12">
                <lay-card class="statistics">
                    <template #title>热门课程</template>
                    <template #extra>
                        <lay-badge type="rim">Hot</lay-badge>
                    </template>
                    <div class="statistics-body">
                        <LessonList />
                    </div>
                </lay-card>
            </lay-col>
            <lay-col :md="6" :sm="6" :xs="12">
                <lay-card class="statistics">
                    <template #title>积分排行</template>
                    <template #extra>
                        <lay-badge type="rim">Hot</lay-badge>
                    </template>
                    <div class="statistics-body">
                        <ScoreboardUser />
                    </div>
                </lay-card>
            </lay-col>
            <lay-col :md="6" :sm="6" :xs="12">
                <lay-card class="statistics">
                    <template #title>答题排行</template>
                    <template #extra>
                        <lay-badge type="rim">Hot</lay-badge>
                    </template>
                    <div class="statistics-body">
                        <AnswerRightUser />
                    </div>
                </lay-card>
            </lay-col>
            <lay-col :md="24" :sm="24" :xs="24">
                <lay-card>
                    <HardQuestionCharts />
                    </lay-card>
            </lay-col>
            <lay-col :md="24" :sm="24" :xs="24">
                <lay-card>
                    <lay-tab type="brief" v-model="currentIndex">
                        <lay-tab-item title="今日热帖" id="1">
                            <lay-table
                                :columns="columns21"
                                :data-source="dataSource21"
                            ></lay-table>
                        </lay-tab-item>
                    </lay-tab>
                </lay-card>
            </lay-col>

        </lay-row>
    </lay-container>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import ArticleList from "../../components/public/ArticleList.vue";
import LessonList from "../../components/public/LessonList.vue";
import ScoreboardUser from "../../components/public/ScoreboardUser.vue";
import AnswerRightUser from "../../components/public/AnswerRightUser.vue";
import {PostApi} from "../../servie/PostApi.ts";
import HardQuestionCharts from "../../components/public/HardQuestionCharts.vue";

export default defineComponent({
    name: 'Analysis',
    components: {HardQuestionCharts, AnswerRightUser, ScoreboardUser, LessonList, ArticleList},
    setup() {

        const currentIndex = ref("1");
        const mainRef = ref()

        const dataSource21 = ref([
            {
                title: "root",
                userName: "root",
                favourNum: 20,
                thumbNum: 22,
                createTime: "18",
                content: "layui - vue（谐音：类 UI) ",
            },
        ]);

        onMounted(() => {
            fetchHotPost()
        })


        const columns21 = ref([
            {
                type: "number",
            },
            {
                title: "标题",
                key: "title",
            },
            {
                title: "作者",
                key: "userName",
            },
            {
                title: "点赞数",
                key: "favourNum",
            },
            {
                title: "收藏数",
                key: "thumbNum",
            },
            {
                title: "发布时间",
                key: "createTime",
                ellipsisTooltip: true,
            },
        ]);
        const fetchHotPost = async () => {
            try {
                const res = await PostApi.getHotPostArticleList();
                console.log(res);
                dataSource21.value = res.data;
                console.log(dataSource21.value);
            } catch (error) {
                console.error('Failed to fetch hot post:', error);
                // 可以选择在发生错误时将 dataSource21.value 设置为一个空数组或其他默认值
                dataSource21.value = [];
            }
        }


        return {
            mainRef,
            columns21,
            dataSource21,
            currentIndex

        };
    },
});
</script>

<style lang="less" scoped>
#main {
    width: 100%;
    height: 410px;
}

.leaving-messages {
    li {
        position: relative;
        padding: 10px 0;
        border-bottom: 1px solid #eee;

        h3 {
            padding-bottom: 5px;
            font-weight: 700;
        }

        p {
            font-size: 14px;
            padding-bottom: 10px;
        }

        >span {
            color: #999;
        }
    }
}

.target {
    width: 100%;
    height: 440px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}

.target-title {
    margin: 20px;
}

.statistics {
    font-size: 24px !important;
}

.statistics-body {
    padding: 14px 0;
}
</style>
