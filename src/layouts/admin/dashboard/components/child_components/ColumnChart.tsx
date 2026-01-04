import React from 'react';
import ChartCard from './ChartCard';

interface ColumnChartData {
    day: string;
    [key: string]: any;
}

interface ColumnChartProps {
    data: ColumnChartData[];
    dataKey: string;
    title: string;
    color?: string;
}

const ColumnChart: React.FC<ColumnChartProps> = ({ data, dataKey, title, color = '#3b82f6' }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]), 1);

    return (
        <ChartCard title={title}>
            <div className="column-chart">
                {data.map((item, index) => {
                    const percentage = (item[dataKey] / maxValue) * 100;
                    return (
                        <div key={index} className="column-item">
                            <div className="column-bar-wrapper">
                                <div
                                    className="column-bar"
                                    style={{
                                        height: `${percentage}%`,
                                        backgroundColor: color
                                    }}
                                    title={`${item.day}: ${item[dataKey]}`}
                                >
                                    <span className="column-value">{item[dataKey]}</span>
                                </div>
                            </div>
                            <div className="column-label">{item.day}</div>
                        </div>
                    );
                })}
            </div>
        </ChartCard>
    );
};

export default ColumnChart;
