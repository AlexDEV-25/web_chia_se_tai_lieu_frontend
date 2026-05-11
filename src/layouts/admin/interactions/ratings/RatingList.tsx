import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDocumentRatingSummary } from '../../../../apis/DocumentApi';
import { getAllLessonRatingSummary } from '../../../../apis/LessonApi';
import type { RatingAdminResponse } from '../../../../models/response/rating/RatingAdminResponse';
import LeftSidebar from '../../components/LeftSidebar';
import PageHeader from '../../components/PageHeader';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';
import type { InteractionType } from '../../../../models/enum/common';

type RatingWithType = RatingAdminResponse & { type: InteractionType };

const RatingList: React.FC = () => {
    const [data, setData] = useState<RatingWithType[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<InteractionType>('DOCUMENT');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [docRes, lessonRes] = await Promise.all([
                    getAllDocumentRatingSummary(),
                    getAllLessonRatingSummary()
                ]);
                const docRatings = (docRes.resultList || []).map(item => ({ ...item, type: 'DOCUMENT' as InteractionType }));
                const lessonRatings = (lessonRes.resultList || []).map(item => ({ ...item, type: 'LESSON' as InteractionType }));
                const combined = [...docRatings, ...lessonRatings];
                setData(combined);
            } catch (err: any) {
                alert(handleApiError(err, ERROR_MESSAGES.RATING_LOAD_FAILED));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredData = data.filter(item => item.type === activeTab);
    const documentCount = data.filter(item => item.type === 'DOCUMENT').length;
    const lessonCount = data.filter(item => item.type === 'LESSON').length;

    if (loading) {
        return (
            <div className="admin-page-layout">
                <LeftSidebar />
                <div className="admin-category-page">
                    <div className="category-container">
                        <PageHeader
                            title="Quản lý đánh giá nội dung"
                            description="Theo dõi và quản lý các đánh giá để đảm bảo chất lượng nội dung."
                            eyebrow="Quản trị hệ thống"
                            containerClass="category-page-header"
                            headingClass="category-heading"
                            eyebrowClass="category-eyebrow"
                            buttonClass="category-btn primary"
                        />
                        <div className="text-center py-5">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page-layout">
            <LeftSidebar />
            <div className="admin-category-page">
                <div className="category-container">
                    <PageHeader
                        title="Quản lý đánh giá nội dung"
                        description="Theo dõi và quản lý các đánh giá để đảm bảo chất lượng nội dung."
                        containerClass="category-page-header"
                        headingClass="category-heading"
                        eyebrowClass="category-eyebrow"
                        buttonClass="category-btn primary"
                    />

                    <div className="btn-group mb-4" role="group" aria-label="Tabs đánh giá">
                        <button
                            type="button"
                            className={`btn ${activeTab === 'DOCUMENT' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('DOCUMENT')}
                        >
                            Tài liệu ({documentCount})
                        </button>
                        <button
                            type="button"
                            className={`btn ${activeTab === 'LESSON' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('LESSON')}
                        >
                            Bài giảng ({lessonCount})
                        </button>
                    </div>

                    {!loading && filteredData.length === 0 && (
                        <div className="text-center py-5">
                            <p className="text-muted">Chưa có đánh giá nào cho {activeTab === 'DOCUMENT' ? 'tài liệu' : 'bài giảng'}.</p>
                        </div>
                    )}

                    {!loading && filteredData.length > 0 && (
                        <div className="table-wrapper category-table">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tiêu đề</th>
                                        <th>Đánh giá trung bình</th>
                                        <th>Tổng đánh giá</th>
                                        <th className="text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item) => {
                                        const starCount = Math.round(item.average);
                                        const stars = '⭐'.repeat(starCount);
                                        return (
                                            <tr key={`${item.type}-${item.id}`}>
                                                <td><p className="category-name">{item.title}</p></td>
                                                <td>{stars} {item.average.toFixed(1)}</td>
                                                <td>{item.total}</td>
                                                <td className="text-right">
                                                    <div className="category-row-actions">
                                                        <Link to={`/${item.type.toLowerCase()}/${item.id}`} className="category-btn subtle">
                                                            Chi tiết
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RatingList;