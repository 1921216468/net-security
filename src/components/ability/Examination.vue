<template>
    <div class="exam-page">
        <aside class="sidebar">
            <div class="timer-box">
                <span class="timer">{{ formattedTime }}</span>
            </div>
            <div class="question-nav">
                <button v-for="(question, index) in questions" :key="question.id" :class="{ active: question.isActive }"  class="nav-button">
                    {{ index + 1 }}
                </button>
            </div>
            <div class="card">
                <div>
                    <span>共: {{questions.length}}题</span>
                </div>

                <div>
                    <span>已作答: {{yizuoda_questions}}题</span>
                </div>

                <div>
                    <span>合计: {{ totalScore }}分</span>
                </div>
            </div>



        </aside>
        <div class="main-content">
            <header class="exam-header">
                <h1>{{ route.query.name }}</h1>
                <div class="exam-info">
                    <span>剩余题目：{{ remainingQuestions }}题</span>
                </div>
            </header>
            <main class="exam-content">

                <div class="questions">
                    <!--    如果题库为空就显示缺省页-->
                    <div class="question-bank-list" v-if="questions.length === 0">
                        题库为空
                    </div>
                    <div class="question" v-for="(question, index) in questions" :key="question.id">
                        <div class="question-header">
                            <span class="question-number">问题 {{ index + 1 }}</span>
                            <span class="question-title">{{ question.content }}</span>
                        </div>
                        <div class="question-options">
                            <label v-for="option in question.answer" :key="option.id" class="option">
                                <input type="radio" :name="`question_${question.id}`" :value="option.id" @click="answerQuestion(question.id,option.id)" :disabled="question.isActive"/>
                                {{ option.title }}
                                {{ option.content }}
                            </label>
                        </div>

                        <!-- 解析内容，根据 isActive 判断是否展开 -->
                        <div v-if="question.showAnalysis" class="analysis">
                            {{ question.analysis }}
                        </div>
                    </div>
                </div>
                <footer class="question-footer">
                    <lay-button type="primary" size="sm" @click="restart">重新开始</lay-button>
                </footer>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import {QuestionApi} from "../../servie/QuestionApi.ts";
import {useRoute} from "vue-router";
import {ExamRecordApi} from "../../servie/ExamRecordApi.ts";
import {ErrorQuestionApi} from "../../servie/ErrorQuestionApi.ts";
import {PointApi} from "../../servie/PointApi.ts";
import {RightQuestionApi} from "../../servie/RightQuestionApi.ts";

const examDuration = 7200; //
const timer = reactive({
    time: examDuration,
});
const questions = ref([]);
const route = useRoute()

//当此作答记录的id
const examRecordId = ref('');

