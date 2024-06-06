<template>
  <!-- 筛选框 -->
    <div class="filter-bar">
        <!-- 搜索框 -->
        <lay-input class="search-input" prefix-icon="layui-icon-search" suffix-icon="layui-icon-search" v-model="input"
                   @input="input_value" :allow-clear="true"/>

    </div>

    <lay-container :fluid="true" style="padding-left: 200px;padding-right: 200px; padding-top: 10px">
        <lay-card>
            <h1 style="text-align: left; margin-top: 50px">文章列表</h1>
        </lay-card>
        <lay-row :space="10">
            <!-- <lay-card> -->
            <lay-row :space="10">
                <lay-col :md="4" v-for="(item, index) in lesson_dataSource" :key="index" @click="goToDetail(item.id)">
                    <lay-card class="card-list-item">
                        <img
                            :src="item.img.split(',')[0]"
                        />
                        <div class="button-list">
                            <div class="title">{{item.title}}</div>
                            <div class="content">
                                {{item.content.substring(0, 50) + '...'}}
                            </div>
                            <div class="time-avater">
                                {{item.createTime}}
                                <div style="flex: 1; text-align: right">
                                    <lay-icon type="layui-icon-eye" size="20"></lay-icon>
                                    <span style="margin-left: 5px">{{ item.lookNum }}</span>
                                </div>
                            </div>
                        </div>
                    </lay-card>
                </lay-col>
            </lay-row>
        </lay-row>

        <!-- 分页控件 -->
        <lay-page
                :total="total"
                :current="currentPage"
                :page-size="pageSize"
                @change="handleCurrentChange"
        ></lay-page>
        <!-- 分页控件 -->
    </lay-container>
</template>

<script>
import { onMounted, ref, computed } from "vue";
import { layer } from "@layui/layer-vue";
import { ArticleApi } from "../../servie/Article.ts";
import { router } from "../../router/index.ts";

export default {
    setup() {
        const dataSource = ref([]);
        const lesson_dataSource = ref([]);
        const visible = ref(false);
        const searchTitle = ref('');
        const currentPage = ref(1);
        const pageSize = ref(10);
        const total = ref(1);

        /**输入框的值*/
        const input = ref('');

        function toSearch() {
            layer.load(2, { time: 3000 });
        }

        function toReset() {
            searchTitle.value = '';
        }

        /**获取课程*/
        const fetch_lesson = async (input) => {
            ArticleApi.getArticleList({searchText: input,current: currentPage.value, pageSize: pageSize.value }).then((res) => {
                console.log(res.data.records);
                dataSource.value = res.data.records;
                total.value = res.data.total;
                console.log(res.data.records);
                lesson_dataSource.value = res.data.records;
            });
        };

        const paginated_lesson_dataSource = computed(() => {
            // 通过计算属性实现分页
            const startIndex = (currentPage.value - 1) * pageSize.value;
            const endIndex = currentPage.value * pageSize.value;
            return lesson_dataSource.value.slice(startIndex, endIndex);
        });

        const all = () => {
            router.push({ path: '/all' });
        };

        const handleCurrentChange = (val) => {
            currentPage.value = val.current;
            pageSize.value = val.limit;
            fetch_lesson();
            layer.msg(`当前页: ${JSON.stringify(val)}`);
        };

        onMounted(() => {
            fetch_lesson();
        });

        /**获取输入框的值方法，并触发重新搜索*/
        const input_value = function (val) {
            console.log(val);
            fetch_lesson(val);
        }
        const goToDetail = (id) => {
            router.push({ path: '/article-detail', query: { id: id } });
        }

        return {
            input,
            input_value,
            dataSource,
            visible,
            searchTitle,
            all,
            lesson_dataSource,
            currentPage,
            pageSize,
            paginated_lesson_dataSource,
            handleCurrentChange,
            total,
            goToDetail
        };
    },
};
</script>

<style scoped>

.filter-bar {
    background-color: #ffffff;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    border-radius: 8px;
}

.search-input {
    width: 40%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    box-sizing: border-box;
    margin-right: 30%;
    margin-left: 30%;
}

.search-input:hover,
.search-input:focus {
    border-color: #16baaa;
    box-shadow: 0 0 10px rgba(22, 186, 170, 0.3);
}

.filter-rules {
    display: flex;
}

.filter-rules button {
    margin-right: 40px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: #333;
    font-size: 14px;
    outline: none;
}

.filter-rules button.active {
    color: #16baaa;
}

.container {
    display: flex;
    flex-wrap: wrap;
}

:deep(.card-list-item .layui-card-body img) {
    width: 100%;
}

:deep(.card-list-item .layui-card-body) {
    padding: 0px !important;
}

.layui-card:last-child {
    border-radius: 4px;
}

.button-list {
    height: 140px;
    padding: 10px;
}

.title {
    font-size: 18px;
    color: #000000e0;
    margin: 15px 0px 5px;
}

.content {
    font-size: 14px;
    color: #ccc;
}

.time-avater {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #ccc;
    margin-top: 15px;
}

.card-list-item:hover {
    box-shadow: 2px 2px 14px #ccc;
    cursor: pointer;
}

.all-btn {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #e2e2e2;
    color: #000;
    font-size: 16px;
    font-weight: 500;
    margin-top: 20px;
}

.grid-demo {
    padding: 10px;
    line-height: 50px;
    border-radius: 2px;
    text-align: center;
}
</style>
