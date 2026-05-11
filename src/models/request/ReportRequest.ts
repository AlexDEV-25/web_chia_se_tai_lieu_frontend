import type { InteractionType } from "../enum/common";

export interface ReportRequest {
    contentId: number;
    reason: string;
    type: InteractionType;
}
