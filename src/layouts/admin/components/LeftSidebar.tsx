import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    label: string;
    path: string;
    icon: string;
}

const LeftSidebar: React.FC = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems: NavItem[] = [
        { label: 'Bảng điều khiển', path: '/dashboard', icon: '📊' },
        { label: 'Danh mục', path: '/categories', icon: '📁' },
        { label: 'Tài liệu', path: '/documents', icon: '📄' },
        { label: 'Bài giảng', path: '/lessons', icon: '🎓' },
        { label: 'Người dùng', path: '/users', icon: '👥' },
        { label: 'Bình luận', path: '/comments', icon: '💬' }
    ];

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={`admin-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}>
            <div className="sidebar-header">
                <button
                    className="sidebar-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label="Toggle sidebar"
                >
                    <i className={`fa fa-${isCollapsed ? 'chevron-right' : 'chevron-left'}`} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item) => (
                        <li key={item.path} className="nav-item">
                            <Link
                                to={item.path}
                                className={`nav-link ${isActive(item.path) ? 'is-active' : ''}`}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default LeftSidebar;
