<template>
    <div class="video-upload">
        <!-- 视频上传部分 -->
        <label for="video-input" class="video-container">
            <div v-if="!videoUrl" class="upload-icon">
                <i class="layui-icon layui-icon-add-circle"></i>
            </div>
            <video v-else :src="videoUrl" class="video-preview" controls></video>
        </label>
        <input
            type="file"
            id="video-input"
            accept="video/*"
            @change="handleVideoChange"
            style="display: none"
        />
        <button v-if="videoUrl" class="clear-button" @click="clearVideo">
            <i class="layui-icon layui-icon-close"></i>
        </button>

        <!-- 封面图上传部分 -->
        <label for="cover-input" class="video-container">
            <div v-if="!coverUrl" class="upload-icon">
                <i class="layui-icon layui-icon-add-circle"></i>
            </div>
            <img v-else :src="coverUrl" alt="cover" class="video-preview" />
        </label>
        <input
            type="file"
            id="cover-input"
            accept="image/*"
            @change="handleCoverChange"
            style="display: none"
        />
        <button v-if="coverUrl" class="clear-button" @click="clearCover">
            <i class="layui-icon layui-icon-close"></i>
        </button>
    </div>
</template>

<script setup>
const emit = defineEmits(['change', 'delete']);
import { ref } from 'vue';
import { uploadFileApi } from '../../../api/file/uploadApi.ts';

const videoUrl = ref('');
const coverUrl = ref('');

const uploadVideo = (file) => {
    return new Promise((resolve, reject) => {
        // 调用上传视频的函数
        uploadFileApi(file)
            .then((res) => {
                videoUrl.value = res.data.data;
                console.log('uploadVideo:' + videoUrl.value);
                layer.msg('上传成功');
                resolve(videoUrl.value); // 传递 videoUrl.value
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const uploadCover = (file) => {
    return new Promise((resolve, reject) => {
        // 调用上传封面图的函数
        uploadFileApi(file)
            .then((res) => {
                coverUrl.value = res.data.data;
                console.log('uploadCover:' + coverUrl.value);
                layer.msg('上传成功');
                resolve(coverUrl.value); // 传递 coverUrl.value
            })
            .catch((error) => {
                reject(error);
            });
    });
};

async function handleVideoChange(event) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        try {
            // 处理上传视频逻辑，这里可以调用上传视频的函数
            const uploadedUrl = await uploadVideo(file);
            console.log('传递' + uploadedUrl);
            // 触发自定义事件，将返回的 URL 传递给父组件
            emit('upload-success', { videoUrl: uploadedUrl, coverUrl: coverUrl.value });
        } catch (error) {
            console.error('上传失败', error);
        }
    }
}

async function handleCoverChange(event) {
    const input = event.target;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        try {
            // 处理上传封面图逻辑，这里可以调用上传封面图的函数
            const uploadedUrl = await uploadCover(file);
            console.log('传递' + uploadedUrl);
            // 触发自定义事件，将返回的 URL 传递给父组件
            emit('upload-success', { videoUrl: videoUrl.value, coverUrl: uploadedUrl });
        } catch (error) {
            console.error('上传失败', error);
        }
    }
}

function clearVideo() {
    videoUrl.value = '';
}

function clearCover() {
    coverUrl.value = '';
}
</script>

<style scoped>
.video-upload {
    display: flex;
}

.video-container {
    width: 300px; /* 调整为适当的宽度 */
    height: 200px; /* 调整为适当的高度 */
    border: 2px dashed #e2e2e2;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    margin-right: 20px; /* 调整为适当的间距 */
}

.upload-icon {
    font-size: 30px;
    color: #5fb878;
}

.video-preview {
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
