import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUser, hideUser } from '../../../apis/UserApi';
import PageHeader from '../contents/components/PageHeader';
import Stats from '../contents/components/Stats';
import Filter from '../contents/components/Filter';
import Table from '../contents/components/Table';
import LoadingState from '../contents/components/LoadingState';
import EmptyState from '../contents/components/EmptyState';
import ErrorAlert from '../contents/components/ErrorAlert';
import type { UserResponse } from '../../../models/response/UserResponse';
// import '../../../styles/pages/_users.css';

type StatusFilter = 'all' | 'visible' | 'hidden';

const UserList: React.FC = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUser();
            setUsers(data?.resultList ?? []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải người dùng';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, refreshKey]);

    const handleToggleStatus = useCallback(async (user: UserResponse) => {
        const { id, username, hide } = user;
        const confirmMessage = user.hide
            ? `Bạn có muốn kích hoạt lại tài khoản "${username}"?`
            : `Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${username}"?`;

        const confirmToggle = window.confirm(confirmMessage);
        if (!confirmToggle) return;

        try {
            setUpdatingId(id);
            await hideUser(id, { hide: !hide, updatedAt: new Date() });
            setUsers((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, hide: !hide } : item
                )
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái người dùng.';
            setError(message);
        } finally {
            setUpdatingId(null);
        }
    }, [users]);

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

    const renderStatusPill = (isHidden: boolean) => {
        const statusConfig = isHidden
            ? { class: 'is-hidden', text: 'Đang ẩn' }
            : { class: 'is-visible', text: 'Đang hiển thị' };
        return (
            <span className={`user-status-pill ${statusConfig.class}`}>
                {statusConfig.text}
            </span>
        );
    };

    const renderRoleBadge = (roles: any[]) => {
        const roleName = roles?.[0]?.name || 'user';
        return (
            <span className={`user-role-badge role-${roleName.toLowerCase()}`}>
                {roleName.charAt(0).toUpperCase() + roleName.slice(1)}
            </span>
        );
    };

    const tableColumns = [
        {
            key: 'id',
            header: 'Mã',
            render: (usr: UserResponse) => <span className="muted-cell">#{usr.id}</span>
        },
        {
            key: 'username',
            header: 'Tên người dùng',
            render: (usr: UserResponse) => (
                <div>
                    <p className="user-name">{usr.username}</p>
                    <span className="user-meta">{!usr.hide ? 'Đang hoạt động' : 'Không hoạt động'}</span>
                </div>
            )
        },
        {
            key: 'email',
            header: 'Email',
            render: (usr: UserResponse) => <span className="email-cell">{usr.email || '—'}</span>
        },
        {
            key: 'roles',
            header: 'Vai trò',
            render: (usr: UserResponse) => renderRoleBadge(usr.roles)
        },
        {
            key: 'hide',
            header: 'Trạng thái',
            render: (usr: UserResponse) => renderStatusPill(usr.hide)
        },
        {
            key: 'createdAt',
            header: 'Ngày tham gia',
            render: (usr: UserResponse) => (
                <span>{usr.createdAt ? new Date(usr.createdAt).toLocaleDateString('vi-VN') : '—'}</span>
            )
        },
        {
            key: 'actions',
            header: 'Thao tác',
            align: 'right' as const,
            render: (usr: UserResponse) => (
                <div className="user-row-actions">
                    <Link to={`/users/edit/${usr.id}`} className="user-btn subtle">
                        Chỉnh sửa
                    </Link>
                    <button
                        onClick={() => handleToggleStatus(usr)}
                        disabled={updatingId === usr.id}
                        className={`user-btn ${usr.hide ? 'primary' : 'danger'}`}
                    >
                        {updatingId === usr.id ? 'Đang cập nhật...' : usr.hide ? 'Kích hoạt' : 'Vô hiệu hóa'}
                    </button>
                </div>
            )
        }
    ];

    return (
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
                    onRefresh={() => setRefreshKey((prev) => prev + 1)}
                    placeholder="Tìm kiếm theo tên hoặc email…"
                    containerClass="user-filters"
                    searchClass="user-search"
                    filterActionsClass="user-filter-actions"
                    filterChipClass="user-filter-chip"
                    buttonClass="user-btn ghost"
                />
                {loading && <LoadingState />}

                {!loading && filteredUsers.length === 0 && (
                    <EmptyState icon="👥" title="Chưa có người dùng phù hợp" description="Thử thay đổi bộ lọc hoặc mời người dùng mới tham gia nền tảng." />
                )}

                {!loading && filteredUsers.length > 0 && (
                    <div className="user-table-wrapper">
                        <Table columns={tableColumns} data={filteredUsers} keyField="id" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;
