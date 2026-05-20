import { useState, useEffect } from "react";
import { getAllPublicCategory } from "../apis/CategoryApi";
import { ERROR_MESSAGES } from "../constants/messages";
import { handleApiError } from "../utils/errorHandler";
import type { CategoryResponse } from "../models/response/category/CategoryResponse";


function usePublicCategories() {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await getAllPublicCategory();
                setCategories((response?.resultList ?? []));
            } catch (err: any) {
                const message = handleApiError(err, ERROR_MESSAGES.CATEGORY_LOAD_FAILED);
                console.log(message);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return { categories, loading };
}

export default usePublicCategories;
