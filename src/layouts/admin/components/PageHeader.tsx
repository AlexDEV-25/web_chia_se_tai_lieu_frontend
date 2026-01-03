import React from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    description: string;
    addButtonText: string;
    addButtonLink: string;
    eyebrow?: string;
    containerClass?: string;
    headingClass?: string;
    eyebrowClass?: string;
    buttonClass?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    addButtonText,
    addButtonLink,
    eyebrow = 'Quản trị hệ thống',
    containerClass = 'page-header',
    headingClass = 'heading',
    eyebrowClass = 'eyebrow',
    buttonClass = 'btn primary'
}) => {
    return (
        <div className={containerClass}>
            <div className={headingClass}>
                <p className={eyebrowClass}>{eyebrow}</p>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <Link to={addButtonLink} className={buttonClass}>
                {addButtonText}
            </Link>
        </div>
    );
};

export default PageHeader;
