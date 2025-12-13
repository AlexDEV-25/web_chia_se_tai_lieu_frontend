import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createCategory } from "../../../apis/CategoryApi";
import type { CategoryRequest } from "../../../models/request/CategoryRequest";
const CategoryAdd: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isErrorName, setIsErrorName] = useState<string>("");
    const [isErrorDescription, setIsErrorDescription] = useState<string>("");
    const handleSubmit = async () => {
        let nameError = ""
        let descriptionError = ""

        if (name.trim() === "") { nameError = "loi khong nhap"; }
        if (description.trim() === "") { descriptionError = "loi khong nhap"; }

        setIsErrorName(nameError);
        setIsErrorDescription(descriptionError);

        if (isErrorName !== "" || isErrorDescription !== "") {
            return;
        }

        const newCategory: CategoryRequest = { name: name, description: description, hide: false }
        createCategory(newCategory);
        navigate("/categories");
    };

    return (
        <div>
            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">Thêm danh mục</h1>
                <form className="space-y-4">
                    <div>
                        <label className="block mb-1">Tên danh mục</label>
                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <div className="text-red-500">{isErrorName}</div>
                    </div>

                    <div>
                        <label className="block mb-1">Mô tả</label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />
                        <div className="text-red-500">{isErrorDescription}</div>
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Thêm
                    </button>
                </form>
            </div>
        </div>
    );
};
export default CategoryAdd;