<template>
    <div>
        <lay-card style="margin: 10px">
            <p class="title">上传轮播图</p>
            <p class="describe">
            </p>
        </lay-card>
        <lay-container :fluid="true" style="padding: 10px; padding-top: 0px">
            <lay-card style="padding: 40px">
                <lay-row>
                    <lay-col :md="10" :md-offset="7">
                        <lay-form :model="model">
                            <lay-form-item label="填写标题" prop="title">
                                <lay-input v-model="model.title"></lay-input>
                            </lay-form-item>
                            <!--                            上传图片组件-->
                            <lay-form-item label="上传图片" prop="img">
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
                            </lay-form-item>
                            <lay-form-item>
                                <lay-row :space="20">
                                    <lay-col :md="12">
                                        <lay-button
                                            :fluid="true"
                                            @click="submitClick"
                                            type="primary"
                                        >提交</lay-button
                                        >
                                    </lay-col>
                                    <lay-col :md="12">
                                        <lay-button :fluid="true" @click="reset"
                                        >重置</lay-button
                                        >
                                    </lay-col>
                                </lay-row>
                            </lay-form-item>
                        </lay-form>
                    </lay-col>
                </lay-row>
            </lay-card>
        </lay-container>
    </div>
</template>

<script lang="ts">
import {reactive, ref} from 'vue'
import { layer } from '@layui/layer-vue'
import {  useRoute } from 'vue-router'
import Upload from "../../Upload.vue";
import {CarouselApi} from "../../../servie/CarouselApi.ts";
import {uploadFileApi} from "../../../api/file/uploadApi.ts";

export default {
    components: {Upload},
    setup() {
        const route = useRoute()

        const model = reactive({
            title: '',
            img: '',
        })

        const submitClick = function () {
            CarouselApi.createCarousel(model).then(res => {
                reset();
                layer.msg('添加成功');
            }).catch(error => {
                layer.msg('添加失败');
            })
        }

        const handleUploadSuccess = (url) => {
            console.log("我是上传组件来的：" + url)
            model.img = url;
        };

        const reset = () => {
            model.title = '';
            model.img = '';
            imageUrl.value = '';
        }

        /**-------------图片伤上传相关------------------*/
        const imageUrl = ref('');

        const uploadFile = file => {
            return new Promise((resolve, reject) => {
                // 调用上传文件的函数
                uploadFileApi(file).then(res => {
                    imageUrl.value = res.data.data;
                    model.img = res.data.data;
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
                } catch (error) {
                    console.error('上传失败', error);
                }
            }
        }


        function clearImage() {
            imageUrl.value = '';
        }
        /**-------------图片伤上传相关------------------*/


        return {
            model,
            submitClick,
            handleUploadSuccess,
            route,
            reset,
            imageUrl,
            handleFileChange,
            clearImage,
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

.avatar-upload {
    position: relative;
}

.avatar-container {
    width: 400px;
    height: 200px;
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
