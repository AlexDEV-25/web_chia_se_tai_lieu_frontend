interface VideoCompProps {
    lessonId?: number;
    lessonUrl?: string | null;
    title?: string;
    thumbnailUrl?: string | null;
}

const VideoComp: React.FC<VideoCompProps> = ({ lessonId, lessonUrl, title, thumbnailUrl }) => {
    const videoSource = lessonId
        ? `http://localhost:8080/api/lessons/${lessonId}/video`
        : lessonUrl
            ? `http://localhost:8080${lessonUrl}`
            : null;

    if (!videoSource) {
        return (
            <div className="lesson-video-empty">
                <i className="fa fa-video-camera" />
                <p>Video bài giảng sẽ được cập nhật sớm.</p>
            </div>
        );
    }

    return (
        <div className="lesson-video-player">
            <div className="lesson-video-frame">
                <video
                    controls
                    poster={thumbnailUrl ? `http://localhost:8080/api/images/thumbnail/${thumbnailUrl}` : undefined}
                    preload="metadata"
                >
                    <source src={videoSource} />
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
            </div>
        </div>
    );
};

export default VideoComp;