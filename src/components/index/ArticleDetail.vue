<template>
    <div class="juejin-article-detail">
        <!-- 文章头部信息 -->
        <div class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta">
                <span class="meta-item">作者: {{ article.author }}</span>
                <span class="meta-item">发布时间: {{ article.publishDate }}</span>
                <lay-icon type="layui-icon-eye" size="20"></lay-icon>
                <span style="margin-left: 5px">{{ article.lookNum }}</span>
            </div>
        </div>

        <!-- 文章操作栏 -->
        <div class="article-actions">
<!--            <lay-icon type="layui-icon-praise"></lay-icon>-->
<!--            <span class="action-item" @click="likeArticle"> 点赞</span>-->
<!--            <lay-icon type="layui-icon-star"></lay-icon>-->
<!--            <span class="action-item" @click="collectArticle"> 收藏</span>-->
<!--            <lay-icon type="layui-icon-release"></lay-icon>-->
<!--            <span class="action-item" @click="shareArticle"> 转发</span>-->
        </div>


        <!-- 文章内容 -->
        <div class="article-content-container">
            <div class="article-content">
                <div v-html="compiledMarkdown"></div>
                <!-- 图片展示位置 -->
                <div v-if="imageList" class="article-images">
                    <div v-for="(item, index) in imageList" :key="index" class="article-image-item">
                        <img :src="item" alt="文章图片" class="article-image"/>
                    </div>
            </div>
            </div>

            <!-- 右侧相关推荐和文件下载卡片 -->
            <div class="sidebar">
                <!-- 相关推荐卡片 -->
                <div class="related-recommend">
                    <h2 class="related-title">相关推荐</h2>
                    <ul class="related-list">
                        <li class="related-item" v-for="(item, index) in relatedArticles" :key="index">
                            <router-link :to="`/article-detail?id=${item.id}`">{{ item.title }}</router-link>
                        </li>
                    </ul>
                </div>

                <!-- 文件下载卡片 -->
                <div class="file-download">
                    <h2 class="file-title">文件下载</h2>
                    <ul class="file-list">
                        <li class="file-item" v-for="(file, index) in fileList" :key="index">
                            <a :href="file.url" target="_blank">{{ file.title }}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted,onUnmounted, watch } from 'vue';
import { ArticleApi} from "../../servie/Article.ts";
import {useRoute} from "vue-router";
import { marked } from "marked";
import {PointApi} from "../../servie/PointApi.ts";
const compiledMarkdown = ref("");
const route = useRoute(); // 获取路由访问对象
const score = ref(0); // 定义积分状态

const article = ref({
    title: 'Vue.js 简介',
    author: '张三',
    publishDate: '2024-01-28',
    content: 'Vue.js 是一款流行的前端 JavaScript 框架，由尤雨溪开发...'
});

const relatedArticles = ref([
    { id: 1, title: 'Vue.js 实战' },
    { id: 2, title: 'React 深度学习' },
    { id: 3, title: 'Angular 最佳实践' }
]);

const fileList = ref([]);

const imageList = ref([]);

const fetchArticleDetail = () => {
    // 获取文章详情
    ArticleApi.getArticleById(route.query.id).then(res => {
        console.log(res)
        console.log(route.query.id)
        article.value = res.data
        article.value.author = res.data.user.userName
        article.value.publishDate = res.data.createTime
        compiledMarkdown.value = marked(article.value.content);
        fileList.value = res.data.fileList
        imageList.value = res.data.imgList;
        console.log("图片列表")
        console.log(imageList.value)
    })
};

const fetchRelatedArticles = () => {
    // 获取相关推荐文章
    ArticleApi.getHotArticleList().then(res => {
        console.log(res.data.records);
        relatedArticles.value = res.data.records;
    }).catch(error => {
        layer.msg('获取失败');
    })
};

// 监听路由参数的变化
watch(() => route.query.id, () => {
    fetchArticleDetail();
});

const openMsg6 = function() {
    PointApi.createPoint({
        title: "累计学习五分钟加一分",
        score: 1
    }).then((res) => {
        console.log(res);
    });
    layer.msg("累计学习五分钟，积分+1", { icon : 6, time: 1000})
}


onMounted(() => {
    fetchArticleDetail();
    fetchRelatedArticles();
    // 设置定时器，每5秒积分加1
    const intervalId = setInterval(() => {
        score.value += 1;
        openMsg6();
        console.log(score.value);
    }, 5000);
    // 保存定时器ID用于清理
    onUnmounted(() => {
        clearInterval(intervalId); // 清理定时器
    });
});
</script>

<style scoped>
.juejin-article-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;

}

.article-content-container {
    display: flex;
}

.article-content {
    flex: 1;
    max-width: 80%;
}

.article-title {
    font-size: 38px;
    font-weight: bold;
    margin-bottom: 10px;
}

.article-meta {
    color: #666;
}

.meta-item {
    margin-right: 10px;
}
.article-actions {
    margin-bottom: 20px;
    margin-top: 20px;
}

.action-item {
    margin-right: 20px;
    cursor: pointer;
}

/* 右侧侧边栏样式 */
.sidebar {
    width: 30%; /* 调整宽度根据实际需要 */
    position: absolute; /* 设置为绝对定位 */
    top: 120px; /* 调整距离顶部的距离 */
    right: 0; /* 对齐到右侧 */
}

/* 相关推荐卡片样式 */
.related-recommend {
    margin-top: 20px; /* 调整与上方的距离 */
}

.related-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
}

.related-list {
    list-style-type: none;
    padding: 0;
}

.related-item {
    margin-top: 10px;
}

/* 文件下载卡片样式 */
.file-download {
    margin-top: 40px; /* 调整与相关推荐卡片之间的距离 */
}

.file-title {
    font-size: 20px;
    font-weight: bold;
}

.file-list {
    list-style-type: none;
    padding: 0;
}

.file-item {
    margin-top: 10px;
}

.article-images {
    margin-top: 20px; /* 设置图片展示位置的上外边距 */
}

.article-image-item {
    margin-bottom: 20px; /* 设置每张图片下方的外边距 */
}

.article-image {
    max-width: 100%; /* 设置图片的最大宽度为100%，防止超出容器 */
    display: block; /* 设置图片为块级元素，使其独占一行 */
    margin: 0 auto; /* 居中显示图片 */
}

</style>