const formattedTime = computed(() => {
    const minutes = Math.floor(timer.time / 60);
    const seconds = timer.time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

//累计作答题目数量
let q_r = ref(0);

let countdown;
onMounted(() => {
    openAuto();
    console.log(route.query.name);
    fetch_question();
    addExamRecord();

    countdown = setInterval(() => {
        if (timer.time > 0) {
            --timer.time;
        } else {
            clearInterval(countdown);
        }
    }, 1000);
});

onUnmounted(() => {
    clearInterval(countdown);
});

const openAuto = function() {
    layer.open({
        type: 1,
        title: "积分规则",
        isHtmlFragment: true,
        content: "<br/>" +
            "<br/>"+


            "<div>\n" +
            "    每作答累计五题题加一分，\n题目回答正确额外加一分" +
            "  </div>" +
            "<br/>"+
            "<br/>"+
            "<br/>"
    })
}


const fetch_question = () => {
    QuestionApi.getQuestionList({bankId: route.query.id}).then((res) => {
        console.log(res.data.records);
// 对每个问题的答案按照 ABCD 顺序排序
        res.data.records.forEach((question) => {
            question.answer.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
        });
        // 将问题的答案赋值给 options
        questions.value = res.data.records;

    });
}
//计算总分值,字符串转为数字
const totalScore = computed(() => {
    return questions.value.reduce((total, question) => {
        return total + Number(question.score);
    }, 0);
});

//计算剩余未答题数
const remainingQuestions = computed(() => {
    return questions.value.filter((question) => !question.isActive).length;
});
//计算已答题数
const yizuoda_questions = computed(() => {
    return questions.value.filter((question) => question.isActive).length;
});
// 在问题回答时更新问题对象的状态
const answerQuestion = (id,option_id) => {
    // 找到当前问题
    const question = questions.value.find((question) => question.id === id);

    // 检查这个问题是否已经回答过
    if(question.isActive) {
        console.log('该问题已回答');
        return; // 如果已回答，什么都不做
    }
    // 将当前问题标记为已回答
    question.isActive = true; // 将问题标记为已回答
    console.log('回答了问题', option_id);

    // 累计作答五题加一分
    q_r.value = q_r.value + 1;
    if (q_r.value % 5 === 0) {
        addPoint1();
    }

    if (question.answerId === option_id) {
        question.showAnalysis = false;
        layer.msg("回答正确", { time: 1000, icon: 1 })
        addPoint2();
        addRightRecord(question.id,question.analysis,question.content,question.score);
        getExamRecord(false);
    } else {
        question.showAnalysis = true;
        layer.msg("回答错误", { time: 1000, icon: 2 })
        getExamRecord(true);
        addErrorRecord(question.id,question.analysis,question.content,question.score);
    }
};

const restart = () => {
    //重新加载页面
    location.reload();

};

/**添加练习记录*/
const addExamRecord = () => {

    //添加练习记录
    ExamRecordApi.createExamRecord({
        bankId:route.query.id,
        content: "",
        mistakeNum: 0,
        questionNum: 0,
        title: route.query.name
    }).then((res) => {
        console.log(res);
        examRecordId.value = res.data;
    });
};

/**添加错题记录*/
const addErrorRecord = (questionId,analysis,title,score) => {
    //添加错题记录
    ErrorQuestionApi.createErrorQuestion({
        bankId:route.query.id,
        content: title,
        analysis: analysis,
        questionId: questionId,
        score: score,
        title: title
    }).then((res) => {
        console.log(res);
    });
};

/**添加正确记录*/
const addRightRecord = (questionId,analysis,title,score) => {
    //添加错题记录
    RightQuestionApi.createRightQuestion({
        bankId:route.query.id,
        content: title,
        analysis: analysis,
        questionId: questionId,
        score: score,
        title: title
    }).then((res) => {
        console.log(res);
    });
};

/**获取本次练习记录*/
const getExamRecord = (isError) => {
    ExamRecordApi.getExamRecordById(examRecordId.value).then((res) => {
        if (isError) {
            res.data.mistakeNum = res.data.mistakeNum + 1;
        } else {
            res.data.mistakeNum = res.data.mistakeNum;
        }
        /**更新累计作答题数*/
            ExamRecordApi.updateExamRecordById({
                id:examRecordId.value,
                bankId:route.query.id,
                content: "",
                mistakeNum: res.data.mistakeNum,
                questionNum: res.data.questionNum + 1,
                title: route.query.name
            }).then((res) => {
                console.log(res);
            });
    });
};

/**累计作答五题加一分*/
const addPoint1 = () => {
    PointApi.createPoint({
        title: "累计作答五题加一分",
        score: 1
    }).then((res) => {
        q_r.value = 0;
        console.log(res);
    });
};

/** 回答正确加一分*/
const addPoint2 = () => {
    PointApi.createPoint({
        title: "回答正确加一分",
        score: 1
    }).then((res) => {
        console.log(res);
    });
};


</script>

<style scoped>

.exam-page {
    display: flex;
    font-family: Arial, sans-serif;
    max-width: 80%;
    margin: 20px auto;
    border: 1px solid #ccc;
    padding: 16px;
}

.sidebar {
    flex: 0 0 200px;
    border-right: 1px solid #ccc;
    padding: 20px;
    background-color: #f3f3f3; /* 添加背景色 */
    border-radius: 8px; /* 添加圆角 */
}

.timer-box {
    text-align: center;
    margin-bottom: 20px;
    padding: 20px;
    border: 2px solid white; /* 修改边框样式 */
    font-size: 40px; /* 增大字体大小 */
    background-color: #16baaa; /* 修改背景色 */
    color: #fff; /* 修改文字颜色 */
    border-radius: 10px; /* 添加圆角 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 修改阴影效果 */
}

.timer-box span {
    display: inline-block;
    width: 100px; /* 调整数字宽度 */
    text-align: center;
    /*border: 2px solid #333; !* 添加边框 *!*/
    border-radius: 5px; /* 添加圆角 */
    font-size: 30px; /* 调整数字字体大小 */
    padding: 5px; /* 调整数字内边距 */
    margin: 0 5px; /* 调整数字间距 */
}

.card {
    margin-top: 20px; /* 添加上边距 */
    border: 1px solid #ccc; /* 添加边框 */
    border-radius: 8px; /* 添加圆角 */
    padding: 20px; /* 添加内边距 */
    background-color: #f8f8f8; /* 修改背景色 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

.card > div {
    margin-bottom: 10px; /* 调整每个子元素之间的下边距 */
}

.card > div:last-child {
    margin-bottom: 0; /* 移除最后一个子元素的下边距 */
}

.card span {
    display: block; /* 使每个 span 元素占据一行 */
    font-size: 16px; /* 调整字体大小 */
    color: #333; /* 修改字体颜色 */
}

.card span:first-child {
    font-weight: bold; /* 添加粗体字体样式 */
}

.card span:last-child {
    color: black; /* 修改合计分数的字体颜色 */
}


.question-nav {
    display: flex;
    flex-wrap: wrap; /* 允许多行显示 */
    justify-content: center; /* 水平居中 */
    gap: 10px; /* 适当的间距 */
    margin-top: 20px; /* 添加上边距 */
}

.nav-button {
    flex: 0 0 calc(20% - 10px); /* 计算每个元素占据的宽度，20%表示每行显示五个元素，减去间距 */
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    cursor: pointer;
    border-radius: 4px; /* 添加圆角 */
    transition: background-color 0.3s ease; /* 添加过渡效果 */
}

/* 添加激活状态样式 */
.nav-button.active {
    background-color: #16baaa;
    color: #fff;
    border-color: #16baaa;
}

.nav-button:hover {
    background-color: #eaeaea; /* 添加鼠标悬停时的背景色 */
}


.main-content {
    flex: 1;
    padding: 16px;
}


.exam-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.exam-header h1 {
    margin: 0;
    font-size: 24px;
}

.exam-info {
    text-align: right;
}

.questions {
    border: 1px solid #eee;
    padding: 10px;
}

.question-header {
    display: flex;
    justify-content: space-between;
    background-color: #f8f8f8;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.question-number {
    font-weight: bold;
}

.question-title {
    flex-grow: 1;
    text-align: left;
}

.question-options {
    padding: 10px;
}

.option {
    display: block;
    margin: 5px 0;
}

.question-nav-button {
    padding: 5px 10px;
    margin-right: 5px;
}

.question-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

/* 添加解析内容的样式 */
.analysis {
    margin: 10px;
    padding: 10px;
    background-color: #f8f8f8;
    border: 1px solid red;
    border-radius: 4px;
    color: red;
}



</style>
