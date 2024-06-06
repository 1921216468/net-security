// api/bankApi.ts

import api from '../api/Api.ts';
import axios from "axios";

export class BankApi {

    // 获取轮播图列表
    // @ts-ignore
    public static async getBankList(data) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/bank/list/page/vo', data);
        return response.data;
    }
    // 获取轮播图vo
    // @ts-ignore
    public static async getBankById(id) {
        const  res = await axios.get('http://localhost:8101/api/bank/get/vo?id=' + id);
        return res.data;
    }

    // 发布轮播图
    // @ts-ignore
    public static async createBank(data) {
        const response = await api.post('/api/bank/add', data);
        return response.data;
    }

    // 修改轮播图
    // @ts-ignore
    public static async updateBankById(data) {
        const response = await api.post('/api/bank/edit', data);
        return response.data;
    }

    // 删除
    // @ts-ignore
    public static async deleteBankById(data) {
        try {
            const response = await api.post('/api/bank/delete', data);
            return response.data;
        } catch (error) {
            // 处理不存在的情况，返回 null 或者其他你认为合适的值
            return null;
        }
    }

    //获取我发布的轮播图列表
    public static async getMyBankList({data}: { data: any }) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/bank/my/list/page/vo', data);
        return response.data;
    }


}
