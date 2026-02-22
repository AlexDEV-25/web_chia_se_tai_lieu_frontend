import type { FollowCountResponse } from '../models/response/FollowCountResponse';
import type { UserFollowResponse } from '../models/response/UserFollowResponse';
import type { APIResponse } from './../models/response/APIResponse';
import { httpGet, httpPost, httpDelete } from "./HttpClient";

export const followUser = async (followingId: number) => {
    return await httpPost<APIResponse<UserFollowResponse>>(`/follows/${followingId}`);
}

export const unfollowUser = async (followingId: number) => {
    return await httpDelete<APIResponse<void>>(`/follows/${followingId}`);
}

// lấy danh sách người dùng mình đang theo dõi
export const getFollowing = async () => {
    return await httpGet<APIResponse<UserFollowResponse>>(`/follows/following`);
}

// lấy danh sách người đang theo dõi mình
export const getFollowers = async () => {
    return await httpGet<APIResponse<UserFollowResponse>>(`/follows/followers`);
}

// lấy danh sách người đang theo dõi mình
export const getmyFollowCount = async () => {
    return await httpGet<APIResponse<FollowCountResponse>>(`/follows/my-follow-count`);
}

// lấy danh sách người đang theo dõi mình
export const getFollowCount = async (userId: number) => {
    return await httpGet<APIResponse<FollowCountResponse>>(`/follows/follow-count/${userId}`);
}

// kiển tra xem mình đã theo dõi người dùng này chưa
export const checkFollowed = async (userId: number) => {
    return await httpGet<APIResponse<boolean>>(`/follows/check/${userId}`);
}

// kiển tra xem mình đã theo dõi người dùng này chưa
export const checkIsMe = async (userId: number) => {
    return await httpGet<APIResponse<boolean>>(`/follows/check-is-me/${userId}`);
}
