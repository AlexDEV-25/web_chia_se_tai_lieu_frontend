import React, { useEffect, useState } from 'react';
import { userLast7Days, documentLast7Days, lessonLast7Days, documentByCategory, lessonByCategory } from '../../../../apis/StatisticsApi';
import ColumnChart from './child_components/ColumnChart';
import BarChart from './child_components/BarChart';
import PieChart from './child_components/PieChart';
import type { DailyCountResponse } from '../../../../models/response/statistic/DailyCountResponse';
import type { CategoryCountResponse } from '../../../../models/response/statistic/CategoryCountResponse';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';
import LoadingState from '../../components/LoadingState';
const AnalysisChartComp: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState<DailyCountResponse[]>([]);
    const [documentStats, setDocumentStats] = useState<DailyCountResponse[]>([]);
    const [lessonStats, setLessonStats] = useState<DailyCountResponse[]>([]);
    const [documentCategories, setDocumentCategories] = useState<CategoryCountResponse[]>([]);
    const [lessonCategories, setLessonCategories] = useState<CategoryCountResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userStatsData, documentStatsData, lessonStatsData, documentCategoriesData, lessonCategoriesData] = await Promise.all([
                    userLast7Days(),
                    documentLast7Days(),
                    lessonLast7Days(),
                    documentByCategory(),
                    lessonByCategory()
                ]);
                setUserStats(userStatsData?.resultList ?? []);
                setDocumentStats(documentStatsData?.resultList ?? []);
                setLessonStats(lessonStatsData?.resultList ?? []);
                setDocumentCategories(documentCategoriesData?.resultList ?? []);
                setLessonCategories(lessonCategoriesData?.resultList ?? []);
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.LOAD_FAILED);
                console.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Transform document stats for chart
    const getDocumentUploadByDay = () => {
        if (documentStats.length === 0) {
            // Fallback to empty data if no stats
            return Array.from({ length: 7 }, (_, i) => ({
                day: `Ngày ${i + 1}`,
                upload: 0
            }));
        }

        return documentStats.map((stat, index) => ({
            day: `Ngày ${index + 1}`,
            upload: stat.total
        }));
    };

    // Transform lesson stats for chart
    const getLessonUploadByDay = () => {
        if (lessonStats.length === 0) {
            // Fallback to empty data if no stats
            return Array.from({ length: 7 }, (_, i) => ({
                day: `Ngày ${i + 1}`,
                upload: 0
            }));
        }

        return lessonStats.map((stat, index) => ({
            day: `Ngày ${index + 1}`,
            upload: stat.total
        }));
    };

    // Transform user stats for chart
    const getNewUsersByDay = () => {
        if (userStats.length === 0) {
            // Fallback to empty data if no stats
            return Array.from({ length: 7 }, (_, i) => ({
                day: `Ngày ${i + 1}`,
                người_dùng: 0
            }));
        }

        return userStats.map((stat, index) => ({
            day: `Ngày ${index + 1}`,
            người_dùng: stat.total
        }));
    };

    // Transform document categories for pie chart
    const getDocumentsByCategory = () => {
        return documentCategories.map(category => ({
            name: category.categoryName,
            value: category.total
        }));
    };

    // Transform lesson categories for pie chart
    const getLessonsByCategory = () => {
        return lessonCategories.map(category => ({
            name: category.categoryName,
            value: category.total
        }));
    };

    const documentUploadByDay = getDocumentUploadByDay();
    const lessonUploadByDay = getLessonUploadByDay();
    const newUsersByDay = getNewUsersByDay();
    const documentsByCategory = getDocumentsByCategory();
    const lessonsByCategory = getLessonsByCategory();

    if (loading) {
        return <LoadingState rows={5} variant="card" />;
    }

    return (
        <div className="analysis-grid">
            <ColumnChart
                data={documentUploadByDay}
                dataKey="upload"
                title="Số tài liệu được upload theo ngày"
                color="#3b82f6"
            />

            <ColumnChart
                data={lessonUploadByDay}
                dataKey="upload"
                title="Số bài giảng được upload theo ngày"
                color="#10b981"
            />

            <BarChart
                data={newUsersByDay}
                dataKey="người_dùng"
                title="Người dùng mới đăng ký"
            />

            <PieChart data={documentsByCategory} title="Tài liệu theo danh mục" />

            <PieChart data={lessonsByCategory} title="Bài giảng theo danh mục" />
        </div>
    );
};

export default AnalysisChartComp;
