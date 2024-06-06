// api/rightQuestionApi.ts

import api from '../api/Api.ts';
import axios from "axios";

export class RightQuestionApi {

    // 获取轮播图列表
    // @ts-ignore
    public static async getRightQuestionList(data) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/rightQuestion/list/page/vo', data);
        return response.data;
    }
    // 获取轮播图vo
    // @ts-ignore
    public static async getRightQuestionById(id) {
        const  res = await axios.get('http://localhost:8101/api/rightQuestion/get/vo?id=' + id);
        return res.data;
    }

    // 发布轮播图
    // @ts-ignore
    public static async createRightQuestion(data) {
        const response = await api.post('/api/rightQuestion/add', data);
        return response.data;
    }

    // 修改轮播图
    // @ts-ignore
    public static async updateRightQuestionById(data) {
        const response = await api.post('/api/rightQuestion/edit', data);
        return response.data;
    }

    // 删除
    // @ts-ignore
    public static async deleteRightQuestionById(data) {
        try {
            const response = await api.post('/api/rightQuestion/delete', data);
            return response.data;
        } catch (error) {
            // 处理不存在的情况，返回 null 或者其他你认为合适的值
            return null;
        }
    }

    //获取我发布的轮播图列表
    // @ts-ignore
    public static async getMyRightQuestionList(data) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/rightQuestion/my/list/page/vo', data);
        return response.data;
    }


}
