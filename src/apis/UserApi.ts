import { User } from "../models/User";
import { my_request_get, my_request_delete, my_request_post, my_request_put } from "./Request";

const link: string = "http://localhost:8080/api/users";

export async function checkEmailExist(email: string): Promise<boolean> {
    const response = await my_request_get(link + "/email/" + email);
    return response;
}