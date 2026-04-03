import type { FollowCountResponse } from '../models/response/userfollow/FollowCountResponse';
import type { UserFollowResponse } from '../models/response/userfollow/UserFollowResponse';
import type { APIResponse } from './../models/response/APIResponse';
import { httpGet, httpPost, httpDelete } from "./HttpClient";

export const followUser = async (followingId: number) => {
    return await httpPost<APIResponse<UserFollowResponse>>(`/follows/${followingId}`);
}

export const unfollowUser = async (followingId: number) => {
    return await httpDelete<APIResponse<void>>(`/follows/${followingId}`);
}

export const getFollowing = async () => {
    return await httpGet<APIResponse<UserFollowResponse>>(`/follows/following`);
}

export const getFollowers = async () => {
    return await httpGet<APIResponse<UserFollowResponse>>(`/follows/followers`);
}

export const getMyFollowCount = async () => {
    return await httpGet<APIResponse<FollowCountResponse>>(`/follows/my-follow-count`);
}

export const getFollowCount = async (userId: number) => {
    return await httpGet<APIResponse<FollowCountResponse>>(`/follows/follow-count/${userId}`);
}

export const checkFollowed = async (userId: number) => {
    return await httpGet<APIResponse<boolean>>(`/follows/check/${userId}`);
}

export const checkIsMe = async (userId: number) => {
    return await httpGet<APIResponse<boolean>>(`/follows/check-is-me/${userId}`);
}
