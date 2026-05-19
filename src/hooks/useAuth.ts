import { useEffect } from 'react';
import { introspect, refreshToken } from '../apis/AuthApi';

export const useAuth = () => {

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        const check = async () => {
            try {
                await introspect();
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('roles');
                localStorage.removeItem('avatar');
            }
        };

        check();
    }, [token]);

    useEffect(() => {
        if (!token) return;

        const interval = setInterval(async () => {
            const data = await refreshToken();

            if (data != null) {
                localStorage.setItem(
                    'token',
                    data.result?.token ?? ''
                );
            }
        }, 15 * 60 * 1000);

        return () => clearInterval(interval);
    }, [token]);
};