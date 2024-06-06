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
                                        <lay-select-option :value="'简单'" label="简单"></lay-select-option>
                                        <lay-select-option :value="'中等'" label="中等"></lay-select-option>
                                        <lay-select-option :value="'困难'" label="困难"></lay-select-option>
                                    </lay-select>

                                </lay-form-item>
                                <h3>输入答案</h3>
                                <br/>
                                <!--                                填写4个选项答案-->
                                <lay-form-item :label="answers[0].title" prop="content">
                                    <lay-input v-model="answers[0].content" type="text" placeholder="请输入选项A"></lay-input>
                                </lay-form-item>
                                <lay-form-item :label="answers[1].title" prop="content">
                                    <lay-input v-model="answers[1].content" type="text" placeholder="请输入选项B"></lay-input>
                                </lay-form-item>
                                <lay-form-item :label="answers[2].title" prop="content">
                                    <lay-input v-model="answers[2].content" type="text" placeholder="请输入选项C"></lay-input>
                                </lay-form-item>
                                <lay-form-item :label="answers[3].title" prop="content">
                                    <lay-input v-model="answers[3].content" type="text" placeholder="请输入选项D"></lay-input>
                                </lay-form-item>

                                <!--                                选择正确答案-->
                                <lay-form-item label="正确答案" prop="content">
                                    <lay-select v-model="model.answer" placeholder="请选择正确答案" @change="handleLevelChange">
                                        <lay-select-option :value="answers[0].title" label="A"></lay-select-option>
                                        <lay-select-option :value="answers[1].title" label="B"></lay-select-option>
                                        <lay-select-option :value="answers[2].title" label="C"></lay-select-option>
                                        <lay-select-option :value="answers[3].title" label="D"></lay-select-option>
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
import {useRoute } from 'vue-router'

import { layer } from '@layui/layer-vue'
import {BankApi} from "../../../../servie/BankApi.ts";
import {QuestionApi} from "../../../../servie/QuestionApi.ts";
import {AnswerApi} from "../../../../servie/AnswerApi.ts";

export default {
    setup() {
        const route = useRoute()

        const model = ref({
            id: route.query.id,
            content: "",
            title: "",
            analysis: "",
            score: "",
            level: "",
            answerId: "",
            answer: "",
            bankId: ""
        })

        const  newLevel = ref("")

        const answers = ref([
            {id: '',questionId:'', content: "", title: "" }, // 选项A
            {id: '',questionId:'', content: "", title: "" }, // 选项B
            {id: '',questionId:'', content: "", title: "" }, // 选项C
            {id: '',questionId:'', content: "", title: "" }  // 选项D
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


            console.log("answers.value")
            console.log(answers.value)

            if (model.value.level === '简单') {
                newLevel.value = "1"
            } else if (model.value.level === '中等') {
                newLevel.value = "2"
            } else if (model.value.level === '困难') {
                newLevel.value = "3"
            }

            QuestionApi.updateQuestionById({
                id: route.query.id,
                content: model.value.content,
                title: model.value.title,
                analysis: model.value.analysis,
                score: model.value.score,
                answerId: model.value.answerId,
                bankId: model.value.bankId,
                level: newLevel.value
            }).then(async (res) => {
                AnswerApi.updateAnswerById({
                    id: answers.value[0].id,
                    content: answers.value[0].content,
                    title: answers.value[0].title,
                    questionId: route.query.id
                }).then(async (res) => {
                    AnswerApi.updateAnswerById({
                        id: answers.value[1].id,
                        content: answers.value[1].content,
                        title: answers.value[1].title,
                        questionId: route.query.id
                    }).then(async (res) => {
                        AnswerApi.updateAnswerById({
                            id: answers.value[2].id,
                            content: answers.value[2].content,
                            title: answers.value[2].title,
                            questionId: route.query.id
                        }).then(async (res) => {
                            AnswerApi.updateAnswerById({
                                id: answers.value[3].id,
                                content: answers.value[3].content,
                                title: answers.value[3].title,
                                questionId: route.query.id
                            }).then(async (res) => {
                                layer.msg('更新成功');
                            })
                        })
                    })
                })
                layer.msg('更新成功');
            })

        }

        const handleLevelChange = () => {
            // 获取选定答案的 ID
            console.log("下拉框改变了")
            console.log(model.value.answer)
            if (model.value.answer === answers.value[0].title) {
                model.value.answerId = answers.value[0].id
            } else if (model.value.answer === answers.value[1].title) {
                model.value.answerId = answers.value[1].id
            } else if (model.value.answer === answers.value[2].title) {
                model.value.answerId = answers.value[2].id
            } else if (model.value.answer === answers.value[3].title) {
                model.value.answerId = answers.value[3].id
            }
            console.log(model.value.answerId)
        }

        /**获取题库*/
        const fetch_bank = () => {
            BankApi.getBankList({}).then(async (res) => {
                bankList.value = res.data.records
            })
        }

        /**获取题目*/
        const fetch_question = () => {
            QuestionApi.getQuestionById(route.query.id).then(async (res) => {
                model.value = res.data
                newLevel.value = res.data.level
                //获取正确答案
                AnswerApi.getAnswerById(res.data.answerId) .then(async (res) => {
                    if (res.data.title === 'A') {
                        model.value.answer = 'A'
                    } else if (res.data.title === 'B') {
                        model.value.answer = 'B'
                    } else if (res.data.title === 'C') {
                        model.value.answer = 'C'
                    } else if (res.data.title === 'D') {
                        model.value.answer = 'D'
                    }
                })

            })
        }
        /**获取答案*/
        const fetch_answer = () => {
            AnswerApi.getAnswerList({questionId:route.query.id}).then(async (res) => {
                console.log(res.data.records)
                //按abcd顺序赋值
                answers.value[0].content = res.data.records[0].content
                answers.value[1].content = res.data.records[1].content
                answers.value[2].content = res.data.records[2].content
                answers.value[3].content = res.data.records[3].content

                answers.value[0].title = res.data.records[0].title
                answers.value[1].title = res.data.records[1].title
                answers.value[2].title = res.data.records[2].title
                answers.value[3].title = res.data.records[3].title

                answers.value[0].id = res.data.records[0].id
                answers.value[1].id = res.data.records[1].id
                answers.value[2].id = res.data.records[2].id
                answers.value[3].id = res.data.records[3].id

            //     将answer按照abcd顺序排列
                    answers.value.sort((a, b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
})
            })
        }



        const reset = () => {
            model.value.content = "";
            model.value.title = "";

        }
        onMounted(() => {
            fetch_bank(),
                fetch_question(),
                fetch_answer()
        })


        return {
            model,
            submitClick,
            reset,
            answers,
            bankList,
            handleLevelChange
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
