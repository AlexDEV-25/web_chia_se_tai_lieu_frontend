import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getByReceiver, read, readAll } from "../../../../apis/UserNotificationApi";
import type { UserNotificationResponse } from "../../../../models/response/usernotification/UserNotificationResponse";
import { handleApiError } from "../../../../utils/errorHandler";

const ListNotification: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<UserNotificationResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

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
        fetchNotifications();
    }, []);

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

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;

        try {
            setMarkingAllAsRead(true);
            // Get current user ID from notifications (assuming all notifications are for the same user)
            const userId = notifications[0]?.receiverId;
            if (userId) {
                await readAll(userId);
                // Update all notifications as read
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, read: true }))
                );
                setUnreadCount(0);
            }
        } catch (error: any) {
            const message = handleApiError(error, "Không thể đánh dấu tất cả đã đọc");
            console.error(message);
        } finally {
            setMarkingAllAsRead(false);
        }
    };

    const handleNotificationClick = (notification: UserNotificationResponse) => {
        // Close notification dropdown
        setIsOpen(false);

        // Navigate to link if exists
        if (notification.notificationLink) {
            navigate(notification.notificationLink);
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
        <div className="notification-wrapper">
            {/* Notification Bell */}
            <button
                className="notification-bell"
                onClick={() => setIsOpen(!isOpen)}
                title="Thông báo"
            >
                <i className="fa fa-bell-o" />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h5 className="notification-title">Thông báo</h5>
                        <div className="notification-header-actions">
                            {unreadCount > 0 && (
                                <button
                                    className="mark-all-read-btn"
                                    onClick={handleMarkAllAsRead}
                                    disabled={markingAllAsRead}
                                >
                                    {markingAllAsRead ? "Đang xử lý..." : "Đọc tất cả"}
                                </button>
                            )}
                            <button
                                className="notification-close"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                            >
                                <i className="fa fa-times" />
                            </button>
                        </div>
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="notification-loading">
                                <i className="fa fa-spinner fa-spin" />
                                <p>Đang tải thông báo...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">
                                <i className="fa fa-inbox" />
                                <p>Không có thông báo nào</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? `unread ${notification.notificationType.toLowerCase()}` : ""}`}
                                >
                                    <div className="notification-item-header">
                                        <div className="notification-sender">
                                            <i className={`fa ${getNotificationIcon(notification.notificationType)}`} />
                                            <span className="sender-name">{notification.senderName}</span>
                                        </div>
                                        {!notification.read && (
                                            <span className="unread-indicator" />
                                        )}
                                    </div>
                                    <div
                                        className={`notification-content-wrapper ${notification.notificationLink ? 'clickable' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <p className="notification-content">{notification.notificationContent}</p>
                                    </div>
                                    <div className="notification-time">
                                        {new Date(notification.createdAt).toLocaleDateString("vi-VN", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric"
                                        })}{" "}
                                        {new Date(notification.createdAt).toLocaleTimeString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </div>
                                    {!notification.read && (
                                        <button
                                            className="mark-read-btn"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering notification click
                                                handleMarkAsRead(notification.id);
                                            }}
                                        >
                                            <i className="fa fa-check" />
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
