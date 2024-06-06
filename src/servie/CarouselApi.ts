// api/carouselApi.ts

import api from '../api/Api.ts';
import axios from "axios";

export class CarouselApi {

    // 获取轮播图列表
    // @ts-ignore
    public static async getCarouselList(data) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/carousel/list/page/vo', data);
        return response.data;
    }
    // 获取轮播图vo
    // @ts-ignore
    public static async getCarouselById(id) {
        const  res = await axios.get('http://localhost:8101/api/carousel/get/vo?id=' + id);
        return res.data;
    }

    // 发布轮播图
    // @ts-ignore
    public static async createCarousel(data) {
        const response = await api.post('/api/carousel/add', data);
        return response.data;
    }

    // 修改轮播图
    // @ts-ignore
    public static async updateCarouselById(data) {
        const response = await api.post('/api/carousel/edit', data);
        return response.data;
    }

    // 删除
    // @ts-ignore
    public static async deleteCarouselById(data) {
        try {
            const response = await api.post('/api/carousel/delete', data);
            return response.data;
        } catch (error) {
            // 处理不存在的情况，返回 null 或者其他你认为合适的值
            return null;
        }
    }

    //获取我发布的轮播图列表
    public static async getMyCarouselList({data}: { data: any }) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/carousel/my/list/page/vo', data);
        return response.data;
    }


}
