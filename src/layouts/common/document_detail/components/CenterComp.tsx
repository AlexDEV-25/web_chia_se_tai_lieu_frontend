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
            docId={docId}
            isAdmin={false}
            isLessonDocument={false}
            page={pageNumber}
            onPageChange={onPageChange}
            onLoadPages={onLoadPages}
            maxRenderWidth={860}
        />
    );
};

export default CenterComp;
