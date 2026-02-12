import React, { useEffect, useState } from "react";
import { getLessonVideo, getPublicLessonVideo } from "../../../apis/LessonApi";

interface VideoCompProps {
    lessonId?: number;
    thumbnailUrl?: string | null;

    /** admin mode - use admin API to load all lessons including hidden/pending */
    isAdmin?: boolean;
}

const VideoComp: React.FC<VideoCompProps> = ({ lessonId, thumbnailUrl, isAdmin }) => {
    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lessonId) return;
        const fetchVideo = async () => {
            setLoading(true);
            setError(null);
            try {
                const blob = isAdmin
                    ? await getLessonVideo(lessonId)
                    : await getPublicLessonVideo(lessonId);

                const url = URL.createObjectURL(blob);
                setVideoSource(url);
            } catch (err) {
                console.error('Error fetching video:', err);
                setError('Không thể tải video');
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();

        return () => {
            if (videoSource) {
                URL.revokeObjectURL(videoSource);
            }
        };
    }, [lessonId, isAdmin]);

    if (!lessonId) {
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
                    poster={thumbnailUrl ? `http://localhost:8080/api/images/thumbnail/${thumbnailUrl}` : undefined}
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