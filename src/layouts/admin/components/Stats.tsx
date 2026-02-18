import React from 'react';
import StatCard from './StatCard';

interface StatsProps {
    stats: {
        total: number;
        visible: number;
        hidden: number;
    };
    containerClass?: string;
    cardClass?: string;
}

const Stats: React.FC<StatsProps> = ({ stats, containerClass = 'stats', cardClass = 'stat-card' }) => {
    return (
        <div className={containerClass}>
            <StatCard
                label="Tổng số"
                value={stats.total}
                description="Tất cả các mục"
                variant="default"
                cardClass={cardClass}
            />
            <StatCard
                label="Đang hiển thị"
                value={stats.visible}
                description="Công khai cho người dùng"
                variant="positive"
                cardClass={cardClass}
            />
            <StatCard
                label="Đang ẩn"
                value={stats.hidden}
                description="Đã bị ẩn hoặc chặn"
                variant="warning"
                cardClass={cardClass}
            />
        </div>
    );
};

export default Stats;
