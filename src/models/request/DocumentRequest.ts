import type { ContentStatus } from "../enum/common";

export interface DocumentRequest {
    title: string;
    description: string;
    status: ContentStatus;
    hide: boolean;
    categoryId: number | null;
}
