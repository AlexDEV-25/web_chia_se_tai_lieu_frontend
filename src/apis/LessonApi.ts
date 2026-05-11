import type { APIResponse } from '../models/response/APIResponse';
import api, { httpGet, httpPost, httpPut, httpDelete } from "./HttpClient";
import type { LessonDetailResponse } from "../models/response/lesson/LessonDetailResponse";
import type { LessonRequest } from "../models/request/LessonRequest";
import type { LessonStatsResponse } from '../models/response/lesson/LessonStatsResponse';
import type { LessonResponse } from '../models/response/lesson/LessonResponse';
import type { LessonUserResponse } from '../models/response/lesson/LessonUserResponse';
import type { LessonAdminResponse } from '../models/response/lesson/LessonAdminResponse';
import type { RatingAdminResponse } from '../models/response/rating/RatingAdminResponse';
import type { ReportAdminResponse } from '../models/response/report/ReportAdminResponse';

// ============ PUBLIC LESSON (/api/lessons) ============

export const stats = async () => {
    return await httpGet<APIResponse<LessonStatsResponse>>(`/lessons/stats`);
};

export const search = async (keyword: string, categoryId: number | null) => {
    const url =
        `/lessons/search?` +
        (keyword?.trim() ? `keyword=${keyword.trim()}` : "") +
        (keyword?.trim() && categoryId != null ? "&" : "") +
        (categoryId != null ? `categoryId=${categoryId}` : "");

    return await httpGet<APIResponse<LessonResponse>>(url);
};

export const getPublicLessonById = async (id: number) => {
    return await httpGet<APIResponse<LessonDetailResponse>>(`/lessons/${id}`);
};

export const getAllPublicLesson = async () => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons`);
};

export const increaseView = async (id: number) => {
    return await httpPost<APIResponse<void>>(`/lessons/view/${id}`);
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

export const downloadDocument = async (lessonId: number): Promise<Blob> => {
    if (!lessonId) {
        throw new Error("Thiếu ID lesson để tải tài liệu");
    }

    const response = await api.get<Blob>(`/lessons/${lessonId}/download-document`, {
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

// ============ USER-RELATED LESSON ============

export const getListLessonByUser = async (userId: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/user/${userId}`);
};

export const getAllLessonByUser = async (lessonId: number, userId: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/user?lessonId=${lessonId}&userId=${userId}`);
};

export const getAllLessonByCategory = async (lessonId: number, categoryId: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/category?categoryId=${categoryId}&lessonId=${lessonId}`);
};

export const countLessonOfUser = async (userId: number) => {
    return await httpGet<APIResponse<number>>(`/lessons/count/${userId}`);
};

// ============ MY-LESSON (/api/lessons/my-lesson) ============

export const getMyLesson = async () => {
    return await httpGet<APIResponse<LessonUserResponse>>(`/lessons/my-lesson`);
};

export const getDetailMyLesson = async (id: number): Promise<APIResponse<LessonDetailResponse>> => {
    return await httpGet<APIResponse<LessonDetailResponse>>(`/lessons/my-lesson/${id}`);
};

export const updateMyLesson = async (id: number, lessonData: LessonRequest): Promise<APIResponse<LessonUserResponse>> => {
    return await httpPut<APIResponse<LessonUserResponse>>(`/lessons/my-lesson/${id}`, lessonData);
};

export const deleteMyLesson = async (id: number): Promise<APIResponse<void>> => {
    return await httpDelete<APIResponse<void>>(`/lessons/my-lesson/${id}`);
};

export const countMyLesson = async () => {
    return await httpGet<APIResponse<number>>(`/lessons/my-lesson/count`);
};

// ============ ADMIN LESSON (/api/lessons/admin) ============

export const getAllLesson = async () => {
    return await httpGet<APIResponse<LessonAdminResponse>>(`/lessons/admin`);
};

export const getLessonById = async (id: number) => {
    return await httpGet<APIResponse<LessonDetailResponse>>(`/lessons/admin/${id}`);
};

export const updateLesson = async (id: number, lessonData: LessonRequest): Promise<APIResponse<LessonDetailResponse>> => {
    return await httpPut<APIResponse<LessonDetailResponse>>(`/lessons/admin/${id}`, lessonData);
};

export const deleteLesson = async (id: number): Promise<APIResponse<void>> => {
    return await httpDelete<APIResponse<void>>(`/lessons/admin/${id}`);
};

// ============ RATING & REPORT SUMMARY ============

export const getAllLessonRatingSummary = async () => {
    return await httpGet<APIResponse<RatingAdminResponse>>(`/ratings/admin/lesson`);
};

export const getAllLessonReportSummary = async () => {
    return await httpGet<APIResponse<ReportAdminResponse>>(`/reports/admin/lesson`);
};
