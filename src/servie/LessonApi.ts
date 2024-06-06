// api/lessonApi.ts

import api from '../api/Api.ts';
import axios from "axios";

export class LessonApi {

    // 获取课程列表
    // @ts-ignore
    public static async getLessonList(data) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/lesson/list/page/vo', data);
        return response.data;
    }
    // 获取课程vo
    // @ts-ignore
    public static async getLessonById(id) {
        const  res = await axios.get('http://localhost:8101/api/lesson/get/vo?id=' + id);
        return res.data;
    }

    // 发布课程
    // @ts-ignore
    public static async createLesson(data) {
        const response = await api.post('/api/lesson/add', data);
        return response.data;
    }

    // 修改课程
    // @ts-ignore
    public static async updateLessonById(data) {
        const response = await api.post('/api/lesson/edit', data);
        return response.data;
    }

    // 删除
    // @ts-ignore
    public static async deleteLessonById(data) {
        try {
            const response = await api.post('/api/lesson/delete', data);
            return response.data;
        } catch (error) {
            // 处理不存在的情况，返回 null 或者其他你认为合适的值
            return null;
        }
    }

    //获取我发布的课程列表
    public static async getMyLessonList({data}: { data: any }) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/lesson/my/list/page/vo', data);
        return response.data;
    }


    //获取热门课程列表
    public static async getHotArticleList() {
        const data = {
            current: 1,
            pageSize: 5,
            sortField:"lookNum"
        }
        const response = await api.post('/api/lesson/list/page/vo', data);
        return response.data;
    }
}
