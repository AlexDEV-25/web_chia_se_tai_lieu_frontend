import type { ContentStatus } from "../../enum/common";

export interface DocumentUserResponse {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    viewsCount: number;
    downloadsCount: number;
    status: ContentStatus;
}
