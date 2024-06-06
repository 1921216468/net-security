<template>
    <div>
        <lay-card style="margin: 10px">
            <p class="title">上传课程</p>
        </lay-card>
        <div class="video">
        <lay-container :fluid="true" style="padding: 10px; padding-top: 0px">
            <lay-card style="padding: 40px">
                <lay-row>
                    <lay-col :md="10" :md-offset="7">
                        <lay-form :model="model">
                            <lay-form-item label="课程标题" prop="title">
                                <lay-input v-model="model.title" type="text"></lay-input>
                            </lay-form-item>
                            <lay-form-item label="上传视频/封面" prop="file">
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
                            </lay-form-item>
                            <lay-form-item label="课程简介" prop="content">
                                <lay-textarea
                                    placeholder="请输入描述"
                                    v-model="model.content"
                                ></lay-textarea>
                            </lay-form-item>
<!--                            <lay-form-item label="上传附件">-->
                                <div class="file-upload-container">
                                    <label for="fileInput" class="file-input-label">
                                        <input id="fileInput" type="file" ref="fileInput" @change="handleFileFileChange" multiple />
                                        选择文件
                                    </label>
                                    <div v-for="(file, index) in fileList" :key="index" class="file-preview">
                                        <span>{{ file.title }}</span>
                                        <lay-button size="xs" border="green" @click="downloadFile(file)">下载</lay-button>
                                        <lay-button size="xs" border="red" @click="clearFile(index)">删除</lay-button>
                                    </div>
                                </div>
<!--                            </lay-form-item>-->
                            <lay-form-item>
                                <lay-row :space="20">
                                    <lay-col :md="12">
                                        <lay-button :fluid="true" @click="submitClick" type="primary"
                                        >更新</lay-button
                                        >
                                    </lay-col>
                                    <lay-col :md="12">
                                        <lay-button :fluid="true" @click="reset">重置</lay-button>
                                    </lay-col>
                                </lay-row>
                            </lay-form-item>
                        </lay-form>
                    </lay-col>
                    <lay-col>

                    </lay-col>
                </lay-row>
            </lay-card>
        </lay-container>
            <lay-container>

            </lay-container>
        </div>

    </div>
</template>

<script lang="ts">
import {onMounted, ref} from 'vue'
import { layer } from '@layui/layer-vue'
import { useRouter, useRoute } from 'vue-router'
import UploadFile from "./UploadFile.vue";
import {FileApi} from "../../../servie/FileApi.ts";
import {LessonApi} from "../../../servie/LessonApi.ts";
import {uploadFileApi} from "../../../api/file/uploadApi.ts";
import {router} from "../../../router";

export default {
    components: {
        UploadFile
    },
    setup() {
        const fileInput = ref(null);
        const videoUrl = ref('');
        const coverUrl = ref('');
        const route = useRoute()
        const isAdd = ref(true)
        const o_fileList = ref([]);

        const model = ref({
            content: "",
            file: "",
            img: "",
            tags: [],
            title: ""
        })
        let fileList = ref([]);


        const submitClick = () => {
                LessonApi.updateLessonById({
                    id: route.query.id,
                    content: model.value.content,
                    file: videoUrl.value,
                    img: coverUrl.value,
                    tags: [],
                    title: model.value.title
                }).then(async (res) => {
                    console.log(fileList);
                    // 上传文件
                        layer.msg('更新成功');
                })


        }


        const handleFileFileChange = async (index, event) => {
            console.log(fileInput.value.files);
            const files = fileInput.value.files;
            console.log(fileInput.value.files);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const uploadedUrl = file_upload(file, i);
                if (fileList.value == null) {
                    fileList.value = [];
                } else {
                    console.log("设置值------------------");
                    fileList.value.push({
                        title: file.name,
                        url: uploadedUrl,
                    })
                    console.log(fileList.value);
                }
            }
        };
        const file_upload = async (file, id) => {
            let url = '';
            const formData = new FormData();
            formData.append('file', file.file);
            formData.append('lessonId', id);
            try {
                // 调用上传文件的 API
                const res = await uploadFileApi(file);
                console.log(res.data);
                url = res.data.data;

                for (let i = 0; i < fileList.value.length; i++) {
                    console.log(fileList.value[i]);
                    const file = fileList.value[i];
                    // 等待Promise解决
                    const url = await file.url;
                    FileApi.createFile({
                        lessonId: route.query.id,
                        title: file.title,
                        url: url
                    }).then((res) => {
                        layer.msg('上传成功');
                    });
                }
                layer.msg('文件上传成功');
            } catch (error) {
                console.error('文件上传失败', error);
                layer.msg('文件上传失败');
            }
            return url;
        };

        const downloadFile = (file) => {
            //真实下载
            window.open(file.url);
            console.log('下载文件:', file.name);
        };


// 清除文件的函数中
        const clearFile = async (index) => {
            try {
                console.log("删除文件");
                console.log(index);
                if (isAdd.value == true) {
                    fileList.value.splice(index, 1);
                } else {
                    const file = fileList.value[index];
                    console.log(file);
                    FileApi.deleteFileById({id: file.id}).then((res) => {
                        layer.msg('Success', {icon: 1}, () => {
                            fileList.value.splice(index, 1);
                        })
                    })
                }

                layer.msg('文件删除成功');
            } catch (error) {
                console.error('文件删除失败', error);
                layer.msg('文件删除失败');
            }
        };

//handleUploadSuccess
        const fetch_lesson = async () => {
            isAdd.value = false;
            LessonApi.getLessonById(route.query.id).then((res) => {
                model.value = res.data;
                fileList.value = res.data.fileList;
                o_fileList.value = res.data.fileList;
                coverUrl.value = res.data.img;
                videoUrl.value = res.data.file;
            })
        }

        const reset = () => {
            model.value.content = "";
            model.value.file = "";
            model.value.img = "";
            model.value.tags = [];
            model.value.title = "";
        }
        onMounted(() => {
            fetch_lesson();
        })

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

        return {
            model,
            submitClick,
            reset,
            fileInput,
            handleVideoChange,
            handleCoverChange,
            clearVideo,
            clearCover,
            handleFileFileChange,
            fileList,
            clearFile,
            downloadFile,
            videoUrl,
            coverUrl
        }

    }}
</script>

<style scoped>
.title {
    font-size: 20px;
    font-weight: 500;
    margin-top: 12px;
    margin-bottom: 20px;
}

.describe {
    font-size: 14px;
    margin-bottom: 12px;
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
