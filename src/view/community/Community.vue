<template>
  <!--    筛选框-->
    <div class="filter-bar">
        <lay-button type="primary" @click="change_flex">切换</lay-button>
        <!-- 搜索框 -->
        <lay-input class="search-input" prefix-icon="layui-icon-search" suffix-icon="layui-icon-search" v-model="input"
                   @input="input_value" :allow-clear="true"/>
        <!-- 选择框 -->
        <!-- 筛选规则 -->
        <div class="filter-rules">
            <button
                    :class="{ active: selected === 'all' }"
                    @click="selectFilter('all')"
            >
                全部
            </button>
            <button
                    :class="{ active: selected === 'myPosts' }"
                    @click="selectFilter('myPosts')"
            >
                我发布的
            </button>
            <button
                    :class="{ active: selected === 'myFavorites' }"
                    @click="selectFilter('myFavorites')"
            >
                我收藏的
            </button>
        </div>
    </div>
  <!--    筛选框-->
    <div v-if="is_flex == false">
        <AddPost/>
        <PostCard v-for="post in posts" :key="post.id" :post="post"></PostCard>
    </div>
    <div v-else>
        <AddPost/>
        <div class="container">
            <PostCard v-for="post in posts" :key="post.id" :post="post"></PostCard>
        </div>
    </div>

</template>

<script>

import PostCard from "../../components/post/PostCard.vue";
import PostFilter from "../../components/post/AddPost.vue";
import {onMounted, reactive, toRefs, ref} from "vue";
import {PostApi} from "../../servie/PostApi.ts";
import AddPost from "../../components/post/AddPost.vue";
import Page from "../../components/Page.vue";
import {layer} from "@layui/layer-vue";
import useUserStore from "../../store/user.ts";
import {router} from "../../router/index.ts";

export default {
    components: {Page, AddPost, PostCard, PostFilter},
    setup() {
        const user = useUserStore();

        /**布局 是否flex*/
        const  is_flex = ref(false)
        /**帖子数据*/
        const state = reactive({
            posts: [],
        });
        /**输入框的值*/
        const input = ref('')
        /**选择框的值*/
        const selected = ref('all');
        /**搜索参数*/
        let search = {pageSize: 500}
        /**获取帖子列表*/
        const fetch = () => {
            PostApi.getPostList(search).then((res) => {
                state.posts = res.data.records;
            });
        };

        const fetchMyPosts = () => {
            PostApi.getMyPostList({data: search}).then((res) => {
                state.posts = res.data.records;
            });
        };

        const fetchMyFavorites = () => {
            PostApi.getMyFavourList({data: search}).then((res) => {
                state.posts = res.data.records;
            });
        };

        const selectFilter = (filter) => {
            selected.value = filter;
            switch (selected.value) {
                case "all":
                    console.log(selected.value)
                    fetch();
                    break;
                case "myPosts":
                    console.log(selected.value)
                    fetchMyPosts();
                    break;
                case "myFavorites":
                    console.log(selected.value)
                    fetchMyFavorites();
                    break;
                default:
                    fetch();
                    break;
            }

        };


        /**获取输入框的值方法，并触发重新搜索*/
        const input_value = function (val) {
            search = {
                "searchText": val
            }
            selectFilter();
            search = {pageSize: 500}
        }

        /**改变布局*/
        const change_flex = () => {
            is_flex.value = !is_flex.value
        }

        onMounted(() => {
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
                fetch();
            }
        });

        // 使用 toRefs 将响应式对象的属性转换为响应式引用
        const stateRefs = toRefs(state);
        return {...stateRefs, input, input_value, selectFilter, selected,is_flex,change_flex};

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
    margin-left: 7%;
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

</style>
