import DocumentViewComp from "../../components/DocumentViewComp";

interface Props {
    documentUrl: string | null;
    pageNumber: number;
    onLoadPages?: (pages: number) => void;
    onPageChange?: (page: number) => void;
}

const CenterComp: React.FC<Props> = ({
    documentUrl,
    pageNumber,
    onLoadPages,
    onPageChange,
}) => {
    return (
        <DocumentViewComp
            documentUrl={documentUrl}
            page={pageNumber}
            onPageChange={onPageChange}
            onLoadPages={onLoadPages}
            maxRenderWidth={860}
        />
    );
};

export default CenterComp;
