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
    console.log('ColumnChart data:', data, 'dataKey:', dataKey);
    const maxValue = Math.max(...data.map(item => item[dataKey] || 0), 1);
    console.log('maxValue:', maxValue);

    return (
        <ChartCard title={title}>
            <div className="column-chart">
                {data.map((item, index) => {
                    const percentage = Math.max((item[dataKey] / maxValue) * 100, 5); // Min 5% to show small bars
                    console.log(`Item ${index}: value=${item[dataKey]}, percentage=${percentage}%`);
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
