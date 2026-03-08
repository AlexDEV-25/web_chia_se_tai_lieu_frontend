import React, { useEffect, useState } from 'react';
import { getAllUser } from '../../../../apis/UserApi';
import { userLast7Days, documentLast7Days, lessonLast7Days } from '../../../../apis/StatisticsApi';
import OverviewCard from './child_components/OverviewCard';
import type { UserResponse } from '../../../../models/response/UserResponse';
import type { DailyCountResponse } from '../../../../models/response/DailyCountResponse';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';
import LoadingState from '../../components/LoadingState';

const OverviewComp: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [userStats, setUserStats] = useState<DailyCountResponse[]>([]);
    const [documentStats, setDocumentStats] = useState<DailyCountResponse[]>([]);
    const [lessonStats, setLessonStats] = useState<DailyCountResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersData, userStatsData, documentStatsData, lessonStatsData] = await Promise.all([
                    getAllUser(),
                    userLast7Days(),
                    documentLast7Days(),
                    lessonLast7Days()
                ]);
                setUsers(usersData?.resultList ?? []);
                setUserStats(userStatsData?.resultList ?? []);
                setDocumentStats(documentStatsData?.resultList ?? []);
                setLessonStats(lessonStatsData?.resultList ?? []);
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
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const usersToday = userStats.find(stat => stat.date === today)?.total ?? 0;
        const documentsToday = documentStats.find(stat => stat.date === today)?.total ?? 0;
        const lessonsToday = lessonStats.find(stat => stat.date === today)?.total ?? 0;

        const usersThisWeek = userStats.reduce((sum, stat) => sum + stat.total, 0);
        const documentsThisWeek = documentStats.reduce((sum, stat) => sum + stat.total, 0);
        const lessonsThisWeek = lessonStats.reduce((sum, stat) => sum + stat.total, 0);

        return {
            totalUsers: users.length,
            totalDocuments: documentsThisWeek,
            totalLessons: lessonsThisWeek,
            documentsToday,
            lessonsToday,
            documentsThisWeek,
            lessonsThisWeek,
            usersToday,
            usersThisWeek
        };
    };

    const stats = calculateStats();

    if (loading) {
        return <LoadingState rows={5} variant="card" />;
    }

    return (
        <div className="overview-grid">
            <OverviewCard
                icon="👤"
                title="Người dùng mới hôm nay"
                value={stats.usersToday}
                color="blue"
            />

            <OverviewCard
                icon="📚"
                title="Tổng tài liệu & bài giảng tuần này"
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
                icon="👥"
                title="Tổng số người dùng"
                value={stats.totalUsers}
                color="purple"
            />
        </div>
    );
};

export default OverviewComp;
