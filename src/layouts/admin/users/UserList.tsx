import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUser, hideUser } from '../../../apis/UserApi';

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
        const { id, username } = user;
        const newHide = !user.hide;
        const confirmMessage = user.hide
            ? `Bạn có muốn kích hoạt lại tài khoản "${username}"?`
            : `Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${username}"?`;

        const confirmToggle = window.confirm(confirmMessage);
        if (!confirmToggle) return;

        try {
            setUpdatingId(id);
            await hideUser(id, newHide);
            setUsers((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, hide: newHide } : item
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

    const renderTable = () => {
        if (loading) {
            return (
                <div className="user-card">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="user-loading-row" />
                    ))}
                </div>
            );
        }

        if (!loading && filteredUsers.length === 0) {
            return (
                <div className="user-empty-state">
                    <div className="empty-icon">👥</div>
                    <p className="empty-title">Chưa có người dùng phù hợp</p>
                    <p className="empty-desc">
                        Thử thay đổi bộ lọc hoặc mời người dùng mới tham gia nền tảng.
                    </p>
                </div>
            );
        }

        return (
            <div className="user-table-wrapper">
                <table className="user-table">
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
                                <td className="muted-cell">#{usr.id}</td>
                                <td>
                                    <p className="user-name">{usr.username}</p>
                                    <span className="user-meta">
                                        {!usr.hide ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </span>
                                </td>
                                <td className="email-cell">{usr.email || '—'}</td>
                                <td>{renderRoleBadge(usr.roles)}</td>
                                <td>{renderStatusPill(usr.hide)}</td>
                                <td>
                                    {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString('vi-VN') : '—'}
                                </td>
                                <td>
                                    <div className="user-row-actions">
                                        <Link
                                            to={`/users/edit/${usr.id}`}
                                            className="user-btn subtle"
                                        >
                                            Chỉnh sửa
                                        </Link>
                                        <button
                                            onClick={() => handleToggleStatus(usr)}
                                            disabled={updatingId === usr.id}
                                            className={`user-btn ${usr.hide ? 'primary' : 'danger'}`}
                                        >
                                            {updatingId === usr.id
                                                ? 'Đang cập nhật...'
                                                : usr.hide
                                                    ? 'Kích hoạt'
                                                    : 'Vô hiệu hóa'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="admin-user-page">
            <div className="user-container">
                <div className="user-page-header">
                    <div className="user-heading">
                        <p className="user-eyebrow">Quản trị hệ thống</p>
                        <h1>Quản lý người dùng</h1>
                        <p>Theo dõi và quản lý tài khoản người dùng để đảm bảo an toàn hệ thống.</p>
                    </div>
                    <Link to="/users/add" className="user-btn primary">
                        Thêm người dùng
                    </Link>
                </div>

                {error && (
                    <div className="user-alert error">
                        <p>Lỗi: {error}</p>
                        <button type="button" onClick={fetchUsers} className="user-btn ghost">
                            Thử lại
                        </button>
                    </div>
                )}

                <div className="user-stats">
                    <div className="user-stat-card">
                        <span className="stat-label">Tổng người dùng</span>
                        <strong className="stat-value">{stats.total}</strong>
                        <p className="stat-desc">Tất cả tài khoản người dùng</p>
                    </div>
                    <div className="user-stat-card positive">
                        <span className="stat-label">Đang hiển thị</span>
                        <strong className="stat-value">{stats.visible}</strong>
                        <p className="stat-desc">Công khai cho người dùng</p>
                    </div>
                    <div className="user-stat-card warning">
                        <span className="stat-label">Đang ẩn</span>
                        <strong className="stat-value">{stats.hidden}</strong>
                        <p className="stat-desc">Chặn khỏi hệ thống</p>
                    </div>
                </div>

                <div className="user-filters">
                    <div className="user-search">
                        <i className="fa fa-search" aria-hidden="true" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm kiếm theo tên hoặc email…"
                        />
                    </div>
                    <div className="user-filter-actions">
                        <div className="filter-group">
                            <label>Trạng thái:</label>
                            {(['all', 'visible', 'hidden'] as StatusFilter[]).map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setStatusFilter(filter)}
                                    className={`user-filter-chip ${statusFilter === filter ? 'is-active' : ''}`}
                                >
                                    {filter === 'all'
                                        ? 'Tất cả'
                                        : filter === 'visible'
                                            ? 'Đang hiển thị'
                                            : 'Đang ẩn'}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setRefreshKey((prev) => prev + 1)}
                            className="user-btn ghost"
                        >
                            Làm mới
                        </button>
                    </div>
                </div>

                {renderTable()}
            </div>
        </div>
    );
};

export default UserList;
