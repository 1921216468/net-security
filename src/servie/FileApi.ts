// api/fileApi.ts

import api from '../api/Api.ts';
import axios from "axios";

export class FileApi {

    // 获取文件列表
    // @ts-ignore
    public static async getFileList(data) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/file/list/page/vo', data);
        return response.data;
    }
    // 获取文件vo
    // @ts-ignore
    public static async getFileById(id) {
        const  res = await axios.get('http://localhost:8101/api/file/get/vo?id=' + id);
        return res.data;
    }

    // 发布文件
    // @ts-ignore
    public static async createFile(data) {
        const response = await api.post('/api/file/add', data);
        return response.data;
    }

    // 修改文件
    // @ts-ignore
    public static async updateFileById(data) {
        const response = await api.post('/api/file/edit', data);
        return response.data;
    }

    // 删除
    // @ts-ignore
    public static async deleteFileById(data) {
        try {
            const response = await api.post('/api/file/delete', data);
            return response.data;
        } catch (error) {
            // 处理不存在的情况，返回 null 或者其他你认为合适的值
            return null;
        }
    }

    //获取我发布的文件列表
    public static async getMyFileList({data}: { data: any }) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/file/my/list/page/vo', data);
        return response.data;
    }


}
