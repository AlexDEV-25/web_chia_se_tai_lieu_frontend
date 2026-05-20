interface Props {
    title: string;
    setTitle: (title: string) => void;
    errTitle?: string;
}

const TitleComp: React.FC<Props> = ({ title, setTitle, errTitle }) => {
    return (
        <>
            <div className="input-field">
                <label>Tiêu đề</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề"
                />
                {errTitle && <span className="error-text">{errTitle}</span>}
            </div>
        </>
    );
}
export default TitleComp;