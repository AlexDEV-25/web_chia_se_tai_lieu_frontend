import DocumentViewComp from "../../components/DocumentViewComp";

interface Props {
    documentUrl: string | null;
}

const DocumentComp: React.FC<Props> = ({ documentUrl }) => {
    return (
        <DocumentViewComp
            documentUrl={documentUrl}
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
