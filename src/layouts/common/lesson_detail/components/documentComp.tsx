import DocumentViewComp from "../../components/DocumentViewComp";

interface Props {
    lessonId?: number;
}

const DocumentComp: React.FC<Props> = ({ lessonId }) => {
    return (
        <DocumentViewComp
            fileUrl={
                lessonId
                    ? `http://localhost:8080/api/lessons/${lessonId}/document`
                    : null
            }
            maxRenderWidth={520}
            emptyFallback={
                <div className="lesson-document-empty">
                    <i className="fa fa-file-pdf-o" />
                    <p>Tài liệu bài giảng sẽ được cập nhật sớm.</p>
                </div>
            }
        />
    );
};

export default DocumentComp;
