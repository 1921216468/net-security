<template>
    <div class="articles-container">
        <div v-for="article in articles" :key="article.id" class="article-item">
            <div class="article-content">
                <h2 class="article-title">{{ article.title }}</h2>
<!--                <img :src="article.imageUrl" alt="文章图片" class="article-image"/>-->
                <p class="article-info">
                    <span class="read-count">阅读量：{{ article.lookNum }}</span> |
                    <span class="create-time">{{ article.createTime }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const articles = ref([]);

// 示例数据，实际应用中可以从API获取
onMounted(() => {
    articles.value = [
        { id: "1", title: "啊打发打发", imageUrl: "image_url_1.jpg", lookNum: 123, createTime: "2024-02-25" },
        { id: "2", title: "测试图片", imageUrl: "image_url_2.jpg", lookNum: 456, createTime: "2024-02-24" },
        // 更多文章...
    ];
});

/**获取热帖*/
import {ArticleApi} from "../../servie/Article.ts";

  ArticleApi.getHotArticleList().then(res => {
          articles.value = res.data.records.slice(0, 3)
        })

</script>

<style scoped>
.articles-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 5px;
}

.article-item {
    width: 600px;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.article-image {
    width: 100%;
    height: 20px;
    object-fit: cover;
}

.article-content {
    padding: 15px;
}

.article-title {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 1.2rem;
}

.article-info {
    color: #666;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
}

.read-count, .create-time {
    margin-right: 10px;
}
</style>

