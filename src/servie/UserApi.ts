// api/PostApi.ts

import api from '../api/Api.ts';
import axios from "axios";

export class UserApi {
    // 注销
    public static async logout() {
        const response = await api.post('/api/user/logout',{});
        return response.data;
    }

    // 获取用户主页信息
    public static async getUserInfo(id: ArrayBufferView | ArrayBuffer) {
        const response = await axios({
            url: 'http://localhost:8101/api/user/get/center?id=' + id,
            method: 'get'
        });
        return response.data;
    }

    //修改资料
    // @ts-ignore
    public static async updateUserInfo(data) {
        const response = await api.post('/api/user/update/my', data);
        return response.data;
    }


    //获取积分前三名的用户
    public static async getTopThreeUser() {
        const response = await api.post('/api/pub/list/point/page/vo');
        return response.data;
    }

    //获取正确率前三名的用户
    public static async getTopAccuracyThreeUser() {
        const response = await api.post('/api/pub/list/question/page/vo');
        return response.data;
    }
}
