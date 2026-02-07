import type { APIResponse } from './../models/response/APIResponse';
import api, { httpGet, httpPost } from "./HttpClient";
import type { LessonResponse } from "./../models/response/LessonResponse";
import type { LessonRequest } from "./../models/request/LessonRequest";
import type { HideRequest } from '../models/request/HideRequest';
import type { LessonStatsResponse } from '../models/response/LessonStatsResponse';

export const stats = async () => {
    return await httpGet<APIResponse<LessonStatsResponse>>(`/lessons/stats`);
};

export const search = async (keyword: string, categoryId: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/search?keyword=${keyword}&categoryId=${categoryId}`);
};

export const getLessonById = async (id: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/admin/${id}`);
};

export const getPublicLessonById = async (id: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/${id}`);
};

export const getAllLesson = async () => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/admin`);
};

export const getPublicAllLesson = async () => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons`);
};

export const deleteLesson = async (id: number): Promise<APIResponse<void>> => {
    const response = await api.delete<APIResponse<void>>(`/lessons/admin/${id}`);
    return response.data;
};

export const getAllLessonByUser = async (lessonId: number, userId: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/user?lessonId=${lessonId}&userId=${userId}`);
};

export const getAllLessonByCategory = async (lessonId: number, categoryId: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/category?lessonId=${lessonId}&categoryId=${categoryId}`);
};

export const hideLesson = async (id: number, data: HideRequest): Promise<APIResponse<LessonResponse>> => {
    const response = await api.put<APIResponse<LessonResponse>>(`/lessons/admin/hide/${id}`, data);
    return response.data;
};


export const updateLesson = async (id: number, lessonData: LessonRequest): Promise<APIResponse<LessonResponse>> => {
    const response = await api.put<APIResponse<LessonResponse>>(`/lessons/admin/${id}`, lessonData);
    return response.data;
};

export const increaseView = async (id: number) => {
    return await httpPost<APIResponse<void>>(`/lessons/view/${id}`);
};

export const downloadDocument = async (lessonId: number): Promise<Blob> => {
    if (!lessonId) {
        throw new Error("Thiếu ID lesson để tải tài liệu");
    }

    const response = await api.get<Blob>(`/lessons/${lessonId}/document`, {
        responseType: "blob",
    });

    return response.data;
};

export const downloadSubFile = async (lessonId: number): Promise<Blob> => {
    if (!lessonId) {
        throw new Error("Thiếu ID lesson để tải sub file");
    }

    const response = await api.get<Blob>(`/lessons/${lessonId}/download-subfile`, {
        responseType: "blob",
    });

    return response.data;
};

export const uploadLesson = async (
    videoFile: File,
    lessonData: LessonRequest,
    documentFile?: File,
    subFile?: File
): Promise<APIResponse<LessonResponse>> => {
    const formData = new FormData();
    formData.append("video", videoFile);
    if (documentFile) {
        formData.append("document", documentFile);
    }
    if (subFile) {
        formData.append("subfile", subFile);
    }
    formData.append("data", JSON.stringify(lessonData));

    const response = await api.post<APIResponse<LessonResponse>>("/lessons/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};

export const getMyLesson = async () => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/my-lesson`);
};

export const updateMyLesson = async (id: number, lessonData: LessonRequest): Promise<APIResponse<LessonResponse>> => {
    const response = await api.put<APIResponse<LessonResponse>>(`/lessons/my-lesson/${id}`, lessonData);
    return response.data;
};

export const deleteMyLesson = async (id: number): Promise<APIResponse<void>> => {
    const response = await api.delete<APIResponse<void>>(`/lessons/my-lesson/${id}`);
    return response.data;
};


