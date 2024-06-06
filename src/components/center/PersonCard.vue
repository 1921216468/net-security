<template>
    <div class="juejin-profile">
        <div class="profile-header">
            <lay-avatar :src="user.avatar" size="lg" class="avatar"></lay-avatar>
                <h2>{{ user.username }}</h2>
                <lay-tag :color="randomColor()" class="tag" variant="light">
                    {{ user.role }}
                </lay-tag>
            <lay-icon type="layui-icon-edit" @click="edit">编辑资料</lay-icon>
            <br>
            <p class="bio">{{ user.bio }}</p>

        </div>
        <lay-form :model="editedUser" label-width="80px" v-if="editFormVisible == true">
            <Upload @upload-success="handleUploadSuccess"/>
            <lay-form-item label="用户名" prop="username">
                <lay-input v-model="editedUser.username"></lay-input>
            </lay-form-item>
            <lay-form-item label="简介" prop="bio">
                <lay-input v-model="editedUser.bio"></lay-input>
            </lay-form-item>
            <lay-form-item>
                <lay-button type="primary" @click="saveEdit">保存</lay-button>
                <lay-button type="default" @click="cancelEdit">取消</lay-button>
            </lay-form-item>
        </lay-form>
        <div class="profile-stats">
            <div class="stat-item">
                <div class="count">{{ user.articles }}</div>
                <div class="label">动态</div>
            </div>
            <div class="stat-item">
                <div class="count">{{ user.favours }}</div>
                <div class="label">获得赞</div>
            </div>
            <div class="stat-item">
                <div class="count">{{ user.times }}</div>
                <div class="label">学习时长</div>
            </div>
        </div>
        <br>
        <lay-line>🌲 🌲 🌲 🌲</lay-line>

        <div class="articles-card">
            <lay-button type="primary" @click="route_note">记笔记</lay-button>
            <br>
            <ul>
                <li v-for="article in user.latestArticles" :key="article.id">
                    <div class="article-card">
                        <div class="article-info">
                            <span class="article-title">{{ article.title }}</span>
                            <span class="date">{{ article.date }}</span>
                        </div>
                        <div class="article-actions">
                            <span class="edit-icon marked-icon" @click="mark_note(article.id)"
                                  :class="{ 'marked': isArticleMarked(article.id) }">🔖 标记</span>
                            <span class="delete-icon" @click="delete_note(article.id)">🗑️ 删除</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>


    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {UserApi} from "../../servie/UserApi.ts";
import useUserStore from "../../store/user.ts";
import {PostApi} from "../../servie/PostApi.ts";
import {NoteApi} from "../../servie/NoteApi.ts";
import Upload from "../../components/Upload.vue";
import {router} from "../../router/index.ts";


components: {
    Upload
}

/**从localStorage中获取用户信息*/
const user_store = JSON.parse(localStorage.getItem('user') || '{}');
const {isLoggedIn} = useUserStore();
const user_id = user_store.user.id;
/**用户信息*/
const user = ref({
    username: '',
    avatar: '',
    bio: '',
    articles: 0,
    favours: 0,
    times: 0,
    latestArticles: [],
});

/**编辑用户信息*/
const editedUser = ref({
    username: '',
    avatar: '',
    bio: '',
    account: ''
});
/**搜索参数*/
let search = {pageSize: 500}
/**控制模态框显示*/
const editFormVisible = ref(false);

const COLORS = [
    "#165DFF",
    "#722ED1",
    "#D91AD9",
    "#F5319D",
];

const edit = () => {
    editedUser.value.username = user.value.username;
    editedUser.value.bio = user.value.bio;
    editedUser.value.avatar = user.value.avatar;
    editFormVisible.value = !editFormVisible.value;
};
const saveEdit = () => {
    user.value.username = editedUser.value.username;
    user.value.bio = editedUser.value.bio;
    user.value.avatar = editedUser.value.avatar;

    const data = {
        userAvatar: user.value.avatar,
        userName: user.value.username,
        userProfile: user.value.bio
    }
    UserApi.updateUserInfo(data).then((res) => {
        if (res.data === true) {
            layer.msg("更新成功", {icon: 1, time: 1000})
        } else {
            layer.msg("更新失败", {icon: 5, time: 1000})
        }
    });
    editFormVisible.value = false;
};
const cancelEdit = () => {
    editedUser.value.username = '';
    editedUser.value.bio = '';
    editedUser.value.avatar = '';
    editFormVisible.value = false;
};

