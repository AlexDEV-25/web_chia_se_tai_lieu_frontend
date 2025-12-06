export default class DocumentRequest {
    title: string;
    type: string;
    description: string;
    viewsCount?: number;
    downloadsCount?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
    hide: boolean;
    categoryId?: number;

    constructor(
        title: string,
        type: string,
        description: string,
        viewsCount?: number,
        downloadsCount?: number,
        createdAt?: string,
        updatedAt?: string,
        status?: string,
        hide: boolean = false,
        categoryId?: number,
    ) {
        this.title = title;
        this.type = type;
        this.description = description;
        this.viewsCount = viewsCount;
        this.downloadsCount = downloadsCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
        this.hide = hide;
        this.categoryId = categoryId;
    }
}
