<template>
    <div class="video-container">
        <div class="video-player">
            <div class="video-wrapper">
                <iframe width="100%" height="auto" :src="videoUrl" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="video-info">
                <h2>{{ videoTitle }}</h2>
                <p>{{ videoDate }} • <lay-icon type="layui-icon-eye" size="10"></lay-icon> {{ videoViews }}  </p>
                <hr>
                <div class="channel-info">
                    <div class="channel-details">
                        <p class="video-description">{{ videoDescription }}</p>
                    </div>
                </div>

            </div>
        </div>
        <div class="sidebar-container">
            <div class="file-list">
                <h3>文件列表</h3>
                <ul>
                    <li v-for="item in fileList" :key="item.title">
                        <a :href="item.url">{{ item.title }}</a>
                    </li>
                </ul>
            </div>
            <div class="related-videos">
                <h3>推荐观看</h3>
                <ul>
                    <li v-for="item in relatedVideos" :key="item.id" class="related-video-item" @click="goToLessonDetail(item.id)">
                        <img :src="item.img" class="video-thumbnail">
                        <div class="video-details">
                            <h2> {{ item.title }}</h2>
                            <p><lay-icon type="layui-icon-eye" size="10"></lay-icon> {{ item.lookNum }}</p>
                        </div>

                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue';
import {LessonApi} from "../../servie/LessonApi.ts";
import {useRoute} from "vue-router";
import {router} from "../../router/index.ts";
import {PointApi} from "../../servie/PointApi.ts";
const route = useRoute(); // 获取路由访问对象

const videoUrl = ref('https://youtu.be/58PpN0_VzQg');
const videoTitle = ref('Video Title');
const videoDate = ref('Jan 1, 2024');
const videoDescription = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet dolor sit amet justo eleifend tempor.');
const videoViews = ref('1,234,567');
const fileList= ref([
    { title: '文件1', url: '#' },
    { title: '文件2', url: '#' },
    { title: '文件3', url: '#' }
]);

const relatedVideos = ref([
    { title: '', img: '', views: '' },
]);

const score = ref(0); // 定义积分状态
const fetch_lesson = async () => {
    LessonApi.getLessonById(route.query.id).then(res => {
        videoUrl.value = res.data.file;
        videoTitle.value = res.data.title;
        videoDescription.value = res.data.content;
        videoDate.value = res.data.createTime;
        fileList.value = res.data.fileList;
        videoViews.value = res.data.lookNum;
    });
    console.log('fetch_lesson');
}

/**相关视频*/
const fetch_relatedVideos = async () => {
    LessonApi.getLessonList({pageSize:4}).then(res => {
        console.log(res.data.records);
        relatedVideos.value = res.data.records;
    });
    console.log('fetch_relatedVideos');
}
const goToLessonDetail = (id) => {
    router.push({ path: '/lesson-detail', query: { id: id } });
}

// 监听路由参数的变化
watch(() => route.query.id, () => {
    fetch_lesson();
})

const openMsg6 = function() {
    PointApi.createPoint({
        title: "累计学习十分钟加一分",
        score: 1
    }).then((res) => {
        console.log(res);
    });
    layer.msg("累计学习十分钟，积分+1", { icon : 6, time: 1000})
}


onMounted(() => {
    fetch_lesson();
    fetch_relatedVideos(); // 注意这里调用函数的方式

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
.video-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.video-player {
    width: 66%;
    max-width: 1000px;
    margin-right: 20px;
}

.video-wrapper {
    width: 100%;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    position: relative;
}

.video-wrapper iframe {
    position: absolute;
    width: 100%;
    height: 100%;
}

.video-info {
    margin-top: 20px;
}

.video-info h2 {
    margin: 0 0 10px 0;
    font-size: 24px;
}

.video-info p {
    margin: 0;
    font-size: 14px;
    color: #606060;
}

.video-info hr {
    margin: 20px 0;
    border: 0;
    border-top: 1px solid #ddd;
}

.channel-info {
    display: flex;
    align-items: center;
}

.channel-info img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.channel-details h3 {
    margin: 0;
    font-size: 18px;
}

.channel-details p {
    margin: 5px 0;
    color: #606060;
}

.video-description {
    color: #606060;
}

.sidebar-container {
    width: 33%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
}

.file-list,
.related-videos {
    background-color: #f3f3f3;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.file-list h3 {
    margin: 0 0 10px 0;
    font-size: 18px;
}

.related-videos h3 {
    margin-bottom: 10px;
    font-size: 18px;
}

.file-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.related-videos ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.file-list li,
.related-videos li {
    margin-bottom: 10px;
}

.related-videos img {
    width: 100px;
    height: auto;
    border-radius: 8px;
    margin-right: 10px;
}

.related-video-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.video-thumbnail {
    width: 120px;
    height: auto;
    border-radius: 8px;
    margin-right: 15px;
}

.video-details h2 {
    margin: 0;
    font-size: 18px;
}

.video-details p {
    margin: 5px 0 0;
    font-size: 14px;
    color: #606060;
}

</style>
