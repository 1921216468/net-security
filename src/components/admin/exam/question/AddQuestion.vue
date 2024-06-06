<template>
    <div>
        <lay-card style="margin: 10px">
            <p class="title">添加试题</p>
        </lay-card>
        <div class="video">
            <lay-container :fluid="true" style="padding: 10px; padding-top: 0px">
                <lay-card style="padding: 40px">
                    <lay-row>
                        <lay-col :md="10" :md-offset="7">
                            <lay-form :model="model">
                                <lay-form-item label="题目" prop="title">
                                    <lay-input v-model="model.content" type="text" placeholder="请输入题目"></lay-input>
                                </lay-form-item>
                                    <lay-form-item label="分值" prop="content">
                                    <lay-input
                                        placeholder="请输入分值"
                                        v-model="model.score"
                                    ></lay-input>
                                </lay-form-item>
<!--                                选择题库,使用获取到的真实数据-->
                                <lay-form-item label="题库" prop="content">
                                    <lay-select v-model="model.bankId" placeholder="请选择题库">
                                        <lay-select-option v-for="item in bankList" :key="item.id" :value="item.id" :label="item.title"></lay-select-option>
                                    </lay-select>
                                </lay-form-item>
<!--                                选择难度-->
                                <lay-form-item label="难度" prop="content">
                                    <lay-select v-model="model.level" placeholder="请选择难度">
                                        <lay-select-option :value="1" label="简单"></lay-select-option>
                                        <lay-select-option :value="2" label="中等"></lay-select-option>
                                        <lay-select-option :value="3" label="困难"></lay-select-option>
                                    </lay-select>
                                </lay-form-item>
                                <h3>输入答案</h3>
                                <br/>
<!--                                填写4个选项答案-->
                                <lay-form-item label="选项A" prop="content">
                                    <lay-input v-model="answers[0].content" type="text" placeholder="请输入选项A"></lay-input>
                                </lay-form-item>
                                <lay-form-item label="选项B" prop="content">
                                    <lay-input v-model="answers[1].content" type="text" placeholder="请输入选项B"></lay-input>
                                </lay-form-item>
                                <lay-form-item label="选项C" prop="content">
                                    <lay-input v-model="answers[2].content" type="text" placeholder="请输入选项C"></lay-input>
                                </lay-form-item>
                                <lay-form-item label="选项D" prop="content">
                                    <lay-input v-model="answers[3].content" type="text" placeholder="请输入选项D"></lay-input>
                                </lay-form-item>

<!--                                选择正确答案-->
                                <lay-form-item label="正确答案" prop="content">
                                    <lay-select v-model="model.answer" placeholder="请选择正确答案">
                                        <lay-select-option :value="0" label="A"></lay-select-option>
                                        <lay-select-option :value="1" label="B"></lay-select-option>
                                        <lay-select-option :value="2" label="C"></lay-select-option>
                                        <lay-select-option :value="3" label="D"></lay-select-option>
                                    </lay-select>
                                </lay-form-item>

                                <lay-form-item label="解析" prop="content">
                                    <lay-textarea
                                        placeholder="请输入解析"
                                        v-model="model.analysis"
                                    ></lay-textarea>
                                </lay-form-item>

                                <lay-form-item>
                                    <lay-row :space="20">
                                        <lay-col :md="12">
                                            <lay-button :fluid="true" @click="submitClick" type="primary"
                                            >保存</lay-button
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
import {BankApi} from "../../../../servie/BankApi.ts";
import {QuestionApi} from "../../../../servie/QuestionApi.ts";
import {AnswerApi} from "../../../../servie/AnswerApi.ts";

export default {
    setup() {
        const model = ref({
            content: "",
            title: "",
            analysis: "",
            score: "",
            level: "",
            answerId: "",
            answer: "",
            bankId: ""
        })

        const answers = ref([
            {questionId:'', content: "", title: "A" }, // 选项A
            {questionId:'', content: "", title: "B" }, // 选项B
            {questionId:'', content: "", title: "C" }, // 选项C
            {questionId:'', content: "", title: "D" }  // 选项D
        ]);

        const bankList = ref([])

        const answerId = ref([])

        const submitClick = () => {
            // 参数校验
            if (model.value.content === "") {
                layer.msg('请输入题目');
                return;
            }
            if (model.value.score === "") {
                layer.msg('请输入分值');
                return;
            }
            if (model.value.level === "") {
                layer.msg('请选择难度');
                return;
            }
            if (model.value.answer === "") {
                layer.msg('请选择正确答案');
                return;
            }
            if (model.value.analysis === "") {
                layer.msg('请输入解析');
                return;
            }
            if (model.value.bankId === "") {
                layer.msg('请选择题库');
                return;
            }
            for (let i = 0; i < answers.value.length; i++) {
                if (answers.value[i].content === "") {
                    layer.msg('请输入选项' + String.fromCharCode(65 + i));
                    return;
                }
            }
            QuestionApi.createQuestion(model.value).then(async (res) => {
                for (let i = 0; i < answers.value.length; i++) {
                    answers.value[i].questionId = res.data
                    AnswerApi.createAnswer(answers.value[i]).then(async (res) => {
                        if (res.code=== 0) {
                            // 更新问题表中得正确答案id
                            answerId.value.push(res.data)
                            model.value.answerId = answerId.value[model.value.answer]
                            QuestionApi.updateQuestionById({id:answers.value[i].questionId,answerId:model.value.answerId}).then(async (res) => {
                                    layer.msg('添加成功');
                            })
                        }
                    })
                }
                console.log(answerId.value)
            })



        }

        /**获取题库*/
        const fetch_bank = () => {
            BankApi.getBankList({}).then(async (res) => {
                console.log(res)
                bankList.value = res.data.records
            })
        }



        const reset = () => {
            model.value.content = "";
            model.value.title = "";

        }
        onMounted(() => {
            fetch_bank()
        })


        return {
            model,
            submitClick,
            reset,
            answers,
            bankList
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
