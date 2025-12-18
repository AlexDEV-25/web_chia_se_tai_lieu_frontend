import type { APIResponse } from './../models/response/APIResponse';
import api, { httpGet, httpPost } from "./HttpClient";
import type { LessonResponse } from "./../models/response/LessonResponse";
import type { LessonRequest } from "./../models/request/LessonRequest";

export const getAllLessonByCategory = async (id: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/category/${id}`);
}

export const getAllLessonByUser = async (id: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/user/${id}`);
}

export const getLessonById = async (id: number) => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons/${id}`);
}

export const getAllLesson = async () => {
    return await httpGet<APIResponse<LessonResponse>>(`/lessons`);
}

export const increaseView = async (id: number) => {
    return await httpPost<APIResponse<void>>(`/lessons/view/${id}`);
}

export const downloadDocument = async (fileName: string): Promise<Blob> => {
    if (!fileName) {
        throw new Error("Thiếu tên file để tải xuống");
    }

    const response = await api.get<Blob>(`/lessons/download-document`, {
        params: { fileName },
        responseType: "blob",
    });

    return response.data;
}

export const downloadSubFile = async (fileName: string): Promise<Blob> => {
    if (!fileName) {
        throw new Error("Thiếu tên file để tải xuống");
    }

    const response = await api.get<Blob>(`/lessons/download-subfile`, {
        params: { fileName },
        responseType: "blob",
    });

    return response.data;
}

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
}