import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllDocumentReportSummary, hideDocument } from '../../../../apis/DocumentApi';
import { getAllLessonReportSummary, hideLesson } from '../../../../apis/LessonApi';
import type { ReportAdminResponse } from '../../../../models/response/report/ReportAdminResponse';
import type { HideRequest } from '../../../../models/request/HideRequest';
import ConfirmDialog from '../../components/ConfirmDialog';
import LeftSidebar from '../../components/LeftSidebar';
import PageHeader from '../../components/PageHeader';
import { handleApiError } from '../../../../utils/errorHandler';
import { ERROR_MESSAGES } from '../../../../constants/messages';

const ReportList: React.FC = () => {
    const [data, setData] = useState<(ReportAdminResponse & { hide: boolean })[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'document' | 'lesson'>('document');
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        onCancel: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { }
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [docRes, lessonRes] = await Promise.all([
                    getAllDocumentReportSummary(),
                    getAllLessonReportSummary()
                ]);
                const combined = [...(docRes.resultList || []), ...(lessonRes.resultList || [])].map(item => ({ ...item, hide: false }));
                setData(combined);
            } catch (err: any) {
                alert(handleApiError(err, ERROR_MESSAGES.REPORT_LOAD_FAILED));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleToggleVisibility = (item: ReportAdminResponse & { hide: boolean }) => {
        if (updatingId) return;
        setConfirmDialog({
            isOpen: true,
            title: item.hide ? 'Hiển thị nội dung' : 'Ẩn nội dung',
            message: item.hide
                ? `Bạn có muốn hiển thị lại "${item.title}"?`
                : `Bạn có chắc chắn muốn ẩn "${item.title}"?`,
            onConfirm: () => toggleItem(item),
            onCancel: () => setConfirmDialog({ ...confirmDialog, isOpen: false })
        });
    };

    const toggleItem = async (item: ReportAdminResponse & { hide: boolean }) => {
        setUpdatingId(item.id);
        try {
            const newHide = !item.hide;
            const hideRequest: HideRequest = { hide: newHide, updatedAt: new Date() };
            if (item.type === 'DOCUMENT') {
                await hideDocument(item.id, hideRequest);
            } else {
                await hideLesson(item.id, hideRequest);
            }
            setData(prev => prev.map(d => d.id === item.id && d.type === item.type ? { ...d, hide: newHide } : d));
            setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (err: any) {
            alert(handleApiError(err, ERROR_MESSAGES.HIDE_FAILED));
            setConfirmDialog({ ...confirmDialog, isOpen: false });
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredData = data.filter(item => item.type.toLowerCase() === activeTab);
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
                            className={`btn ${activeTab === 'document' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('document')}
                        >
                            Tài liệu ({documentCount})
                        </button>
                        <button
                            type="button"
                            className={`btn ${activeTab === 'lesson' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('lesson')}
                        >
                            Bài giảng ({lessonCount})
                        </button>
                    </div>

                    {!loading && filteredData.length === 0 && (
                        <div className="text-center py-5">
                            <p className="text-muted">Chưa có báo cáo nào cho {activeTab === 'document' ? 'tài liệu' : 'bài giảng'}.</p>
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
                                                    <button
                                                        onClick={() => handleToggleVisibility(item)}
                                                        disabled={updatingId === item.id}
                                                        className={`category-btn ${item.hide ? 'primary' : 'danger'}`}
                                                    >
                                                        {updatingId === item.id ? 'Đang cập nhật...'
                                                            : item.hide ? 'Hiển thị' : 'Ẩn'}
                                                    </button>
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

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={confirmDialog.onCancel}
            />
        </div>
    );
};

export default ReportList;