// api/articleApi.ts

import api from '../api/Api.ts';
import axios from "axios";

export class ArticleApi {

    // 获取文章列表
    // @ts-ignore
    public static async getArticleList(data) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/article/list/page/vo', data);
        return response.data;
    }
    // 获取文章vo
    // @ts-ignore
    public static async getArticleById(id) {
        const  res = await axios.get('http://localhost:8101/api/article/get/vo?id=' + id);
        return res.data;
    }

    // 发布文章
    // @ts-ignore
    public static async createArticle(data) {
        const response = await api.post('/api/article/add', data);
        return response.data;
    }

    // 修改文章
    // @ts-ignore
    public static async updateArticleById(data) {
        const response = await api.post('/api/article/edit', data);
        return response.data;
    }

    // 删除
    // @ts-ignore
    public static async deleteArticleById(data) {
        try {
            const response = await api.post('/api/article/delete', data);
            return response.data;
        } catch (error) {
            // 处理不存在的情况，返回 null 或者其他你认为合适的值
            return null;
        }
    }

    //获取我发布的文章列表
    public static async getMyArticleList({data}: { data: any }) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/article/my/list/page/vo', data);
        return response.data;
    }

    //获取热门文章列表
    public static async getHotArticleList() {
        const data = {
            current: 1,
            pageSize: 5,
            sortField:"lookNum"
        }
        const response = await api.post('/api/article/list/page/vo', data);
        return response.data;
    }


}
