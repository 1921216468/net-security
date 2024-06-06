<template>
    <div>
        <lay-card style="margin: 10px">
            <p class="title">修改题库</p>
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
                                <lay-form-item label="课程简介" prop="content">
                                    <lay-textarea
                                            placeholder="请输入描述"
                                            v-model="model.content"
                                    ></lay-textarea>
                                </lay-form-item>
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
import {useRoute } from 'vue-router'
import {BankApi} from "../../../../servie/BankApi.ts";

export default {
    setup() {
        const route = useRoute()

        const model = ref({
            content: "",
            title: ""
        })


        const submitClick = () => {
            BankApi.updateBankById({
                id: route.query.id,
                content: model.value.content,
                title: model.value.title
            }).then(async (res) => {
                layer.msg('更新成功');
            })


        }

        const fetch_bank = async () => {
            BankApi.getBankById(route.query.id).then((res) => {
                model.value = res.data;
            })
        }

        const reset = () => {
            model.value.content = "";
            model.value.title = "";
        }
        onMounted(() => {
            fetch_bank();
        })


        return {
            model,
            submitClick,
            reset,
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
.file-input-label input {
    display: none;
}
.file-preview button {
    margin-left: auto;
}
</style>
