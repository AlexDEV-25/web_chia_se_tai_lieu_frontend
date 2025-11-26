import { User } from "../models/User";
import { my_request_get, my_request_delete, my_request_post, my_request_put } from "./Request";

const link: string = "http://localhost:8080/api/register";

export async function register(user: User): Promise<void> {
    await my_request_post(link, user);
}