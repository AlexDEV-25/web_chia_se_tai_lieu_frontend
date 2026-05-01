import React, { useState } from "react";

interface VideoCompProps {
    videoUrl: string | null;
    thumbnailUrl?: string | null;
}

const VideoComp: React.FC<VideoCompProps> = ({ videoUrl, thumbnailUrl }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!videoUrl) {
        return (
            <div className="lesson-video-player">
                <div className="lesson-video-frame">
                    <div className="lesson-video-empty">
                        <i className="fa fa-video-camera" />
                        <p>Video bài giảng sẽ được cập nhật sớm.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lesson-video-player">
            <div className="lesson-video-frame">
                {loading && (
                    <div className="lesson-video-overlay lesson-video-loading">
                        <i className="fa fa-spinner fa-spin" />
                        <p>Đang tải video...</p>
                    </div>
                )}

                {error && (
                    <div className="lesson-video-overlay lesson-video-error">
                        <i className="fa fa-exclamation-triangle" />
                        <p>{error}</p>
                    </div>
                )}

                <video
                    key={videoUrl}
                    controls
                    controlsList="nodownload"
                    poster={thumbnailUrl || undefined}
                    preload="metadata"
                    onContextMenu={(e) => e.preventDefault()}
                    onLoadStart={() => setLoading(true)}
                    onLoadedData={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                        setError("Không thể tải video. Vui lòng thử lại sau.");
                    }}
                    className={loading || error ? "video-hidden" : ""}
                >
                    <source src={videoUrl} />
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
            </div>
        </div>
    );
};

export default VideoComp;