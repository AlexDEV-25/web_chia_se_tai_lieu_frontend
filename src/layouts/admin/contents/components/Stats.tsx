import React from 'react';

interface StatCardProps {
    label: string;
    value: number;
    description: string;
    variant?: 'default' | 'positive' | 'warning' | 'error';
    cardClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    description,
    variant = 'default',
    cardClass = 'stat-card'
}) => {
    const variantClass = variant !== 'default' ? ` ${variant}` : '';
    const className = `${cardClass}${variantClass}`;

    return (
        <div className={className}>
            <span className="stat-label">{label}</span>
            <strong className="stat-value">{value}</strong>
            <p className="stat-desc">{description}</p>
        </div>
    );
};

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
