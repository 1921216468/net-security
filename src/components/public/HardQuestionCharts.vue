<template>
    <lay-container :fluid="true" style="padding: 10px">
        <lay-row space="10">
            <lay-col md="16" sm="16" xs="24">
                <lay-row :space="10">
                    <lay-col :md="24">
                        <lay-card style="padding: 40px">
                            <template #title>难度题目</template>
                            <lay-row>
                                <lay-col :md="12">
                                    <lay-form :model="model" inline>
                                        <lay-form-item label="题目" prop="title">
                                            <lay-input v-model="model.content" type="text" placeholder="请输入题目"></lay-input>
                                        </lay-form-item>
                                        <lay-form-item label="分值" prop="content">
                                            <lay-input placeholder="请输入分值" v-model="model.score"></lay-input>
                                        </lay-form-item>
                                        <lay-form-item label="正确答案" prop="content">
                                            <lay-input placeholder="请输入分值" v-model="model.answer"></lay-input>
                                        </lay-form-item>
                                        <lay-form-item label="解析" prop="content">
                                            <lay-textarea placeholder="请输入解析" v-model="model.analysis"></lay-textarea>
                                        </lay-form-item>
                                    </lay-form>
                                </lay-col>
                                <lay-col :md="12">
                                    <!-- 答案列 -->
                                    <lay-form :model="model" inline>
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
                                        <lay-form-item label="所属题库" prop="content">
                                            <lay-input placeholder="请输入分值" v-model="model.bank"></lay-input>
                                        </lay-form-item>
                                    </lay-form>
                                </lay-col>
                            </lay-row>
                        </lay-card>

                    </lay-col>

                </lay-row>
            </lay-col>
            <lay-col md="8" sm="8" xs="12">
                <lay-row :space="10">
                    <lay-col :md="24">
                        <lay-card>
                            <template #title>作答情况</template>
                            <div class="task-progress">
                                <span>{{ AnswerSituation.answerCount }}</span>
                                <span class="task-progress-title">作答次数</span>
                                <lay-progress :percent="AnswerSituation.answerCount"></lay-progress>
                            </div>

                            <div class="task-progress">
                                <span>{{ AnswerSituation.rightCount  }}</span>
                                <span class="task-progress-title">正确次数</span>
                                <lay-progress :percent="AnswerSituation.rightCount"></lay-progress>
                            </div>
                            <div class="task-progress">
                                <span>{{ AnswerSituation.tryCount  }}</span>
                                <span class="task-progress-title">尝试人数</span>
                                <lay-progress :percent="AnswerSituation.tryCount"></lay-progress>
                            </div>


                            <div class="task-progress">
                                <span>{{ AnswerSituation.accuracy  }}%</span>
                                <span class="task-progress-title">正确率</span>
                                <lay-progress :percent="AnswerSituation.accuracy"></lay-progress>
                            </div>
                        </lay-card>
                    </lay-col>

                </lay-row>
            </lay-col>
        </lay-row>
    </lay-container>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {BankApi} from "../../servie/BankApi.ts";
import {QuestionApi} from "../../servie/QuestionApi.ts";
import {AnswerApi} from "../../servie/AnswerApi.ts";

const questionId = ref('');

const model = ref({
    content: "",
    title: "",
    analysis: "",
    score: "",
    level: "",
    answerId: "",
    answer: "",
    bank: ""
})

const answers = ref([
    {id: '',questionId:'', content: "", title: "" }, // 选项A
    {id: '',questionId:'', content: "", title: "" }, // 选项B
    {id: '',questionId:'', content: "", title: "" }, // 选项C
    {id: '',questionId:'', content: "", title: "" }  // 选项D
]);

const AnswerSituation = ref({
    rightCount: 0,
    answerCount: 0,
    tryCount: 0,
    accuracy: 0
})

/**获取作答情况*/
const fetchAnswerSituation = () => {
    QuestionApi.getAnswerSituation(questionId.value).then(async (res) => {
        console.log("做大情况",res.data)
        AnswerSituation.value.rightCount = res.data.rightCount
        AnswerSituation.value.answerCount = res.data.answerCount
        AnswerSituation.value.tryCount = res.data.tryCount
        AnswerSituation.value.accuracy = res.data.accuracy * 100
    })
}

/**获取题目id*/
QuestionApi.getDifficultyQuestionId().then(async (res) => {
    questionId.value = res.data
    fetch_question()
    fetch_answer()
    fetchAnswerSituation()
})


/**获取题目*/
const fetch_question = () => {
    QuestionApi.getQuestionById(questionId.value).then(async (res) => {
        model.value = res.data
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
        BankApi.getBankById(res.data.bankId).then(async (res) => {
            model.value.bank = res.data.title
        })

    })
}
/**获取答案*/
const fetch_answer = () => {
    AnswerApi.getAnswerList({questionId:questionId.value}).then(async (res) => {
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


</script>

<style lang="less" scoped>
#main {
  width: 100%;
  height: 400px;
}

.shortcut {
  text-align: center;

  i {
    display: inline-block;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-radius: 2px;
    font-weight: 500;
    font-size: 30px;
    background-color: #f8f8f8;
    color: #333;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
  }

  cite {
    position: relative;
    top: 2px;
    display: block;
    color: #666;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
  }
}
.shortcut:hover {
  i {
    font-weight: 700;
    background-color: #009b410f;
    color: #009688;
    box-shadow: 1px 1px 4px #cccccc53;
  }
  cite {
    font-weight: 600;
    color: #009688;
  }
}

.agency {
  display: block;
  padding: 10.5px 16px;
  background-color: #f8f8f8;
  color: #999;
  border-radius: 2px;

  h3 {
    padding-bottom: 10px;
    font-size: 12px;
  }

  p cite {
    font-style: normal;
    font-size: 30px;
    font-weight: 300;
    color: #009688;
  }
}

.task-progress {
  padding: 10px 5px;

  .task-progress-title {
    right: 20px;
    position: absolute;
    color: #999;
  }

  .layui-progress {
    margin-top: 10px;
  }

  .question-card {
    padding: 20px;
  }
  .question {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .info {
    margin-bottom: 5px;
  }
}
</style>
