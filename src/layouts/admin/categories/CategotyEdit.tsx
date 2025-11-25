import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategoryById, updateCategory } from "../../../apis/CategoryApi";
import { Category } from "../../../models/Category";
const CategoryEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isErrorName, setIsErrorName] = useState<boolean>();
    const [isErrorDescription, setIsErrorDescription] = useState<boolean>();
    useEffect(() => {
        if (id) {
            getCategoryById(parseInt(id))
                .then((data) => {
                    setName(data.name);
                    setDescription(data.description);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [id]);
    const handleSubmit = () => {
        const nameError = name.trim() === "";
        const descriptionError = description.trim() === "";

        setIsErrorName(nameError);
        setIsErrorDescription(descriptionError);

        if (nameError || descriptionError) {
            return;
        }

        const newCategory = new Category(parseInt(id + ""), name, description, false);
        updateCategory(newCategory)
            .then((category) => {
                console.log(category);
                navigate("/categories");
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Sửa danh mục</h1>
            < div className="space-y-4">
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
                    <div className="text-red-500">{isErrorName ? "Tên danh mục không được để trống" : ""}</div>
                </div>

                <div>
                    <label className="block mb-1">Mô tả</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    />
                    <div className="text-red-500">{isErrorDescription ? "Mô tả không được để trống" : ""}</div>
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                >
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};
export default CategoryEdit;