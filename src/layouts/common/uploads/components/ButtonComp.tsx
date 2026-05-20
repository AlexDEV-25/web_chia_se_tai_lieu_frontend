interface Props {
    handleUpload: () => void;
    isLoading: boolean;
    buttonText?: string;
}

const ButtonComp: React.FC<Props> = ({ handleUpload, isLoading, buttonText }) => {
    return (
        <>
            <button
                type="button"
                onClick={handleUpload}
                className="btn-elevated"
                disabled={isLoading}
            >
                {isLoading ? "Đang xử lý..." : buttonText}
            </button>
        </>
    );
}
export default ButtonComp;