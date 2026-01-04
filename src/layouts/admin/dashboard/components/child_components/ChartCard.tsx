import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
    <div className="analysis-chart-card">
        <h3 className="chart-card-title">{title}</h3>
        <div className="chart-card-content">
            {children}
        </div>
    </div>
);

export default ChartCard;
