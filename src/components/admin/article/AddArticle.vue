<template>
    <div class="note-container">
        <!-- 编辑区域 -->
        <div class="note-editor">
            <h3 class="editor-title">编辑笔记</h3>
            <!-- 标题输入框 -->
            <input v-model="article.title" class="editor-input" placeholder="在此输入标题">

            <!-- Markdown 编辑框 -->
            <textarea v-model="article.content" class="editor-textarea" placeholder="在此输入您的笔记"></textarea>
            <!--            保存和重置按钮-->
            <div class="editor-actions">
                <lay-button type="primary" class="save-button" @click="save_note">保存</lay-button>
                <lay-button class="reset-button" @click="reset_note">重置</lay-button>
            </div>
        </div>

        <!-- 上传文件 图片-->
        <div class="note-list">
            <div class="articles-card">
                <h3 class="list-title">上传图片</h3>
                <div class="photo-wall">
                    <div v-for="(image, index) in imageList" :key="index" class="avatar-upload">
                        <label :for="'avatar-input-' + index" class="avatar-container">
                            <div v-if="!image.url" class="upload-icon">
                                <i class="layui-icon layui-icon-add-circle"></i>
                            </div>
                            <img v-else :src="image.url" alt="avatar" class="avatar-image" />
                        </label>
                        <input
                                :id="'avatar-input-' + index"
                                type="file"
                                accept="image/*"
                                @change="handleFileChange(index, $event)"
                                style="display: none"
                        />
                        <button v-if="image.url" class="clear-button" @click="clearImage(index)">
                            <i class="layui-icon layui-icon-close"></i>
                        </button>
                    </div>
                </div>
<!--                &lt;!&ndash;上传附件区&ndash;&gt;<br />-->
<!--                <h3 class="list-title">上传附件</h3>-->
<!--                <div class="file-upload-container">-->
<!--                    <label for="fileInput" class="file-input-label">-->
<!--                        <input id="fileInput" type="file" ref="fileInput" @change="handleFileFileChange" multiple />-->
<!--                        选择文件-->
<!--                    </label>-->
<!--                    <div v-for="(file, index) in fileList" :key="index" class="file-preview">-->
<!--                        <span>{{ file.title }}</span>-->
<!--                        <lay-button  border="green" @click="downloadFile(file)">下载</lay-button>-->
<!--                        <lay-button  border="red" @click="clearFile(index)">删除</lay-button>-->
<!--                    </div>-->
<!--                </div>-->
            </div>
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
</template>

<script setup>
import { ref, reactive, watchEffect } from "vue";
import { marked } from "marked";

import { ArticleApi } from "../../../servie/Article.ts";
import { FileApi } from "../../../servie/FileApi.ts";
import { uploadFileApi } from "../../../api/file/uploadApi.ts";
import {router} from "../../../router/index.ts";

const previewTitle = ref("");
const compiledMarkdown = ref("");
let imageList = reactive([{ url: ""}]);
let fileList = ref([]);
const article = ref({
    id: "",
    title: "",
    content: "",
    img: "",
    file: "",
    tags: [],
});


/**---------------------------------图片上传相关------------------------------*/

const save_note = () => {
    ArticleApi.createArticle({
        title: article.value.title,
        content: article.value.content,
        img: article.value.img,
        file: article.value.file,
        tags:[]
    }).then((res) => {
        layer.msg('更新成功');
    });
    router.push('/admin/system-management/sub-2')
    reset_note()
}




const uploadFile = async (file, index) => {
    try {
        if (imageList.length > 9) {
            // 删除最后一个元素
            layer.msg('最多上传9张图片');
            return;
        }
        const res = await uploadFileApi(file);
        const uploadedUrl = res.data.data;
        imageList[index].url = uploadedUrl;
        // 使用 push 方法添加新元素
        if (!imageList[index + 1] && uploadedUrl !== '') {
            imageList.push({ url: '' });
        }

        if (article.value.img === '') {
            article.value.img = uploadedUrl
        } else {
            article.value.img = article.value.img + ',' + uploadedUrl
        }
        layer.msg('上传成功');
        return uploadedUrl;
    } catch (error) {
        console.error('上传失败', error);
        throw error;
    }
};

const handleFileChange = async (index, event) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];

        // 初始化数组元素，确保存在
        if (!imageList[index]) {
            imageList[index] = { url: '' };
        }

        try {
            const uploadedUrl = await uploadFile(file, index);
        } catch (error) {
            console.error('上传失败', error);
        }
    }
};
const clearImage = async (index) => {
    try {
        // 如果删除数据库中的图片成功，再从 imageList 中移除相应的图片
        imageList.splice(index, 1);
        // 更新数据库中的图片 URL 字符串
        updateDatabaseWithNewImageList();

        layer.msg('图片删除成功');
    } catch (error) {
        console.error('图片删除失败', error);
        layer.msg('图片删除失败');
    }
};

// 更新数据库中的图片 URL 字符串的逻辑
const updateDatabaseWithNewImageList = () => {
    // 过滤掉空的图片 URL
    const nonEmptyImageList = imageList.filter(item => item.url !== "");
    // 将 imageList 中的图片 URL 拼接成字符串
    const updatedImageListString = nonEmptyImageList.map(item => item.url).join(',');
    article.value.img = updatedImageListString;
};

