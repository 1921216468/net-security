<template>
    <div class="note-container">
        <!-- 编辑区域 -->
        <div class="note-editor">
            <h3 class="editor-title">编辑笔记</h3>
            <!-- 标题输入框 -->
            <input v-model="noteTitle" class="editor-input" placeholder="在此输入标题">

            <!-- Markdown 编辑框 -->
            <textarea v-model="noteContent" class="editor-textarea" placeholder="在此输入您的笔记"></textarea>
<!--            保存和重置按钮-->
            <div class="editor-actions">
                <lay-button type="primary" class="save-button" @click="save_note" v-if="edit_login === false">保存</lay-button>
                <lay-button type="primary" class="save-button" @click="save_edit_note" v-else="edit_login === true">更新</lay-button>
                <lay-button class="reset-button" @click="reset_note">重置</lay-button>
            </div>
        </div>

        <!-- 预览区域 -->
        <div class="note-preview">
            <h3 class="preview-title">预览效果</h3>
            <!-- 预览标题输入框 -->
            <input v-model="previewTitle" class="preview-input" placeholder="预览标题" disabled>

            <div class="preview-content">
                <div style="width: 900px" v-html="compiledMarkdown"></div>
            </div>
        </div>

        <!-- 笔记列表区 -->
        <div class="note-list">
            <div class="articles-card">
                <h3 class="list-title">笔记列表</h3>
                <ul>
                    <li v-for="article in user.latestArticles" :key="article.id">
                        <div class="article-card">
                            <div class="article-info">
                                <span class="article-title">{{ article.title }}</span>
                                <span class="date">{{ article.date }}</span>
                            </div>
                            <div class="article-actions">
                                <span class="edit-icon" @click="edit_note(article.id)">✏️ 编辑</span>
                                <span class="delete-icon" @click="delete_note(article.id)">🗑️ 删除</span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script setup>
import {ref, onMounted, watchEffect} from 'vue';
import {marked} from 'marked';

import {UserApi} from "../../servie/UserApi.ts";
import {NoteApi} from "../../servie/NoteApi.ts";
/**从localStorage中获取用户信息*/
const user_store = JSON.parse(localStorage.getItem('user') || '{}');
const user_id = user_store.user.id;
const search = {pageSize:500};

const noteTitle = ref('');
const noteContent = ref('');
const previewTitle = ref('');
const edit_id = ref('')
const compiledMarkdown = ref('');
let edit_login = false;

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

const fetch_user = async () => {
    UserApi.getUserInfo(user_id).then((res) => {
        user.value = res.data;
    });
};
/**获取笔记列表*/
const fetch_note = () => {
    NoteApi.getMyNoteList({ data: search }).then((res) => {
        user.value.latestArticles = res.data.records.map((note) => {
            return {
                id: note.id,
                title: note.title,
                date: formatTime(note.createTime), // Assuming there is a createTime property in your note object
            };
        });
    });
    console.log(user.value.latestArticles);
};

const save_note = () => {
    NoteApi.createNote({
        title: noteTitle.value,
        content: noteContent.value,
        img: '',
        tags:[]
    }).then((res) => {
        layer.msg('保存成功');
        fetch_note();
    });
    noteTitle.value = '';
    noteContent.value = '';
};

const delete_note = (id) => {
    NoteApi.deleteNoteById({id:id}).then((res) => {
        if (res.data === true) {
            layer.msg("删除成功", { icon : 1, time: 1000})
            fetch_note();
        }
        else {
            layer.msg("删除失败", { icon : 5, time: 1000})
        }
    });
};

const reset_note = () => {
    noteTitle.value = '';
    noteContent.value = '';
};
const formatTime = (time) => {
    const parsedDate = new Date(time);
    const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')} ${parsedDate.getHours().toString().padStart(2, '0')}:${parsedDate.getMinutes().toString().padStart(2, '0')}:${parsedDate.getSeconds().toString().padStart(2, '0')}`;
    return formattedDate;
};

const edit_note = (id) => {
    edit_login = true;
    edit_id.value = id;
    NoteApi.getNoteById({id:id}).then((res) => {
        console.log(res.data);
        noteTitle.value = res.data.title;
        noteContent.value = res.data.content;
    });
};
const save_edit_note = () => {
    NoteApi.updateNoteById({
        id: edit_id.value,
        title: noteTitle.value,
        content: noteContent.value,
        img: '',
        tags:[]
    }).then((res) => {
        layer.msg('更新成功');
        fetch_note();
        edit_login = false;

    });
    noteTitle.value = '';
    noteContent.value = '';
};


onMounted(() => {
    fetch_user();
    fetch_note();
    // 初始化 marked 配置，可根据需求添加其他配置项
    marked.setOptions({
        gfm: true,
        breaks: true,
        sanitize: true,
    });
    // 监听 noteContent 和 noteTitle 的变化，实时更新 compiledMarkdown 和 previewTitle
    watchEffect(() => {
        compiledMarkdown.value = marked(noteContent.value);
        previewTitle.value = noteTitle.value;
    });
});

</script>

<style scoped>
.note-container {
    /*!*绝对固定*!*/
    /*position: absolute;*/
    display: flex;
    justify-content: space-between;
    max-width: 2000px;
    margin: 20px auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.note-preview {
    flex: 1;
    margin-right: 40px; /* 调整两边的间距 */
    padding: 20px;
    border-radius: 8px;
    height: 800px;
}

.editor-title,
.preview-title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.editor-input,
.preview-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 1.2rem;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.editor-textarea {
    width: 100%;
    height: calc(100% - 50px); /* 调整高度，保留空间给标题输入框 */
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.preview-content {
    max-height: 100%;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 10px;
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
.note-list {
    flex: 1;
    margin-left: 40px; /* 调整与预览区域的间距 */
}

.list-title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.note-editor {
    flex: 1; /* 调整编辑区域宽度 */
    margin-right: 40px; /* 调整两边的间距 */
    padding: 20px;
    border-radius: 8px;
    height: 800px;
}

</style>
