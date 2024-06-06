// src/api/file/uploadApi.ts
import axios, { AxiosPromise } from 'axios';
import { FileInfo } from './FileInfo.ts';

/**
 * 上传文件
 *
 * @param file
 */
export function uploadFileApi(file: File): AxiosPromise<FileInfo> {
    const formData = new FormData();
    formData.append('file', file);
    return axios({
        url: 'http://localhost:8101/api/file/upload',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 删除文件
 *
 * @param filePath 文件完整路径
 */
export function deleteFileApi(filePath?: string) {
    return axios({
        url: '/api/v1/files',
        method: 'delete',
        params: { filePath: filePath }
    });
}
