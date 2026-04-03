import api from "./HttpClient";

export const getAvatar = async (name: string): Promise<Blob> => {
    const response = await api.get<Blob>(`/images/avatar/${name}`, {
        responseType: "blob",
    });
    return response.data;
};

export const getThumbnail = async (name: string): Promise<Blob> => {
    const response = await api.get<Blob>(`/images/thumbnail/${name}`, {
        responseType: "blob",
    });
    return response.data;
};