const handleUploadSuccess = (url) => {
    console.log("我是上传组件来的：" + url)
    editedUser.value.avatar = url;
};

const fetch_user = async () => {
    UserApi.getUserInfo(user_id).then((res) => {
        user.value = res.data;
    });
};
const fetch_note = () => {
    NoteApi.getMyNoteList({data: search}).then((res) => {
        user.value.latestArticles = res.data.records.map((note) => {
            return {
                id: note.id,
                title: note.title,
                date: formatTime(note.createTime), // Assuming there is a createTime property in your note object
            };
        });
    });
};
const delete_note = (id) => {
    NoteApi.deleteNoteById({id: id}).then((res) => {
        if (res.data === true) {
            layer.msg("删除成功", {icon: 1, time: 1000})
            fetch_note();
        } else {
            layer.msg("删除失败", {icon: 5, time: 1000})
        }
    });
};

const formatTime = (time) => {
    const parsedDate = new Date(time);
    const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')} ${parsedDate.getHours().toString().padStart(2, '0')}:${parsedDate.getMinutes().toString().padStart(2, '0')}:${parsedDate.getSeconds().toString().padStart(2, '0')}`;
    return formattedDate;
};

const fetch_post = () => {
    PostApi.getMyPostList({data: search}).then((res) => {
        user.value.articles = res.data.records.length;
        //遍历帖子列表，获取喜欢数
        let thumbNum = 0;
        res.data.records.forEach((item) => {
            thumbNum += item.thumbNum;
        })
        user.value.favours = thumbNum;
    });
};
const mark_note = (id) => {
    // 在本地存储中模拟标记，使用文章的id作为键
    const markedArticles = JSON.parse(localStorage.getItem('markedArticles')) || [];

    if (!markedArticles.includes(id)) {
        markedArticles.push(id);
        localStorage.setItem('markedArticles', JSON.stringify(markedArticles));
        fetch_note();
        layer.msg("标记成功", {icon: 1, time: 1000});
    } else {
        layer.msg("文章已标记", {icon: 4, time: 1000});
    }
};

const isArticleMarked = (id) => {
    // 判断文章是否已被标记
    const markedArticles = JSON.parse(localStorage.getItem('markedArticles')) || [];
    return markedArticles.includes(id);
};
const route_note = () => {
    router.push({path: '/note'});
};
const randomColor = () => {
    // 随机选择颜色的函数
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex];
};

onMounted(async () => {
    if (isLoggedIn === false) {
        console.log("未登录");
        user.value = {
            username: '未登录',
            avatar: '',
            bio: '在编程的路上，不停探索。',
            articles: 0,
            favours: 0,
            times: 0,
            latestArticles: [],
        }
    } else {
        await fetch_user();
        await fetch_post();
        await fetch_note();
    }
    {
        user
    }
});


</script>

<style scoped>
.juejin-profile {
    max-width: 1000px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px; /* 增加底边距，提高整体与下方内容的间距 */
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
}

.header-content {
    flex: 1; /* 让内容区域占满剩余空间 */
}

h2 {
    margin: 0;
    font-size: 1.5rem; /* 调整用户名字体大小 */
}

.bio {
    color: #666;
    margin-left: 100px;
    margin-top: -10px; /* 增加底边距，提高用户名和简介的间距 */
}

.tag {
    position: absolute;
    margin-left: 20px   ; /* 增加上边距，提高简介和标签的间距 */
    margin-top: 200px; /* 增加上边距，提高简介和标签的间距 */
}





.profile-stats {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.stat-item {
    text-align: center;
}

.count {
    font-size: 1.5rem;
    font-weight: bold;
}

.label {
    color: #666;
}

.profile-content {
    margin-top: 20px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
}

.date {
    color: #999;
    margin-left: 10px;
}

.articles-card {
    margin-top: 20px;
}

.article-card {
    /*上下分割线*/
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 100%;
    margin: 0 auto;
    padding: 6px;
    background-color: #fff;
    transition: box-shadow 0.3s;
}


.article-info {
    flex: 1;
}

.article-title {
    font-size: 1.2rem;
}

.date {
    color: #999;
    margin-top: 8px;
}

.article-actions {
    display: flex;
    align-items: center;
}

.edit-icon,
.delete-icon {
    cursor: pointer;
    margin-right: 8px;
    font-size: 0.8rem;
    color: #165DFF;
}

.delete-icon {
    color: #ff4d4f;
}

.marked {
    color: #ff9900; /* 标记状态的颜色 */
    font-weight: bold; /* 或其他样式表示标记状态 */
}

</style>
