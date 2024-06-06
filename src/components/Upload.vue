<template>
    <div class="avatar-upload">
        <label for="avatar-input" class="avatar-container">
            <div v-if="!imageUrl" class="upload-icon">
                <i class="layui-icon layui-icon-add-circle"></i>
            </div>
            <img v-else :src="imageUrl" alt="avatar" class="avatar-image"/>
        </label>
        <input
                type="file"
                id="avatar-input"
                accept="image/*"
                @change="handleFileChange"
                style="display: none"
        />
        <button v-if="imageUrl" class="clear-button" @click="clearImage">
            <i class="layui-icon layui-icon-close"></i>
        </button>
    </div>
</template>

<script setup>
const emit = defineEmits(['change', 'delete'])
import {ref} from 'vue';
import {uploadFileApi} from "../api/file/uploadApi.ts";

const imageUrl = ref('');

const uploadFile = file => {
    return new Promise((resolve, reject) => {
        // 调用上传文件的函数
        uploadFileApi(file).then(res => {
            imageUrl.value = res.data.data;
            console.log("uploadFile:" + imageUrl.value);
            layer.msg('上传成功');
            resolve(imageUrl.value); // 传递 imageUrl.value
        }).catch(error => {
            reject(error);
        });
    });
};

async function handleFileChange(event) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        try {
            // 处理上传逻辑，这里可以调用上传文件的函数
            const uploadedUrl = await uploadFile(file);
            console.log('传递' + uploadedUrl);
            // 触发自定义事件，将返回的 URL 传递给父组件
            emit('upload-success', uploadedUrl);
        } catch (error) {
            console.error('上传失败', error);
        }
    }
}


function clearImage() {
    imageUrl.value = '';
}
</script>

<style scoped>
.avatar-upload {
    position: relative;
}

.avatar-container {
    width: 120px;
    height: 120px;
    border: 2px dashed #e2e2e2;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.upload-icon {
    font-size: 30px;
    color: #5FB878;
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
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 50%;
}
</style>
