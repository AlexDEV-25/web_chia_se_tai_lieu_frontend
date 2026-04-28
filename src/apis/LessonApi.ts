import type { APIResponse } from '../models/response/APIResponse';
import api, { httpGet, httpPost, httpPut, httpDelete } from "./HttpClient";
import type { LessonDetailResponse } from "../models/response/lesson/LessonDetailResponse";
import type { LessonRequest } from "../models/request/LessonRequest";
import type { HideRequest } from '../models/request/HideRequest';
import type { LessonStatsResponse } from '../models/response/lesson/LessonStatsResponse';
import type { LessonFavoriteResponse } from '../models/response/lesson/LessonFavoriteResponse';
import type { LessonUserResponse } from '../models/response/lesson/LessonUserResponse';
import type { LessonAdminResponse } from '../models/response/lesson/LessonAdminResponse';
import type { RatingAdminResponse } from '../models/response/rating/RatingAdminResponse';
import type { ReportAdminResponse } from '../models/response/report/ReportAdminResponse';

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
    return await httpGet<APIResponse<LessonDetailResponse>>(`/lessons/admin/${id}`);
};

export const getPublicLessonById = async (id: number) => {
    return await httpGet<APIResponse<LessonDetailResponse>>(`/lessons/${id}`);
};

export const getAllLesson = async () => {
    return await httpGet<APIResponse<LessonAdminResponse>>(`/lessons/admin`);
};

export const deleteLesson = async (id: number): Promise<APIResponse<void>> => {
    return await httpDelete<APIResponse<void>>(`/lessons/admin/${id}`);
};

export const hideLesson = async (id: number, data: HideRequest): Promise<APIResponse<LessonDetailResponse>> => {
    return await httpPut<APIResponse<LessonDetailResponse>>(`/lessons/admin/hide/${id}`, data);
};

export const updateLesson = async (id: number, lessonData: LessonRequest): Promise<APIResponse<LessonDetailResponse>> => {
    return await httpPut<APIResponse<LessonDetailResponse>>(`/lessons/admin/${id}`, lessonData);
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
): Promise<APIResponse<LessonDetailResponse>> => {
    const formData = new FormData();
    formData.append("video", videoFile);
    if (documentFile) {
        formData.append("document", documentFile);
    }
    if (subFile) {
        formData.append("subfile", subFile);
    }
    formData.append("data", JSON.stringify(lessonData));

    const response = await api.post<APIResponse<LessonDetailResponse>>("/lessons/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};

export const getMyLesson = async () => {
    return await httpGet<APIResponse<LessonUserResponse>>(`/lessons/my-lesson`);
};

export const updateMyLesson = async (id: number, lessonData: LessonRequest): Promise<APIResponse<LessonUserResponse>> => {
    return await httpPut<APIResponse<LessonUserResponse>>(`/lessons/my-lesson/${id}`, lessonData);
};

export const deleteMyLesson = async (id: number): Promise<APIResponse<void>> => {
    return await httpDelete<APIResponse<void>>(`/lessons/my-lesson/${id}`);
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

export const getAllPublicLesson = async () => {
    return await httpGet<APIResponse<LessonFavoriteResponse>>(`/lessons`);
};

export const getListLessonByUser = async (userId: number) => {
    return await httpGet<APIResponse<LessonFavoriteResponse>>(`/lessons/user/${userId}`);
};

export const getAllLessonByUser = async (lessonId: number, userId: number) => {
    return await httpGet<APIResponse<LessonFavoriteResponse>>(`/lessons/user?lessonId=${lessonId}&userId=${userId}`);
};

export const getAllLessonByCategory = async (lessonId: number, categoryId: number) => {
    return await httpGet<APIResponse<LessonFavoriteResponse>>(`/lessons/category?categoryId=${categoryId}&lessonId=${lessonId}`);
};

// lấy số lượng lesson của chính mình
export const countMyLesson = async () => {
    return await httpGet<APIResponse<number>>(`/lessons/my-lesson/count`);
};

// lấy số lượng lessons của user đã duyệt và không bị ẩn
export const countLessonOfUser = async (userId: number) => {
    return await httpGet<APIResponse<number>>(`/lessons/count/${userId}`);
};

export const getAllLessonRatingSummary = async () => {
    return await httpGet<APIResponse<RatingAdminResponse>>(`/ratings/admin/lesson`);
};

export const getAllLessonReportSummary = async () => {
    return await httpGet<APIResponse<ReportAdminResponse>>(`/reports/admin/lesson`);
};

