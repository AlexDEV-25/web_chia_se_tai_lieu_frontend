import type { InteractionType } from "../enum/common";

export interface CommentRequest {
    content: string;
    parentId: number | null;
    hide: boolean;
    contentId: number;
    type: InteractionType;
}
