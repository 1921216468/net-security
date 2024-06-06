// api/PostApi.ts

import api from '../api/Api.ts';

export class PostApi {
    // 获取帖子列表
    // @ts-ignore
    public static async getPostList(data) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/post/list/page/vo', data);
        return response.data;
    }

    // 发布帖子
    // @ts-ignore
    public static async createPost(data) {
        const response = await api.post('/api/post/add', data);
        return response.data;
    }

    // 删除
    // @ts-ignore
    public static async deletePostById(data) {
        try {
            const response = await api.post('/api/post/delete',data);
            return response.data;
        } catch (error) {
            // 处理不存在的情况，返回 null 或者其他你认为合适的值
            return null;
        }
    }

    // 喜欢帖子
    public static async favour({data}: { data: any }) {
        const response = await api.post('/api/post_favour/', data);
        return response.data;
    }

    //点赞帖子
    public static async thumb({data}: { data: any }) {
        const response = await api.post('/api/post_thumb/', data);
        return response.data;
    }

    //获取我发布的帖子列表
    public static async getMyPostList({data}: { data: any }) {
        const response = await api.post('/api/post/my/list/page/vo', data);
        return response.data;
    }

    //获取我收藏的帖子列表
    public static async getMyFavourList({data}: { data: any }) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/post_favour/my/list/page', data);
        return response.data;
    }

    //获取热门文章列表
    public static async getHotPostArticleList() {
        const data = {
        }
        const response = await api.post('/api/pub/list/page/vo', data);
        return response.data;
    }
}
