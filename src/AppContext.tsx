// App.tsx hoặc AppContext.tsx
import { createContext } from "react";

export interface AppContextType {
    keyWords: string;
    setKeyWords: (value: string) => void;
    categoryId: number;
    setCategoryId: (value: number) => void;
    productId: number;
    setProductId: (value: number) => void;
}

// Khởi tạo context với giá trị null ban đầu
export const AppContext = createContext<AppContextType | null>(null);
