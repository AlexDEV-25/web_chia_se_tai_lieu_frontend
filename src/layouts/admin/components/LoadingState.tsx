import React from "react";

interface LoadingStateProps {
    rows?: number;
    variant?: "card" | "table";
}

const LoadingState: React.FC<LoadingStateProps> = ({
    rows = 4,
    variant = "card",
}) => {
    if (variant === "table") {
        return (
            <div className="loading-table">
                {[...Array(rows)].map((_, index) => (
                    <div key={index} className="loading-table-row">
                        <div className="skeleton w-10" />
                        <div className="skeleton w-40" />
                        <div className="skeleton w-60" />
                        <div className="skeleton w-24" />
                        <div className="skeleton w-32" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="loading-card-grid">
            {[...Array(rows)].map((_, index) => (
                <div key={index} className="loading-card">
                    <div className="skeleton title" />
                    <div className="skeleton text" />
                    <div className="skeleton text short" />
                    <div className="skeleton button" />
                </div>
            ))}
        </div>
    );
};

export default LoadingState;