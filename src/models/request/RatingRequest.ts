import type { InteractionType } from "../enum/common";

export interface RatingRequest {
    rating: number;
    contentId: number;
    type: InteractionType;
}
