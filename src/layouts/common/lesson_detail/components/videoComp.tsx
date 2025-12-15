const VideoComp: React.FC = () => {
    return (
        <>
            <div className="lesson-content">
                <video src={`http://localhost:8080/api/lessons/1/video`} controls></video>
            </div>
        </>
    );
}

export default VideoComp;