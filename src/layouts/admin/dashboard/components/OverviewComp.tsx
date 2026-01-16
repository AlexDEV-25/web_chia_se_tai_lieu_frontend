import React, { useEffect, useState } from 'react';
import { getAllDocument } from '../../../../apis/DocumentApi';
import { getAllLesson } from '../../../../apis/LessonApi';
import { getAllUser } from '../../../../apis/UserApi';
import OverviewCard from './child_components/OverviewCard';
import type { DocumentResponse } from '../../../../models/response/DocumentResponse';
import type { LessonResponse } from '../../../../models/response/LessonResponse';
import type { UserResponse } from '../../../../models/response/UserResponse';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';

const OverviewComp: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState<DocumentResponse[]>([]);
    const [lessons, setLessons] = useState<LessonResponse[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [docsData, lessonsData, usersData] = await Promise.all([
                    getAllDocument(),
                    getAllLesson(),
                    getAllUser()
                ]);
                setDocuments(docsData?.resultList ?? []);
                setLessons(lessonsData?.resultList ?? []);
                setUsers(usersData?.resultList ?? []);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.LOAD_FAILED);
                console.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const calculateStats = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const documentsToday = documents.filter(d => {
            const docDate = new Date(d.createdAt);
            docDate.setHours(0, 0, 0, 0);
            return docDate.getTime() === today.getTime();
        }).length;

        const lessonsToday = lessons.filter(l => {
            const lessonDate = new Date(l.createdAt);
            lessonDate.setHours(0, 0, 0, 0);
            return lessonDate.getTime() === today.getTime();
        }).length;

        const documentsThisWeek = documents.filter(d => {
            const docDate = new Date(d.createdAt);
            return docDate >= weekAgo;
        }).length;

        const lessonsThisWeek = lessons.filter(l => {
            const lessonDate = new Date(l.createdAt);
            return lessonDate >= weekAgo;
        }).length;

        const pendingDocuments = documents.filter(d => d.status === 'PENDING').length;
        const pendingLessons = lessons.filter(l => l.status === 'PENDING').length;

        const totalDownloads = documents.reduce((sum, d) => sum + (d.downloadsCount ?? 0), 0);

        return {
            totalUsers: users.length,
            totalDocuments: documents.length,
            totalLessons: lessons.length,
            documentsToday,
            lessonsToday,
            documentsThisWeek,
            lessonsThisWeek,
            pendingDocuments,
            pendingLessons,
            totalDownloads
        };
    };

    const stats = calculateStats();

    if (loading) {
        return <div className="overview-loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="overview-grid">
            <OverviewCard
                icon="👥"
                title="Tổng số người dùng"
                value={stats.totalUsers}
                color="blue"
            />

            <OverviewCard
                icon="📚"
                title="Tổng tài liệu & bài giảng"
                value={stats.totalDocuments + stats.totalLessons}
                subtitle={`${stats.totalDocuments} tài liệu, ${stats.totalLessons} bài giảng`}
                color="green"
            />

            <OverviewCard
                icon="⭐"
                title="Mới hôm nay"
                value={stats.documentsToday + stats.lessonsToday}
                subtitle={`${stats.documentsToday} tài liệu, ${stats.lessonsToday} bài giảng`}
                color="orange"
            />

            <OverviewCard
                icon="📅"
                title="Mới tuần này"
                value={stats.documentsThisWeek + stats.lessonsThisWeek}
                subtitle={`${stats.documentsThisWeek} tài liệu, ${stats.lessonsThisWeek} bài giảng`}
                color="purple"
            />

            <OverviewCard
                icon="⬇️"
                title="Lượt tải xuống"
                value={stats.totalDownloads}
                color="blue"
            />

            <OverviewCard
                icon="⏳"
                title="Chờ duyệt"
                value={stats.pendingDocuments + stats.pendingLessons}
                subtitle={`${stats.pendingDocuments} tài liệu, ${stats.pendingLessons} bài giảng`}
                color="red"
            />
        </div>
    );
};

export default OverviewComp;
