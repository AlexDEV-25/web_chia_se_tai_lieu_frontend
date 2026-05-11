import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDocumentReportSummary } from '../../../../apis/DocumentApi';
import { getAllLessonReportSummary } from '../../../../apis/LessonApi';
import type { ReportAdminResponse } from '../../../../models/response/report/ReportAdminResponse';
import LeftSidebar from '../../components/LeftSidebar';
import PageHeader from '../../components/PageHeader';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';
import type { InteractionType } from '../../../../models/enum/common';

type ReportWithType = ReportAdminResponse & { type: InteractionType };

const ReportList: React.FC = () => {
    const [data, setData] = useState<ReportWithType[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<InteractionType>('DOCUMENT');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [docRes, lessonRes] = await Promise.all([
                    getAllDocumentReportSummary(),
                    getAllLessonReportSummary()
                ]);
                const docReports = (docRes.resultList || []).map(item => ({ ...item, type: 'DOCUMENT' as InteractionType }));
                const lessonReports = (lessonRes.resultList || []).map(item => ({ ...item, type: 'LESSON' as InteractionType }));
                const combined = [...docReports, ...lessonReports];
                setData(combined);
            } catch (err: any) {
                alert(handleApiError(err, ERROR_MESSAGES.REPORT_LOAD_FAILED));
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
                            title="Quản lý báo cáo nội dung"
                            description="Theo dõi và quản lý các báo cáo để đảm bảo chất lượng nội dung."
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
                        title="Quản lý báo cáo nội dung"
                        description="Theo dõi và quản lý các báo cáo để đảm bảo chất lượng nội dung."
                        eyebrow="Quản trị hệ thống"
                        containerClass="category-page-header"
                        headingClass="category-heading"
                        eyebrowClass="category-eyebrow"
                        buttonClass="category-btn primary"
                    />

                    <div className="btn-group mb-4" role="group" aria-label="Tabs báo cáo">
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
                            <p className="text-muted">Chưa có báo cáo nào cho {activeTab === 'DOCUMENT' ? 'tài liệu' : 'bài giảng'}.</p>
                        </div>
                    )}

                    {!loading && filteredData.length > 0 && (
                        <div className="table-wrapper category-table">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tiêu đề</th>
                                        <th>Tổng báo cáo</th>
                                        <th className="text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item) => (
                                        <tr key={`${item.type}-${item.id}`}>
                                            <td><p className="category-name">{item.title}</p></td>
                                            <td>{item.total}</td>
                                            <td className="text-right">
                                                <div className="category-row-actions">
                                                    <Link to={`/reports/${item.type.toLowerCase()}/${item.id}`} className="category-btn subtle">
                                                        Xem báo cáo
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportList;