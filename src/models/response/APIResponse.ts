export interface APIResponse<T> {
    code: number;
    message: string;
    result: T | null;
    resultList: T[] | null;
}
