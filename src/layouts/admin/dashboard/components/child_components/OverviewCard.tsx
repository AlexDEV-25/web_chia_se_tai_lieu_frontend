import React from 'react';

interface OverviewCardProps {
    icon: string;
    title: string;
    value: number;
    subtitle?: string;
    color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const OverviewCard: React.FC<OverviewCardProps> = ({
    icon,
    title,
    value,
    subtitle,
    color
}) => (
    <div className={`overview-card overview-card--${color}`}>
        <div className="overview-card-icon">{icon}</div>
        <div className="overview-card-content">
            <p className="overview-card-title">{title}</p>
            <p className="overview-card-value">{value.toLocaleString('vi-VN')}</p>
            {subtitle && <p className="overview-card-subtitle">{subtitle}</p>}
        </div>
    </div>
);

export default OverviewCard;
