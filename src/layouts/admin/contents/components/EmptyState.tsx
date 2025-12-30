import React from 'react';

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
    return (
        <div className="empty-state">
            <div className="empty-icon">{icon}</div>
            <p className="empty-title">{title}</p>
            <p className="empty-desc">{description}</p>
        </div>
    );
};

export default EmptyState;
