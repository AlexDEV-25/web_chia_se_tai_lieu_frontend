import axios from "axios";
import type { AxiosRequestConfig } from "axios";

// ================== CREATE AXIOS INSTANCE ==================
const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ================== HANDLE REQUEST ==================
api.interceptors.request.use(
    (config) => {
        // Nếu sau này có token:
        // const token = localStorage.getItem("token");
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ================== HANDLE RESPONSE ==================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Axios error:", error);
        return Promise.reject(error);
    }
);

// ================== HTTP METHODS ==================

export const httpGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
};

export const httpPost = async <T>(url: string, body?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.post<T>(url, body, config);
    return response.data;
};

export const httpPut = async <T>(url: string, body?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.put<T>(url, body, config);
    return response.data;
};

export const httpDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
};

export default api;
