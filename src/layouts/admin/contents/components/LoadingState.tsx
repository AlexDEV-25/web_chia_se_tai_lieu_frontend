import React from 'react';

interface LoadingStateProps {
    rows?: number;
    variant?: 'card' | 'table';
}

const LoadingState: React.FC<LoadingStateProps> = ({ rows = 4, variant = 'card' }) => {
    return (
        <div className={`loading-${variant}`}>
            {[...Array(rows)].map((_, idx) => (
                <div key={idx} className={`loading-row-${variant}`} />
            ))}
        </div>
    );
};

export default LoadingState;
