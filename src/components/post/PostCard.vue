<template>
    <div class="post-card">
        <div class="post-header">
            <h2>{{ post.title }}</h2>
            <span class="post-date">{{ formatTime(post.createTime) }}</span>
            <!--            <lay-tag v-for="tag in post.tags" :key="tag" :color="randomColor()" class="tag" variant="light">-->
            <!--                {{ tag }}-->
            <!--            </lay-tag>-->
        </div>
        <div class="post-content">
            {{ post.content }}
        </div>
        <div class="post-footer">
            <div class="user-info">
                <img :src="post.user.userAvatar || 'default-avatar.jpg'" alt="User Avatar" class="user-avatar"/>
                <span class="user-name">{{ post.user.userName }}</span>
            </div>
            <div class="post-actions">
        <span class="thumb-icon" @click="toggleThumb(post.id)">
          {{ post.hasThumb ? '👍 已赞' : '👍' }}
        </span>
                <span class="thumb-count">{{ post.thumbNum }}</span>
                <span class="favour-icon" @click="toggleFavour(post.id)">
          {{ post.hasFavour ? '❤️ 已喜欢' : '❤️' }}
        </span>
                <span class="favour-count">{{ post.favourNum }}</span>

                <!-- 添加删除图标及事件 -->
                <span class="delete-icon" @click="deletePost(post.id)">🗑️ 删除</span>
            </div>
        </div>
    </div>
</template>

<script>
import {PostApi} from "../../servie/PostApi.ts";
import {ref} from "vue";

export default {
    props: {
        post: {
            type: Object,
            required: true,
        },
    },
    setup(props) {

        const hasFavour = ref(props.post.hasFavour);
        const favourNum = ref(props.post.favourNum);

        const hasThumb = ref(props.post.hasThumb);
        const thumbNum = ref(props.post.thumbNum);

        const COLORS = [
            "#165DFF",
            "#722ED1",
            "#D91AD9",
            "#F5319D",
        ];


        const deletePost = (id) => {
            console.log("删除" + id + "帖子")
            PostApi.deletePostById({id: id}).then((res) => {
                console.log("res:" + res.data)
                if (res.data === true) {
                    layer.notifiy({
                        title: "Success",
                        content: "删除成功!",
                        icon: 1
                    })
                }
                location.reload();
            })
        }
        const formatTime = (time) => {
            // 实现时间格式化逻辑
            const parsedDate = new Date(time);
            const year = parsedDate.getFullYear();
            const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
            const day = parsedDate.getDate().toString().padStart(2, '0');
            const hours = parsedDate.getHours().toString().padStart(2, '0');
            const minutes = parsedDate.getMinutes().toString().padStart(2, '0');
            const seconds = parsedDate.getSeconds().toString().padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        const toggleThumb = (id) => {
            // 实现点赞切换逻辑
            const data = {postId: id}
            PostApi.thumb({data: data}).then((res) => {
                    hasThumb.value = !hasThumb.value
                    props.post.hasThumb = hasThumb.value
                    if (hasThumb.value === true) {
                        // 更新 thumbNum 的值
                        thumbNum.value = thumbNum.value + 1;
                        props.post.thumbNum = thumbNum.value;
                    } else {
                        // 更新 thumbNum 的值
                        thumbNum.value = thumbNum.value - 1;
                        props.post.thumbNum = thumbNum.value;

                }
            })
        };

        const toggleFavour = (id) => {
            // 实现喜欢切换逻辑
            const data = {postId: id}
            PostApi.favour({data: data}).then((res) => {
                    hasFavour.value = !hasFavour.value;
                    // 将新的值赋给 post.hasFavour
                    props.post.hasFavour = hasFavour.value;
                    if (hasFavour.value === true) {
                        // 更新 favourNum 的值
                        favourNum.value = favourNum.value + 1;
                        props.post.favourNum = favourNum.value;
                    } else {
                        // 更新 favourNum 的值
                        favourNum.value = favourNum.value - 1;
                        props.post.favourNum = favourNum.value;

                }
            })
        };

        const randomColor = () => {
            // 随机选择颜色的函数
            const randomIndex = Math.floor(Math.random() * COLORS.length);
            return COLORS[randomIndex];
        };

        return {
            formatTime,
            toggleThumb,
            toggleFavour,
            randomColor,
            deletePost,
            favourNum,
            COLORS
        };
    },
};
</script>

<style scoped>
.post-card {
    max-width: 50%; /* Adjust the width as needed */
    margin: 16px auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: box-shadow 0.3s;
}

.post-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.post-date {
    color: #999999;
}

.post-content {
    margin-top: 16px;
    color: #333333;
}

.post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
}

.user-info {
    display: flex;
    align-items: center;
}

.user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 8px;
}

.user-name {
    font-weight: bold;
}

.post-actions {
    display: flex;
    align-items: center;
}

.thumb-icon,
.favour-icon {
    cursor: pointer;
    margin-right: 4px;
}

.thumb-count,
.favour-count {
    margin-right: 8px;
}

.delete-icon {
    cursor: pointer;
    margin-right: 4px;
    color: #ff4d4f; /* 红色，可以根据需要调整颜色 */
}

</style>

