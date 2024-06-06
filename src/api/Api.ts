import axios, {AxiosResponse} from 'axios';
import {router} from "../router";

type TAxiosOption = {
    timeout: number;
    baseURL: string;
}

const config: TAxiosOption = {
    timeout: 5000,
    baseURL: "http://localhost:8101",
}
class Api {
    service;
    constructor(config: TAxiosOption) {
        this.service = axios.create(config)

        /* 响应拦截 */
        this.service.interceptors.response.use((response: AxiosResponse<any>) => {
            if (response.data.code === 0)
                return response;
            else if (response.data.code === 40100) {
                layer.confirm(
                    '会话超时, 请重新登录',
                    {
                        icon: 2, yes: function () {
                            router.push('/login');
                            layer.closeAll()
                        }
                    });
                return response.data;
            } else {
                layer.notifiy({
                    title: "Error",
                    content: response.data.message,
                    icon: 2,
                    offset: 'center'
                })
                return response.data;
            }
        }, error => {
            return Promise.reject(error)
        })

    }

    /* GET 方法 */
    // @ts-ignore
    get<T>(url: string, params?: object, _object = {}): Promise<any> {
        return this.service.get(url, { params, ..._object })
    }
    /* POST 方法 */
    // @ts-ignore
    post<T>(url: string, params?: object, _object = {
        withCredentials: true
    }): Promise<any> {
        return this.service.post(url, params, _object)
    }
    /* PUT 方法 */
    // @ts-ignore
    put<T>(url: string, params?: object, _object = {}): Promise<any> {
        return this.service.put(url, params, _object)
    }
    /* DELETE 方法 */
    // @ts-ignore
    delete<T>(url: string, params?: any, _object = {}): Promise<any> {
        return this.service.delete(url, { params, ..._object })
    }
}

export default new Api(config)