/**---------------------------------图片上传相关------------------------------*/


/**---------------------------------文件上传相关------------------------------*/

const fileInput = ref(null);

const handleFileFileChange = () => {
    const files = fileInput.value.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = file_upload(file, i);
        if (fileList.value == null) {
            fileList.value = [];
        } else {
            console.log("设置值------------------");
            fileList.value.push({
                name: file.name,
                url: uploadedUrl,
            })
            console.log(fileList.value);

        }
    }
};

const downloadFile = (file) => {
    // 模拟下载，你需要根据实际需求处理文件下载
    console.log('下载文件:', file.name);
};

// 在 setup 函数中

// 在文件上传的函数中
const file_upload = async (file, index) => {
    try {
        const res = await uploadFileApi(file);
        const uploadedUrl = res.data.data;
        if (article.value.file === '') {
            article.value.file = uploadedUrl;
        } else {
            article.value.file = article.value.file + ',' + uploadedUrl;
        }
        layer.msg('上传成功');
        if (fileList.value == null) {
            fileList.value = [];
        }
        // 将文件信息添加到 fileList
        fileList.value.push({
            name: file.name,
            url: uploadedUrl,
        });
        FileApi.createFile({
            lessonId: article.value.id,
            title: file.name,
            url: uploadedUrl,
        }).then((res) => {
            layer.msg('更新成功');

        });

        return uploadedUrl;
    } catch (error) {
        console.error('上传失败', error);
        throw error;
    }
};

// 清除文件的函数中
const clearFile = async (index) => {
    try {
        console.log("删除文件" );
        console.log(index );
        const  id = fileList.value[index].id;

        // 调用更新数据库中文件 URL 字符串的 API
        FileApi.deleteFileById({
            id: id,
        }).then((res) => {});

        layer.msg('文件删除成功');
    } catch (error) {
        console.error('文件删除失败', error);
        layer.msg('文件删除失败');
    }
};


/**---------------------------------文件上传相关------------------------------*/

const reset_note = () => {
    article.value  = {
        title: '',
        content: '',
        img: '',
        file: '',
        tags: [],
    };
};

watchEffect(() => {
    compiledMarkdown.value = marked(article.value.content);
    previewTitle.value = article.value.title;
});
</script>

<style scoped>
/* 响应式设计 */
.note-container {
    display: flex;
    flex-wrap: wrap;
}

.note-editor {
    flex: 2;
    box-sizing: border-box;
    padding: 20px;
}
.note-list {
    flex: 1;
    box-sizing: border-box;
}
/*.note-preview {*/
/*    flex: 1;*/
/*    box-sizing: border-box;*/
/*}*/

/* 编辑区域样式 */
.note-editor {
    padding: 20px;
}

.editor-title {
    font-size: 20px;
    margin-bottom: 10px;
}

.editor-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
}
.editor-textarea {
    width: 100%;
    height: 600px;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

.editor-actions {
    margin-top: 10px;
}

/* 上传图片和文件样式 */
.note-list {
    margin-top: 20px;
}

.list-title {
    font-size: 18px;
    margin-bottom: 10px;
}

.photo-wall {
    display: flex;
    flex-wrap: wrap;
}

.avatar-upload {
    margin-right: 10px;
    margin-bottom: 10px;
}

.avatar-container {
    position: relative;
    display: block;
    width: 100px;
    height: 100px;
    overflow: hidden;
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.clear-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid #ccc;
    cursor: pointer;
}

.file-upload-container {
    max-width: 600px;
    margin: 20px auto;
}

.file-input-label {
    display: inline-block;
    padding: 10px;
    background-color: #16baaa;
    color: #fff;
    cursor: pointer;
    text-align: center;

}

.file-preview {
    margin-top: 10px;
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.file-input-label input {
    display: none;
}
.file-preview button {
    margin-left: auto;
}

/* 预览区域样式 */
.note-preview {
    flex: 1;
    margin-left: 20px;
    padding: 20px;
    background-color: #f8f8f8;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow-y: auto; /* 允许垂直滚动 */
    max-height: 1000px; /* 设置最大高度，适应内容超过时可以滚动 */
}

.preview-title {
    font-size: 22px;
    color: #333;
    margin-bottom: 10px;
}

.preview-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.preview-content {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}

/* 示例内容的样式，你可以根据需要修改 */
.preview-content div {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

/* 示例内容中的文本样式 */
.preview-content p {
    font-size: 16px;
    line-height: 1.5;
    color: #333;
}

/* 示例内容中的标题样式 */
.preview-content h1,
.preview-content h2,
.preview-content h3,
.preview-content h4,
.preview-content h5,
.preview-content h6 {
    color: #007bff;
}

/* 示例内容中的链接样式 */
.preview-content a {
    color: #007bff;
}

/* 示例内容中的列表样式 */
.preview-content ul,
.preview-content ol {
    margin-left: 20px;
}

/* 示例内容中的列表项样式 */
.preview-content li {
    margin-bottom: 8px;
}



</style>
