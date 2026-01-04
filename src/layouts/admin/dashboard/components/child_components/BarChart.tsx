import React from 'react';
import ChartCard from './ChartCard';

interface BarChartData {
    day: string;
    [key: string]: any;
}

interface BarChartProps {
    data: BarChartData[];
    dataKey: string;
    title: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, dataKey, title }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]), 1);

    return (
        <ChartCard title={title}>
            <div className="bar-chart">
                {data.map((item, index) => {
                    const percentage = (item[dataKey] / maxValue) * 100;
                    return (
                        <div key={index} className="bar-item">
                            <div className="bar-label">{item.day}</div>
                            <div className="bar-container">
                                <div
                                    className="bar-fill"
                                    style={{ width: `${percentage}%` }}
                                >
                                    <span className="bar-value">{item[dataKey]}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ChartCard>
    );
};

export default BarChart;
