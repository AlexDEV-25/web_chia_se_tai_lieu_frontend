import React from 'react';
import ChartCard from './ChartCard';

interface PieChartData {
    name: string;
    value: number;
}

interface PieChartProps {
    data: PieChartData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

    let currentAngle = 0;
    const slices = data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const sliceAngle = (item.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = 50 + 40 * Math.cos(startRad);
        const y1 = 50 + 40 * Math.sin(startRad);
        const x2 = 50 + 40 * Math.cos(endRad);
        const y2 = 50 + 40 * Math.sin(endRad);

        const largeArc = sliceAngle > 180 ? 1 : 0;

        const path = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        currentAngle = endAngle;

        return {
            path,
            color: colors[index % colors.length],
            name: item.name,
            value: item.value,
            percentage
        };
    });

    return (
        <ChartCard title="Tài liệu theo danh mục">
            <div className="pie-chart-container">
                <svg viewBox="0 0 100 100" className="pie-chart">
                    {slices.map((slice, index) => (
                        <path
                            key={index}
                            d={slice.path}
                            fill={slice.color}
                            stroke="white"
                            strokeWidth="0.5"
                        />
                    ))}
                </svg>
                <div className="pie-legend">
                    {slices.map((slice, index) => (
                        <div key={index} className="legend-item">
                            <span className="legend-color" style={{ backgroundColor: slice.color }} />
                            <span className="legend-label">{slice.name}</span>
                            <span className="legend-value">{slice.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </ChartCard>
    );
};

export default PieChart;
