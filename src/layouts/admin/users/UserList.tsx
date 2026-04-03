import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getAllUser, hideUser } from '../../../apis/UserApi';
import PageHeader from '../components/PageHeader';
import Stats from '../components/Stats';
import Filter from '../components/Filter';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import ConfirmDialog from '../components/ConfirmDialog';
import LeftSidebar from '../components/LeftSidebar';
import type { UserResponse } from '../../../models/response/user/UserResponse';
import { handleApiError } from '../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../constants/messages';
import { renderStatusPill } from '../components/StatusPill';

type StatusFilter = 'all' | 'visible' | 'hidden';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; user?: UserResponse } | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllUser();
            setUsers(response?.resultList ?? []);
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.USER_LOAD_FAILED);
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleStatus = useCallback((user: UserResponse) => {
        setConfirmDialog({ isOpen: true, user });
    }, []);

    const handleConfirm = useCallback(async () => {
        if (!confirmDialog?.user) return;

        const { user } = confirmDialog;
        const { id, hide } = user;

        try {
            setUpdatingId(id);
            await hideUser(id, { hide: !hide, updatedAt: new Date() });
            setUsers((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, hide: !hide } : item
                )
            );
        } catch (err: any) {
            const message = handleApiError(err, ERROR_MESSAGES.USER_UPDATE_FAILED);
            setError(message);
        } finally {
            setUpdatingId(null);
        }

        setConfirmDialog(null);
    }, [confirmDialog, users]);

    const handleCancel = useCallback(() => {
        setConfirmDialog(null);
    }, []);

    const filteredUsers = useMemo(() => {
        const lowerSearch = searchTerm.trim().toLowerCase();
        return users.filter((user) => {
            const matchesSearch =
                lowerSearch.length === 0 ||
                user.username.toLowerCase().includes(lowerSearch) ||
                user.email?.toLowerCase().includes(lowerSearch);
            const userStatus = user.hide ? 'hidden' : 'visible';
            const matchesStatus =
                statusFilter === 'all' ||
                userStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [users, searchTerm, statusFilter]);

    const stats = useMemo(() => {
        const total = users.length;
        const visible = users.filter((usr) => !usr.hide).length;
        const hidden = users.filter((usr) => usr.hide).length;
        return { total, visible, hidden };
    }, [users]);

    const renderRoleBadge = (roles: any[]) => {
        const roleName = roles?.[0]?.name || 'user';
        return (
            <span className={`user-role-badge role-${roleName.toLowerCase()}`}>
                {roleName.charAt(0).toUpperCase() + roleName.slice(1)}
            </span>
        );
    };

    return (
        <div className="admin-page-layout">
            <LeftSidebar />
            <div className="admin-user-page">
                <div className="user-container">
                    <PageHeader
                        eyebrow="Quản trị hệ thống"
                        title="Quản lý người dùng"
                        description="Theo dõi và quản lý tài khoản người dùng để đảm bảo an toàn hệ thống."
                        addButtonText="Thêm người dùng"
                        addButtonLink="/users/add"
                        containerClass="user-page-header"
                        headingClass="user-heading"
                        eyebrowClass="user-eyebrow"
                        buttonClass="user-btn primary"
                    />

                    {error && (
                        <ErrorAlert message={error} onRetry={fetchUsers} />
                    )}

                    <Stats stats={stats} containerClass="user-stats" cardClass="user-stat-card" />

                    <Filter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        filterValue={statusFilter}
                        onFilterChange={setStatusFilter}
                        placeholder="Tìm kiếm theo tên hoặc email…"
                        containerClass="user-filters"
                        searchClass="user-search"
                        filterActionsClass="user-filter-actions"
                        filterChipClass="user-filter-chip"
                    />
                    {loading && <LoadingState rows={5} variant="table" />}

                    {!loading && filteredUsers.length === 0 && (
                        <EmptyState icon="👥" title="Chưa có người dùng phù hợp" description="Thử thay đổi bộ lọc hoặc mời người dùng mới tham gia nền tảng." />
                    )}

                    {!loading && filteredUsers.length > 0 && (
                        <div className="user-table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Tên người dùng</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Trạng thái</th>
                                        <th>Ngày tham gia</th>
                                        <th className="text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((usr) => (
                                        <tr key={usr.id}>
                                            <td><span className="muted-cell">#{usr.id}</span></td>
                                            <td>
                                                <div>
                                                    <p className="user-name">{usr.username}</p>
                                                    <span className="user-meta">{!usr.hide ? 'Đang hoạt động' : 'Không hoạt động'}</span>
                                                </div>
                                            </td>
                                            <td><span className="email-cell">{usr.email || '—'}</span></td>
                                            <td>{renderRoleBadge(usr.roles)}</td>
                                            <td>{renderStatusPill(usr.hide)}</td>
                                            <td><span>{usr.createdAt ? new Date(usr.createdAt).toLocaleDateString('vi-VN') : '—'}</span></td>
                                            <td className="text-right">
                                                <div className="user-row-actions">
                                                    <button
                                                        onClick={() => handleToggleStatus(usr)}
                                                        disabled={updatingId === usr.id}
                                                        className={`user-btn ${usr.hide ? 'primary' : 'danger'}`}
                                                    >
                                                        {updatingId === usr.id ? 'Đang cập nhật...' : usr.hide ? 'Kích hoạt' : 'Vô hiệu hóa'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {confirmDialog?.isOpen && confirmDialog.user && (
                <ConfirmDialog
                    isOpen={true}
                    title={
                        confirmDialog.user.hide
                            ? 'Kích hoạt tài khoản'
                            : 'Vô hiệu hóa tài khoản'
                    }
                    message={
                        confirmDialog.user.hide
                            ? `Bạn có muốn kích hoạt lại tài khoản "${confirmDialog.user.username}"?`
                            : `Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${confirmDialog.user.username}"?`
                    }
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    confirmText={confirmDialog.user.hide ? 'Kích hoạt' : 'Vô hiệu hóa'}
                    cancelText="Hủy"
                />
            )}
        </div>
    );
};

export default UserList;
