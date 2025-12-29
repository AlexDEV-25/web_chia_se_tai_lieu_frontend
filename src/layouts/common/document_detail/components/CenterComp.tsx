import DocumentViewComp from "../../components/DocumentViewComp";

interface Props {
    docId: number;
    pageNumber: number;
    onLoadPages?: (pages: number) => void;
    onPageChange?: (page: number) => void;
}

const CenterComp: React.FC<Props> = ({
    docId,
    pageNumber,
    onLoadPages,
    onPageChange,
}) => {
    return (
        <DocumentViewComp
            fileUrl={`http://localhost:8080/api/documents/${docId}/file`}
            page={pageNumber}
            onPageChange={onPageChange}
            onLoadPages={onLoadPages}
            maxRenderWidth={860}
        />
    );
};

export default CenterComp;
