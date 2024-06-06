<template>
    <lay-container :fluid="true" style="padding-left: 100px;padding-right: 100px">
        <lay-row space="20">
            <lay-space direction="vertical" fill>
            </lay-space>
            <lay-col md="4" sm="12" xs="24"><div class="grid-demo"><img style="height: 90px; " src="../../assets/img/logo_1.png"></div></lay-col>
            <lay-col md="4" sm="12" xs="24"><div class="grid-demo"><img style="height: 100px" src="https://storagecdn.xuetangx.com/public_assets/xuetangx/xuetangX2018/3f4f4e65069d59c139736f07295e2df7.15580847143191.png"></div></lay-col>
            <lay-col md="4" sm="12" xs="24"><div class="grid-demo"><img style="height: 100px" src="../../assets/img/img.png"></div></lay-col>
            <lay-col md="4" sm="12" xs="24"><div class="grid-demo"><img style="height: 100px" src="https://storagecdn.xuetangx.com/public_assets/xuetangx/xuetangX2018/6152680753c26f851eeb9b0ef9ca56f1.xajtdx.png"></div></lay-col>
            <lay-col md="4" sm="12" xs="24"><div class="grid-demo"><img style="height: 100px" src="../../assets/img/img_1.png"></div></lay-col>
            <lay-col md="4" sm="12" xs="24"><div class="grid-demo"><img style="height: 100px" src="../../assets/img/img_3.png"></div></lay-col>
            <lay-space direction="vertical" fill>
                <lay-line></lay-line>
            </lay-space>
        </lay-row>
    </lay-container>


<!--    精选好课-->
    <lay-container :fluid="true" style="padding-left: 200px;padding-right: 200px">

        <lay-card>
            <h1 style="text-align: left; margin-top: 50px">精选好课</h1>
        </lay-card>
        <lay-row :space="10">
                <!-- <lay-card> -->
                <lay-row :space="30">
                    <lay-col :md="6" v-for="(item, index) in lesson_dataSource" :key="index" @click="goToLessonDetail(item.id)">
                        <lay-card class="card-list-item">
                            <img
                                :src="item.img"
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
                    <lay-card>

                        <lay-button class="all-btn"  @click="all">查看全部<lay-icon type="layui-icon-right" size="30"></lay-icon></lay-button>
                    </lay-card>
                </lay-row>
            <lay-space direction="vertical" fill>
                <lay-line></lay-line>
            </lay-space>
            <!-- 热门文章-->
            <lay-container :fluid="true" style="padding-left: 20px;padding-right: 20px">
                <lay-card>
                    <h1 style="text-align: left; margin-top: 50px">热门文章</h1>
                </lay-card>
                <lay-row :space="10">
                    <!-- <lay-card> -->
                    <lay-row :space="30">
                        <lay-col :md="6" v-for="(item, index) in dataSource" :key="index" @click="goToDetail(item.id)">
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
                        <lay-card>

                            <lay-button class="all-btn" @click="all_article">查看全部<lay-icon type="layui-icon-right" size="30"></lay-icon></lay-button>
                        </lay-card>
                    </lay-row>
                </lay-row>
            </lay-container>
        </lay-row>
    </lay-container>


</template>

<script lang="ts">
import {onMounted, ref} from 'vue'
import { layer } from '@layui/layer-vue'
import {LessonApi} from "../../servie/LessonApi.ts";
import {ArticleApi} from "../../servie/Article.ts";
import {router} from "../../router";
import useUserStore from "../../store/user";



export default {
    setup() {

        const user = useUserStore();

        const dataSource = ref([
            {
                id: '',
                title: '',
                content: '',
                img: '',
                lookNum: '',
                createTime: '',
            }
        ])

        const lesson_dataSource = ref([
            {
                id: '',
                title: '',
                content: '',
                img: '',
                lookNum: '',
                createTime: '',
            }
        ])
        const visible = ref(false)
        const searchTitle = ref('')
        function toSearch() {
            layer.load(2, { time: 3000 })
        }
        function toReset() {
            searchTitle.value = ''
        }

        /**获取课程*/
        const fetch_lesson = () => {
            LessonApi.getLessonList({pageSize:4}).then(res => {
                console.log(res.data.records);
                lesson_dataSource.value = res.data.records;
            }).catch(error => {
                layer.msg('获取失败');
            })
        }
        /**获取文章*/
        const fetch_article = () => {
            ArticleApi.getArticleList({pageSize:8}).then(res => {
                console.log(res.data.records);
                dataSource.value = res.data.records;
            }).catch(error => {
                layer.msg('获取失败');
            })
        }

        const all = () => {
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
                router.push({path: '/all'})
            }
        }

        const all_article = () => {
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
                router.push({path: '/all-article'})
            }
        }

        const goToDetail = (id) => {
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
                router.push({ path: '/article-detail', query: { id: id } });
            }
        }

        const goToLessonDetail = (id) => {
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
                router.push({ path: '/lesson-detail', query: { id: id } });
            }
        }

        onMounted(() => {
            fetch_lesson();
            fetch_article();
        })

        return {
            dataSource,
            visible,
            searchTitle,
            all,
            lesson_dataSource,
            all_article,
            goToDetail,
            goToLessonDetail
        }
    }
}
</script>

<style scoped>
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
