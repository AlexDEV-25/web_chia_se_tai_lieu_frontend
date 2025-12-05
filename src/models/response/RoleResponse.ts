import type { PermissionResponse } from "./PermissionResponse";

export interface RoleResponse {
    name: string;
    description: string;
    permissions: PermissionResponse[];
}
