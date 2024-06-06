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
                                    <UploadFile v-model="model.file" @upload-success="handleUploadSuccess"/>
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
                                            >提交</lay-button
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
import { ref } from 'vue'
import { layer } from '@layui/layer-vue'
import { useRouter, useRoute } from 'vue-router'
import UploadFile from "./UploadFile.vue";
import {FileApi} from "../../../servie/FileApi.ts";
import {LessonApi} from "../../../servie/LessonApi.ts";
import {uploadFileApi} from "../../../api/file/uploadApi.ts";

export default {
    components: { UploadFile },
    setup() {
        const route = useRoute()
        const router = useRouter()

        const model = ref({
            content: "",
            file: "",
            img: "",
            tags: [],
            title: ""
        })
        let fileList = ref([]);


        const submitClick =  () => {
            console.log("我是新增");
            LessonApi.createLesson({
                content: model.value.content,
                file: model.value.file,
                img: model.value.img,
                tags: [],
                title: model.value.title
            }).then(async (res) => {
                console.log(fileList);
                layer.msg('上传成功');
                //拿到id
                const id = res.data;
                console.log(id);
                console.log(res.data);
                // 上传文件
// 上传文件
                for (let i = 0; i < fileList.value.length; i++) {
                    console.log(fileList.value[i]);
                    const file = fileList.value[i];
                    // 等待Promise解决
                    const url = await file.url;
                    FileApi.createFile({
                        lessonId: id,
                        title: file.title,
                        url: url
                    }).then((res) => {
                        layer.msg('上传成功');
                    });
                }
            });

        }
        const fileInput = ref(null);

        const handleFileFileChange = async (index, event) => {
            const files = fileInput.value.files;
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
                console.log("删除文件" );
                console.log(index );
                fileList.value.splice(index, 1);

                layer.msg('文件删除成功');
            } catch (error) {
                console.error('文件删除失败', error);
                layer.msg('文件删除失败');
            }
        };

//handleUploadSuccess
        const  handleUploadSuccess = (url) => {
            model.value.file = url.videoUrl;
            model.value.img = url.coverUrl;
        };

        const reset = () => {
            model.value.content = "";
            model.value.file = "";
            model.value.img = "";
            model.value.tags = [];
            model.value.title = "";
        }
        return {
            model,
            submitClick,
            route,
            clearFile,
            downloadFile,
            handleFileFileChange,
            fileInput,
            fileList,
            reset,
            handleUploadSuccess
        }
    }
}
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
</style>
