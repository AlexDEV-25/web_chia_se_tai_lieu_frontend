import type { PermissionResponse } from '../permission/PermissionResponse';

export interface RoleResponse {
    name: string;
    description?: string;
    permissions: PermissionResponse[];
}
