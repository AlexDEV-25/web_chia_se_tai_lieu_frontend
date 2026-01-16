import axios from 'axios';

export const handleApiError = (err: any, defaultMessage: string): string => {
    if (axios.isAxiosError(err)) {
        return err.response?.data?.message ?? err.message ?? defaultMessage;
    }
    return defaultMessage;
};
