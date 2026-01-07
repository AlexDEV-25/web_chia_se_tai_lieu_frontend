import React, { useEffect, useState } from 'react';
import { getAllDocument } from '../../../../apis/DocumentApi';
import { getAllLesson } from '../../../../apis/LessonApi';
import { getAllUser } from '../../../../apis/UserApi';
import ColumnChart from './child_components/ColumnChart';
import BarChart from './child_components/BarChart';
import PieChart from './child_components/PieChart';
import type { DocumentResponse } from '../../../../models/response/DocumentResponse';
import type { LessonResponse } from '../../../../models/response/LessonResponse';
import type { UserResponse } from '../../../../models/response/UserResponse';
import axios from 'axios';
const AnalysisChartComp: React.FC = () => {
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
                    getAllUser(),
                ]);
                setDocuments(docsData?.resultList ?? []);
                setLessons(lessonsData?.resultList ?? []);
                setUsers(usersData?.resultList ?? []);
            } catch (err: any) {
                let message = "Không thể tải tài liệu, bài giảng, người dùng. Vui lòng thử lại.";
                if (axios.isAxiosError(err)) {
                    message =
                        err.response?.data?.message ??
                        err.message ??
                        message;
                }
                console.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate documents upload by day
    const getDocumentUploadByDay = () => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        return last7Days.map(date => {
            const dateStr = date.toLocaleDateString('vi-VN');
            const dayStr = date.getDate();
            const docCount = documents.filter(d => {
                const docDate = new Date(d.createdAt);
                return docDate.toLocaleDateString('vi-VN') === dateStr;
            }).length;

            return {
                day: `Ngày ${dayStr}`,
                upload: docCount
            };
        });
    };

    // Calculate lessons upload by day
    const getLessonUploadByDay = () => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        return last7Days.map(date => {
            const dateStr = date.toLocaleDateString('vi-VN');
            const dayStr = date.getDate();
            const lessonCount = lessons.filter(l => {
                const lessonDate = new Date(l.createdAt);
                return lessonDate.toLocaleDateString('vi-VN') === dateStr;
            }).length;

            return {
                day: `Ngày ${dayStr}`,
                upload: lessonCount
            };
        });
    };

    // Calculate new users by day
    const getNewUsersByDay = () => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        return last7Days.map(date => {
            const dateStr = date.toLocaleDateString('vi-VN');
            const dayStr = date.getDate();
            const userCount = users.filter(u => {
                const userDate = new Date(u.createdAt);
                return userDate.toLocaleDateString('vi-VN') === dateStr;
            }).length;

            return {
                day: `Ngày ${dayStr}`,
                người_dùng: userCount
            };
        });
    };

    // Calculate documents by category
    const getDocumentsByCategory = () => {
        const categoryMap: { [key: string]: number } = {};

        documents.forEach(doc => {
            const categoryName = doc.categoryName || 'Chưa phân loại';
            categoryMap[categoryName] = (categoryMap[categoryName] || 0) + 1;
        });

        return Object.entries(categoryMap).map(([name, count]) => ({
            name,
            value: count
        }));
    };

    const documentUploadByDay = getDocumentUploadByDay();
    const lessonUploadByDay = getLessonUploadByDay();
    const newUsersByDay = getNewUsersByDay();
    const documentsByCategory = getDocumentsByCategory();

    if (loading) {
        return <div className="analysis-loading">Đang tải biểu đồ...</div>;
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

            <PieChart data={documentsByCategory} />
        </div>
    );
};

export default AnalysisChartComp;
