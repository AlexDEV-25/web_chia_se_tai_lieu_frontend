
import React from 'react'
import { useState, useEffect } from 'react';
import { getAllCategory, deleteCategory } from '../../../apis/CategoryApi';
import { Category } from '../../../models/Category';
import { Link } from 'react-router-dom';
const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [deleted, setDeleted] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const categories = async () => {
            const data = await getAllCategory();
            setCategories(data?.resultList ?? []);
            setLoading(false);
        }
        categories().catch(error => {
            setError(error.message);
        });
    }, [deleted]);

    const handleDelete = (id: number) => {
        const deleteItem = async () => {
            await deleteCategory(id);
            setDeleted(true);
            setLoading(false);
        }
        deleteItem().catch(error => {
            setError(error.message);
        });
    };
    if (loading) return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-danger text-center mt-5">Lỗi: {error}</div>;
    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Danh sách danh mục</h1>
                    <Link
                        to="/categories/add"
                        className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Thêm danh mục
                    </Link>
                </div>

                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Tên danh mục</th>
                            <th className="px-4 py-2 border">Mô tả</th>
                            <th className="px-4 py-2 border">Ẩn</th>
                            <th className="px-4 py-2 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className="text-center">
                                <td className="border px-4 py-2">{cat.id}</td>
                                <td className="border px-4 py-2">{cat.name}</td>
                                <td className="border px-4 py-2">{cat.description}</td>
                                <td className="border px-4 py-2">{cat.hide ? "Có" : "Không"}</td>
                                <td className="border px-4 py-2 space-x-2">
                                    <Link
                                        to={`/categories/edit/${cat.id}`}
                                        className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(cat.id)}
                                        className="bg-red-500 px-3 py-1 rounded text-black hover:bg-red-600"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CategoryList;