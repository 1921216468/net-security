// api/NoteApi.ts

import api from '../api/Api.ts';
import axios from "axios";

export class NoteApi {
    // 获取笔记vo
    // @ts-ignore
    public static async getNoteById(id) {
        const response = await axios({
            url: 'http://localhost:8101/api/note/get/vo',
            params: id,
            method: 'get'
        });
        return response.data;
    }

    // 发布笔记
    // @ts-ignore
    public static async createNote(data) {
        const response = await api.post('/api/note/add', data);
        return response.data;
    }

    // 修改笔记
    // @ts-ignore
    public static async updateNoteById(data) {
        const response = await api.post('/api/note/edit', data);
        return response.data;
    }

    // 删除
    // @ts-ignore
    public static async deleteNoteById(data) {
        try {
            const response = await api.post('/api/note/delete', data);
            return response.data;
        } catch (error) {
            // 处理不存在的情况，返回 null 或者其他你认为合适的值
            return null;
        }
    }

    //获取我发布的笔记列表
    public static async getMyNoteList({data}: { data: any }) {
        data.sortField = 'createTime'; //在原有data基础上添加sortField字段
        const response = await api.post('/api/note/my/list/page/vo', data);
        return response.data;
    }


}
