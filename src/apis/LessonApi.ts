import type { APIResponse } from './../models/response/APIResponse';
import api, { httpGet, httpPost } from "./HttpClient";
import type { LessonResponse } from "./../models/response/LessonResponse";
import type { LessonRequest } from "./../models/request/LessonRequest";
import type { HideRequest } from '../models/request/HideRequest';
import type { LessonStatsResponse } from '../models/response/LessonStatsResponse';
import type { LessonFavoriteResponse } from '../models/response/LessonFavoriteResponse';

export const stats = async () => {
    return await httpGet<APIResponse<LessonStatsResponse>>(`/lessons/stats`);
};

export const search = async (keyword: string, categoryId: number | null) => {
    const url =
        `/lessons/search?` +
        (keyword?.trim() ? `keyword=${keyword.trim()}` : "") +
        (keyword?.trim() && categoryId != null ? "&" : "") +
        (categoryId != null ? `categoryId=${categoryId}` : "");

    return await httpGet<APIResponse<LessonFavoriteResponse>>(url);
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

export const deleteLesson = async (id: number): Promise<APIResponse<void>> => {
    const response = await api.delete<APIResponse<void>>(`/lessons/admin/${id}`);
    return response.data;
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



export const getLessonVideo = async (lessonId: number): Promise<Blob> => {
    if (!lessonId) {
        throw new Error("Thiếu ID lesson để tải video");
    }

    const response = await api.get<Blob>(`/lessons/admin/${lessonId}/video`, {
        responseType: "blob",
    });

    return response.data;
};

export const getPublicLessonVideo = async (lessonId: number): Promise<Blob> => {
    if (!lessonId) {
        throw new Error("Thiếu ID lesson để tải video");
    }

    const response = await api.get<Blob>(`/lessons/${lessonId}/video`, {
        responseType: "blob",
    });

    return response.data;
};

export const getLessonDocument = async (lessonId: number): Promise<Blob> => {
    if (!lessonId) {
        throw new Error("Thiếu ID lesson để tải document");
    }

    const response = await api.get<Blob>(`/lessons/admin/${lessonId}/document`, {
        responseType: "blob",
    });

    return response.data;
};

// lấy danh sách các document công khai và check xem đã favorite hay chưa
export const getAllPublicLesson = async () => {
    return await httpGet<APIResponse<LessonFavoriteResponse>>(`/lessons`);
};

// lấy danh sách tất cả các document công khai của 1 user và check xem đã favorite hay chưa
export const getListLessonByUser = async (userId: number) => {
    return await httpGet<APIResponse<LessonFavoriteResponse>>(`/lessons/user/${userId}`);
};

// lấy danh sách các document công khai cùng 1 user trừ document hiện tại và check xem đã favorite hay chưa
export const getAllLessonByUser = async (lessonId: number, userId: number) => {
    return await httpGet<APIResponse<LessonFavoriteResponse>>(`/lessons/user?lessonId=${lessonId}&userId=${userId}`);
};

// lấy danh sách các document công khai cùng 1 category trừ document hiện tại và check xem đã favorite hay chưa
export const getAllLessonByCategory = async (lessonId: number, categoryId: number) => {
    return await httpGet<APIResponse<LessonFavoriteResponse>>(`/lessons/category?lessonId=${lessonId}&categoryId=${categoryId}`);
};

// lấy số lượng lesson của chính mình
export const countMyLesson = async () => {
    return await httpGet<APIResponse<number>>(`/lessons/my-lesson/count`);
};

// lấy số lượng lessons của user đã duyệt và không bị ẩn
export const countLessonOfUser = async (userId: number) => {
    return await httpGet<APIResponse<number>>(`/lessons/count/${userId}`);
};

