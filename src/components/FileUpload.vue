<template>
    <div class="file-upload-container">
        <label for="fileInput" class="file-input-label">
            <input id="fileInput" type="file" ref="fileInput" @change="handleFileChange" multiple />
            选择文件
        </label>
        <div v-for="(file, index) in uploadedFiles" :key="index" class="file-preview">
            <span>{{ file.name }}</span>
            <img :src="getFileIcon(file.type)" alt="File Icon" />
            <button @click="downloadFile(file)">下载</button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const fileInput = ref(null);
        const uploadedFiles = ref([]);

        const handleFileChange = () => {
            const files = fileInput.value.files;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                uploadedFiles.value.push({
                    name: file.name,
                    type: file.type,
                });
            }

            // 清空文件选择框，以便下一次选择
            fileInput.value.value = '';
        };

        const getFileIcon = (fileType) => {
            // 根据文件类型返回对应图标路径，这里需要根据具体文件类型添加判断
            // 例如：word、excel等
            // 返回对应图标路径
            return 'path/to/icon.png';
        };

        const downloadFile = (file) => {
            // 模拟下载，你需要根据实际需求处理文件下载
            console.log('下载文件:', file.name);
        };

        return {
            fileInput,
            uploadedFiles,
            handleFileChange,
            getFileIcon,
            downloadFile,
        };
    },
};
</script>

<style scoped>
/* 容器样式 */
.file-upload-container {
    max-width: 400px;
    margin: 20px auto;
}

/* 文件选择样式 */
.file-input-label {
    display: block;
    padding: 10px;
    background-color: #3498db;
    color: #fff;
    text-align: center;
    cursor: pointer;
}

.file-input-label input {
    display: none;
}

/* 文件预览样式 */
.file-preview {
    margin-top: 10px;
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;

}

.file-preview img {
    width: 20px;
    height: 20px;
    margin-left: 10px;
}

.file-preview button {
    margin-left: auto;
    padding: 5px 10px;
    background-color: #2ecc71;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.file-preview button:hover {
    background-color: #27ae60;
}
</style>
