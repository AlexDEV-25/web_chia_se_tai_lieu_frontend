import type { InteractionType } from "../enum/common";

export interface FavoriteRequest {
    contentId: number;
    type: InteractionType;
}
