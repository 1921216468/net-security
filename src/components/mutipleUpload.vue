<template>
    <h1>{{props.imageList}}</h1>
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
</template>

<script setup>
import { reactive,onMounted } from 'vue';
import { uploadFileApi } from "../api/file/uploadApi.ts";
const emit = defineEmits([ 'upload-many-success'])
const props = defineProps(['imageList'])

const imageList = reactive(props.imageList);
// const imageList = reactive([ { "url": "http://192.168.8.2:8101/api/file/724359d7-7a0d-44ae-83bf-37af3b6ef9c7.png" }, { "url": "http://192.168.8.2:8101/api/file/cab8d02a-0bd0-4f6f-9157-204c099412c8.png" }, { "url": "http://192.168.8.2:8101/api/file/dab6314a-8a53-4d3a-8656-0fc41ff5e987.png" }, { "url": "http://192.168.8.2:8101/api/file/738a0282-d1f3-48fd-83f0-f2fc7f2bb793.png" }, { "url": "" } ]);

const uploadFile = async (file, index) => {
    try {
        const res = await uploadFileApi(file);
        const uploadedUrl = res.data.data;
        imageList[index].url = uploadedUrl;
        // 使用 push 方法添加新元素
        if (!imageList[index + 1] && uploadedUrl !== '') {
            imageList.push({ url: '' });
        }
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
            emit('upload-many-success', uploadedUrl);
        } catch (error) {
            console.error('上传失败', error);
        }
    }
};

onMounted(() => {
        console.log("编辑文章页面给我传来：=============" );
    props.imageList

    console.log("编辑文章页面给我传来：============" );

});

const clearImage = (index) => {
    imageList.splice(index, 1);
};
</script>


<style scoped>
.photo-wall {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.avatar-upload {
    position: relative;
    width: 120px;
    height: 120px;
    border: 2px dashed #e2e2e2;
    border-radius: 4px;
    overflow: hidden;
}

.avatar-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
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
