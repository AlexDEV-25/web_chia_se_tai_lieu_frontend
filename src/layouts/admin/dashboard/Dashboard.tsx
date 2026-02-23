import React from 'react';
import LeftSidebar from '../components/LeftSidebar';
import OverviewComp from './components/OverviewComp';
import AnalysisChartComp from './components/AnalysisChartComp';

const Dashboard: React.FC = () => {
    return (
        <div className="admin-page-layout">
            <LeftSidebar />
            <div className="admin-dashboard-page">
                <div className="dashboard-container">

                    <div className="dashboard-header">
                        <div>
                            <p className="dashboard-eyebrow">Bảng điều khiển</p>
                            <h1>Tổng quan hệ thống</h1>
                            <p className="dashboard-subtitle">
                                Theo dõi hiệu suất và hoạt động của nền tảng chia sẻ tài liệu học tập.
                            </p>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        <h2 className="dashboard-section-title">Tổng quan</h2>
                        <OverviewComp />
                    </div>

                    <div className="dashboard-section">
                        <h2 className="dashboard-section-title">Phân tích chi tiết</h2>
                        <AnalysisChartComp />
                    </div>

                    <div className="dashboard-footer">
                        <p className="dashboard-footer-text">
                            Dữ liệu được cập nhật tự động. Lần cập nhật cuối cùng: {new Date().toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
