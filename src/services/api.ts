import { NotificationUtil } from '@/util/Notification';
import axios, { AxiosInstance, AxiosError } from 'axios';


export const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    // baseURL: 'http://192.168.1.19:8080',
    headers: {
        'Accept-Language': localStorage.getItem('language'), // Ngôn ngữ mặc định
    },
    timeout: 5000
});

// Hàm để cập nhật ngôn ngữ
export const setLanguage = (lang: string) => {
    apiClient.defaults.headers['Accept-Language'] = localStorage.getItem('language');
};

// Interceptor để xử lý lỗi
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.code === 'ECONNABORTED') {
            // Xử lý lỗi timeout
            alert('ECONNABORTED')
            NotificationUtil.openMessageError('', '');
        } else if (!error.response) {
            // Xử lý lỗi không kết nối được (backend tắt)
            alert('backend tắt')
            NotificationUtil.openMessageError('', '');
        } else {
            // Xử lý lỗi từ server
            // NotificationUtil.openMessageError('', '');
        }
        return Promise.reject(error);
    }
);
