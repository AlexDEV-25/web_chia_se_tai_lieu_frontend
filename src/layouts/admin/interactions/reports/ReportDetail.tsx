import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocumentReport, getLessonReport } from '../../../../apis/ReportApi';
import type { ReportResponse } from '../../../../models/response/ReportResponse';
import LeftSidebar from '../../components/LeftSidebar';
import PageHeader from '../../components/PageHeader';

const ReportDetail: React.FC = () => {
    const { type, id } = useParams<{ type: string; id: string }>();
    const navigate = useNavigate();
    const [reports, setReports] = useState<ReportResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [contentTitle, setContentTitle] = useState('');

    useEffect(() => {
        if (!type || !id) return;
        const fetchReports = async () => {
            setLoading(true);
            try {
                const res = type === 'document' ? await getDocumentReport(parseInt(id)) : await getLessonReport(parseInt(id));
                setReports(res.resultList || []);
                if (res.resultList && res.resultList.length > 0) {
                    setContentTitle(res.resultList[0].title);
                }
            } catch (err: any) {
                alert('Không thể tải báo cáo. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [type, id]);

    if (loading) {
        return (
            <div className="admin-page-layout">
                <LeftSidebar />
                <div className="admin-category-page">
                    <div className="category-container">
                        <PageHeader
                            title="Đang tải..."
                            description="Vui lòng chờ."
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
                <div className="category-container" style={{ position: 'relative' }}>
                    <button onClick={() => navigate(-1)} className="btn btn-outline-secondary" style={{ position: 'absolute', top: '10px', right: '20px', padding: '5px 15px' }}>Quay lại</button>
                    <PageHeader
                        title={`Báo cáo cho: ${contentTitle}`}
                        description="Danh sách báo cáo cho nội dung này."
                        eyebrow="Quản trị hệ thống"
                        containerClass="category-page-header"
                        headingClass="category-heading"
                        eyebrowClass="category-eyebrow"
                        buttonClass="category-btn primary"
                    />

                    {!loading && reports.length === 0 && (
                        <div className="text-center py-5">
                            <p className="text-muted">Chưa có báo cáo nào cho nội dung này.</p>
                        </div>
                    )}

                    {!loading && reports.length > 0 && (
                        <div className="table-wrapper category-table">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tiêu đề</th>
                                        <th>Người báo cáo</th>
                                        <th>Lý do</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td>{report.title}</td>
                                            <td>{report.username}</td>
                                            <td>{report.reason}</td>
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

export default ReportDetail;