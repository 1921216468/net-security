<template>
    <div class="add-post">
        <lay-form :model="model" label-width="100px">
            <lay-form-item label="标题" prop="title">
                <lay-input v-model="model.title" placeholder="请输入标题"></lay-input>
            </lay-form-item>
            <lay-form-item label="描述" prop="desc">
                <lay-textarea v-model="model.content" placeholder="请输入描述" auto-size></lay-textarea>
            </lay-form-item>
            <lay-form-item style="text-align: center;">
                <lay-button type="primary" @click="submit">提交</lay-button>
                <lay-button type="default" @click="reset">重置</lay-button>
            </lay-form-item>
        </lay-form>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { layer } from '@layui/layer-vue'
import {PostApi} from "../../servie/PostApi.ts";

const model = reactive({
    title:'',
    tags: [],
    content:''
})

const submit = () => {
    if (model.title === ''|| model.describe ===''){
        layer.notifiy({
            title: "Error",
            content: "请将表单输入完整！",
            icon: 2,
            offset: 'center'
        })
    } else {
        PostApi.createPost(model).then((res) =>{
            layer.notifiy({
                title: "Success",
                content: "发布成功！",
                icon: 1,
                offset: 'center'
            })
            location.reload();
        })

    }
};

const reset = () => {
    // 重置表单
    Object.keys(model).forEach(key => {
        model[key] = '';
    });
};
</script>

<style scoped>
.add-post {
    max-width: 50%; /* Adjust the width as needed */
    margin: 16px auto;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: box-shadow 0.3s;
}

.add-post:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.add-post .el-form-item__label {
    color: #333333;
}

.add-post .el-input,
.add-post .el-textarea {
    width: 100%;
}

.add-post .el-button {
    margin-right: 10px;
}

.add-post .el-button--primary {
    background-color: #409eff;
    border-color: #409eff;
}

.add-post .el-button--primary:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
}

.add-post .el-button--default {
    color: #333;
    border-color: #dcdfe6;
}

.add-post .el-button--default:hover {
    color: #409eff;
    border-color: #409eff;
}
</style>
