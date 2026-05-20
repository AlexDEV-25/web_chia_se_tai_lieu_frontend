interface Props {
    description: string;
    setDescription: (description: string) => void;

}

const DescriptionComp: React.FC<Props> = ({ description, setDescription }) => {
    return (
        <div className="input-field">
            <label>Mô tả</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả nội dung"
                rows={4}
            />
        </div>
    );
}
export default DescriptionComp;