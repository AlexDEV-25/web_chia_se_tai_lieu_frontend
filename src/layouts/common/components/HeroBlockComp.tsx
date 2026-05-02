interface HeroBlockMetrics {
    label: string;
    value: string | number;
    subtext: string;
}

interface HeroBlockContent {
    eyebrow: string;
    title: string;
    subtitle: string;
}

type HeroBlockCompProps = {
    content: HeroBlockContent;
    metrics: HeroBlockMetrics[];
};

const HeroBlockComp: React.FC<HeroBlockCompProps> = ({ content, metrics }) => {
    return (
        <section className="hero-block">
            <div>
                <p className="eyebrow">{content.eyebrow}</p>
                <h1 dangerouslySetInnerHTML={{ __html: content.title }}></h1>
                <p className="hero-subtitle">{content.subtitle}</p>
            </div>
            <div className="hero-metrics">
                {metrics.map((metric, index) => (
                    <div key={index} className="metric-card">
                        <p>{metric.label}</p>
                        <strong>{metric.value}</strong>
                        <span>{metric.subtext}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HeroBlockComp;