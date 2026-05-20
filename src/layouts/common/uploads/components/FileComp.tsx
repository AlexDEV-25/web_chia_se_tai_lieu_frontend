interface Props {
    label: string;
    fileType: string;
    setFile: (file: File | null) => void;
    ref?: React.Ref<HTMLInputElement>;
}

const FileComp: React.FC<Props> = ({ label, fileType, setFile, ref }) => {
    return (
        <>
            <div className="input-field">
                <label>{label}</label>
                <div className="file-drop">
                    <input
                        type="file"
                        accept={fileType}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        ref={ref}
                    />
                    <i className="fa" />
                    <p>Kéo thả hoặc chọn file</p>
                </div>
            </div>
        </>
    );
}
export default FileComp;