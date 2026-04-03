export interface DocumentFavoriteResponse {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    username: string;
    viewsCount: number;
    downloadsCount: number;
    favorite: boolean;
}
