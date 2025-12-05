import React, { useState } from "react";
import { Document, Page } from "react-pdf";
interface Props {
    docId: number;
}
const PdfComp: React.FC<Props> = ({ docId }) => {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1); // mở lại về trang 1 khi load file mới
    }

    const nextPage = () => {
        if (numPages && pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <Document
                file={`http://localhost:8080/api/documents/${docId}/file`}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>

            <p>
                Page {pageNumber} / {numPages}
            </p>

            <button onClick={prevPage} disabled={pageNumber <= 1}>
                ◀ Trang trước
            </button>

            <button
                onClick={nextPage}
                disabled={numPages ? pageNumber >= numPages : true}
                style={{ marginLeft: 10 }}
            >
                Trang sau ▶
            </button>
        </div>
    );
}

export default PdfComp;
