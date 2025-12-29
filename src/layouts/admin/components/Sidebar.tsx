import { NavLink } from "react-router-dom";
import { useMemo } from "react";

interface NavSection {
    title: string;
    items: {
        label: string;
        to: string;
        badge?: string;
        description?: string;
    }[];
}

const Sidebar: React.FC = () => {
    const sections = useMemo<NavSection[]>(
        () => [
            {
                title: "Quản lý danh mục",
                items: [
                    {
                        label: "Danh sách danh mục",
                        to: "/admin/categories",
                        description: "Công nghệ thông tin, Ngôn ngữ..."
                    },
                    {
                        label: "Thêm danh mục",
                        to: "/admin/categories/add",
                        badge: "Mới"
                    }
                ]
            },
            {
                title: "Phê duyệt nội dung",
                items: [
                    { label: "Tài liệu chờ duyệt", to: "/admin/documents/pending" },
                    { label: "Bài giảng chờ duyệt", to: "/admin/lessons/pending" }
                ]
            },
            {
                title: "Quản lý người dùng",
                items: [
                    { label: "Danh sách tài khoản", to: "/admin/users" },
                    { label: "Thêm tài khoản", to: "/admin/users/add" },
                    { label: "Tài khoản bị khóa", to: "/admin/users/locked" }
                ]
            },
            {
                title: "Quản lý tương tác",
                items: [
                    { label: "Bình luận", to: "/admin/interactions/comments" },
                    { label: "Đánh giá", to: "/admin/interactions/reviews" }
                ]
            },
            {
                title: "Theo dõi hệ thống",
                items: [
                    { label: "Lưu lượng truy cập", to: "/admin/analytics/traffic" },
                    { label: "Báo cáo thống kê", to: "/admin/analytics/reports" }
                ]
            }
        ],
        []
    );

    return (
        <aside className="admin-sidebar min-h-screen w-72 bg-[#05060C] text-gray-200 shadow-2xl shadow-blue-500/10">
            <div className="px-6 py-8">
                <div className="mb-8 space-y-1">
                    <p className="text-xs uppercase tracking-[0.4em] text-blue-400">Dashboard</p>
                    <h2 className="text-2xl font-semibold text-white">Trang Admin</h2>
                    <p className="text-xs text-gray-500">Kiểm soát toàn bộ hệ thống</p>
                </div>
                <nav className="space-y-6">
                    {sections.map((section) => (
                        <div key={section.title}>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                                {section.title}
                            </p>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive }) =>
                                            [
                                                "group flex flex-col rounded-2xl border border-transparent px-4 py-3 transition-all duration-150",
                                                isActive
                                                    ? "border-sky-400/40 bg-white/5 text-white shadow-lg shadow-sky-500/20"
                                                    : "text-gray-300 hover:border-white/10 hover:bg-white/5"
                                            ].join(" ")
                                        }
                                    >
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <span className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-black">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        {item.description && (
                                            <p className="mt-1 text-xs text-gray-500">{item.description}</p>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
