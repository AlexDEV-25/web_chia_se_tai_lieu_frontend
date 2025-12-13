import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategoryById, updateCategory } from "../../../apis/CategoryApi";
import { Category } from "../../../models/Category";
import type { CategoryRequest } from "../../../models/request/CategoryRequest";
const CategoryEdit: React.FC = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isErrorName, setIsErrorName] = useState<string>("");
    const [isErrorDescription, setIsErrorDescription] = useState<string>("");

    useEffect(() => {
        if (id) {
            const category = async () => {
                const data = await getCategoryById(parseInt(id));
                setName(data.result?.name ?? "");
                setDescription(data.result?.description ?? "");
            }
            category().catch(error => {
                console.log(error);
            });
        }
    }, [id]);

    const handleSubmit = () => {
        let nameError = ""
        let descriptionError = ""

        if (name.trim() === "") { nameError = "loi khong nhap"; }
        if (description.trim() === "") { descriptionError = "loi khong nhap"; }

        setIsErrorName(nameError);
        setIsErrorDescription(descriptionError);

        if (isErrorName !== "" || isErrorDescription !== "") {
            return;
        }

        const newCategory: CategoryRequest = { name: name, description: description, hide: false };

        const updateItem = async () => {
            if (id) {
                const data = await updateCategory(parseInt(id), newCategory);
                console.log(data);
                navigate("/categories");
            }
        }
        updateItem().catch(error => {
            console.log(error);
        });


    };
    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Sửa danh mục</h1>
            < form className="space-y-4">
                <div>
                    <label className="block mb-1">Tên danh mục</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    <div className="text-red-500">{isErrorDescription}</div>
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                >
                    Lưu thay đổi
                </button>
            </form>
        </div>
    );
};
export default CategoryEdit;