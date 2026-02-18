interface StatCardProps {
    label: string;
    value: number;
    description: string;
    variant?: 'default' | 'positive' | 'warning';
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
export default StatCard;