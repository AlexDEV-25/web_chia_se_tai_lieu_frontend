import { Document } from "./../models/Document";
import { my_request_get } from "./Request";



const link: string = "http://localhost:8080/api/documents";

async function getDocument(link: string): Promise<Document[]> {
    const listDocument: Document[] = [];
    const response = await my_request_get(link);
    for (const data of response) {
        listDocument.push(new Document(data.id, data.title, data.fileUrl,
            data.fileData, data.type, data.description, data.thumbnailUrl, data.viewsCount, data.downloadsCount, data.createdAt, data.hide));
    }
    return listDocument as Document[];
}


export async function getAllDocument(): Promise<Document[]> {
    return getDocument(link);
}

export async function getAllDocumentByCategory(id: number): Promise<Document[]> {
    return getDocument(link + "/category/" + id);
}

export async function getDocumentById(id: number): Promise<Document[]> {
    return getDocument(link + "/" + id);
}