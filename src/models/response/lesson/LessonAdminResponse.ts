import type { ContentStatus } from "../../enum/common";

export interface LessonAdminResponse {
    id: number;
    title: string;
    description: string;
    categoryName: string;
    status: ContentStatus;
}
