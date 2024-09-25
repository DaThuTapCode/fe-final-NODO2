// src/apiClient.ts
import axios, { AxiosInstance } from 'axios';

export const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    // baseURL: 'http://192.168.1.6:8080',
    headers: {
        'Accept-Language': 'en', // Ngôn ngữ mặc định
    },
});

// Hàm để cập nhật ngôn ngữ
export const setLanguage = (lang: string) => {
    apiClient.defaults.headers['Accept-Language'] = lang;
};
