import type { ContentStatus } from "../../enum/common";

export interface DocumentAdminResponse {
    id: number;
    title: string;
    description: string;
    categoryName: string;
    status: ContentStatus;
}
