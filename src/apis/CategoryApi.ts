import { Category } from "../models/Category";
import { my_request_get, my_request_delete, my_request_post, my_request_put } from "./Request";


const link: string = "http://localhost:8080/api/categories";

export async function getAllCategory(): Promise<Category[]> {
    const listCategory: Category[] = [];
    const response = await my_request_get(link);
    for (const data of response) {
        listCategory.push(new Category(data.id, data.name, data.description, data.hide));
    }
    return listCategory as Category[];
}
export async function getCategoryById(id: number): Promise<Category> {
    const response = await my_request_get(link + "/" + id);
    return new Category(response.id, response.name, response.description, response.hide);
}
export async function deleteCategory(id: number): Promise<void> {
    await my_request_delete(link + "/" + id);
}

export async function addCategory(category: Category): Promise<void> {
    await my_request_post(link, category);
}

export async function updateCategory(category: Category): Promise<void> {
    await my_request_put(link + "/" + category.id, category);
}

