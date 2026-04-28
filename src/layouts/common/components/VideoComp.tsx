import React, { useEffect, useState } from "react";


interface VideoCompProps {
    videoUrl: string | null;
    thumbnailUrl?: string | null;
}

const VideoComp: React.FC<VideoCompProps> = ({ videoUrl, thumbnailUrl }) => {
    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!videoUrl) {
            setVideoSource(null);
            setLoading(false);
            setError(null);
            return;
        }

        setVideoSource(videoUrl);
        setLoading(false);
        setError(null);
    }, [videoUrl]);

    if (!videoUrl) {
        return (
            <div className="lesson-video-empty">
                <i className="fa fa-video-camera" />
                <p>Video bài giảng sẽ được cập nhật sớm.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="lesson-video-loading">
                <i className="fa fa-spinner fa-spin" />
                <p>Đang tải video...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="lesson-video-error">
                <i className="fa fa-exclamation-triangle" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="lesson-video-player">
            <div className="lesson-video-frame">
                <video
                    controls
                    controlsList="nodownload"
                    poster={thumbnailUrl ? `${thumbnailUrl}` : undefined}
                    preload="metadata"
                    onContextMenu={(e) => e.preventDefault()}
                >
                    <source src={videoSource || undefined} />
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
            </div>
        </div>
    );
};

export default VideoComp;