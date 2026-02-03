import { useEffect, useState } from "react";
import { getByReceiver, read } from "../../../../apis/UserNotificationApi";
import type { UserNotificationResponse } from "../../../../models/response/UserNotificationResponse";
import { handleApiError } from "../../../../utils/errorHandler";

const ListNotification: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<UserNotificationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await getByReceiver();
            const notificationList = response.resultList || [];
            setNotifications(notificationList);
            const unread = notificationList.filter((n) => !n.read).length;
            setUnreadCount(unread);
        } catch (error: any) {
            const message = handleApiError(error, "Không thể tải thông báo");
            console.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await read(notificationId);
            // Update notification status
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error: any) {
            const message = handleApiError(error, "Không thể đánh dấu đã đọc");
            console.error(message);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "SUCCESS":
                return "fa-check-circle text-success";
            case "WARNING":
                return "fa-exclamation-circle text-warning";
            case "ERROR":
                return "fa-times-circle text-danger";
            case "INFO":
            default:
                return "fa-info-circle text-info";
        }
    };

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            {/* Notification Bell */}
            <button
                className="btn btn-link position-relative"
                onClick={() => setIsOpen(!isOpen)}
                title="Thông báo"
                style={{ color: "rgba(255, 255, 255, 0.7)", padding: "0.5rem" }}
            >

                <i
                    className="fa fa-bell-o"
                    style={{ fontSize: "1.25rem", color: "#ffc107" }}
                />
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div
                    className="card position-absolute border shadow-lg"
                    style={{
                        top: "calc(100% + 10px)",
                        right: 0,
                        width: "380px",
                        maxHeight: "600px",
                        zIndex: 1050,
                        maxWidth: "95vw",
                    }}
                >
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Thông báo</h5>
                        <button
                            className="btn-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                        />
                    </div>

                    <div style={{ maxHeight: "480px", overflowY: "auto" }}>
                        {loading ? (
                            <div className="text-center text-muted py-5">
                                <p>Đang tải...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center text-muted py-5">
                                <i className="fa fa-inbox" style={{ fontSize: "2.5rem", opacity: 0.5 }} />
                                <p className="mt-2">Không có thông báo nào</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 border-bottom ${!notification.read ? "bg-light" : ""}`}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <i
                                                className={`fa ${getNotificationIcon(
                                                    notification.notificationType
                                                )}`}
                                            />
                                            <strong>{notification.senderName}</strong>
                                        </div>
                                        {!notification.read && (
                                            <span
                                                className="rounded-circle bg-primary"
                                                style={{ width: "8px", height: "8px" }}
                                            />
                                        )}
                                    </div>
                                    <p className="mb-2 text-dark small">
                                        {notification.notificationContent}
                                    </p>
                                    <small className="text-muted d-block mb-2">
                                        {new Date(notification.createdAt).toLocaleDateString(
                                            "vi-VN"
                                        )}{" "}
                                        {new Date(notification.createdAt).toLocaleTimeString(
                                            "vi-VN",
                                            { hour: "2-digit", minute: "2-digit" }
                                        )}
                                    </small>
                                    {!notification.read && (
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                        >
                                            Đánh dấu đã đọc
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListNotification;
