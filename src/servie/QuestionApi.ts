// api/questionApi.ts

import api from '../api/Api.ts';
import axios from "axios";

export class QuestionApi {

    // 获取轮播图列表
    // @ts-ignore
    public static async getQuestionList(data) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/question/list/page/vo', data);
        return response.data;
    }
    // 获取轮播图vo
    // @ts-ignore
    public static async getQuestionById(id) {
        const  res = await axios.get('http://localhost:8101/api/question/get/vo?id=' + id);
        return res.data;
    }

    // 发布轮播图
    // @ts-ignore
    public static async createQuestion(data) {
        const response = await api.post('/api/question/add', data);
        return response.data;
    }

    // 修改轮播图
    // @ts-ignore
    public static async updateQuestionById(data) {
        const response = await api.post('/api/question/edit', data);
        return response.data;
    }

    // 删除
    // @ts-ignore
    public static async deleteQuestionById(data) {
        try {
            const response = await api.post('/api/question/delete', data);
            return response.data;
        } catch (error) {
            // 处理不存在的情况，返回 null 或者其他你认为合适的值
            return null;
        }
    }

    //获取我发布的轮播图列表
    public static async getMyQuestionList({data}: { data: any }) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/question/my/list/page/vo', data);
        return response.data;
    }
//获取题目id
    public static async getDifficultyQuestionId() {
        const response = await api.post('/api/pub/difficulty/question/vo');
        return response.data;
    }

    //获取作答情况
    public static async getAnswerSituation(id: string) {
        const response = await api.post('/api/pub/answer/situation?id=' + id);
        return response.data;
    }

}
