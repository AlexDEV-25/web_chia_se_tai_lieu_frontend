import type { ContentStatus } from "../../enum/common";

export interface LessonUserResponse {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    viewsCount: number;
    status: ContentStatus;
}
