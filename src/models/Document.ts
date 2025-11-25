export class Document {
    id: number;
    title: string;
    fileUrl: string;
    fileData: string;
    type: String;
    description?: string;
    thumbnailUrl?: string;
    viewsCount?: number;
    downloadsCount?: number;
    createdAt?: string;
    hide: Boolean;

    constructor(
        id: number,
        title: string,
        fileUrl: string,
        fileData: string,
        type: String,
        description?: string,
        thumbnailUrl?: string,
        viewsCount?: number,
        downloadsCount?: number,
        createdAt?: string,
        hide: Boolean = false
    ) {
        this.id = id;
        this.title = title;
        this.fileUrl = fileUrl;
        this.fileData = fileData;
        this.type = type;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.viewsCount = viewsCount;
        this.downloadsCount = downloadsCount;
        this.createdAt = createdAt;
        this.hide = hide;
    }
}
