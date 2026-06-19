import { useEffect } from 'react';
import { introspect, refreshToken } from '../apis/AuthApi';
import type { TokenRequest } from '../models/request/TokenRequest';

export const useAuth = () => {

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;

        const check = async () => {
            try {
                const data: TokenRequest = { token };
                await introspect(data);
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
        const oldToken: TokenRequest = { token };
        const interval = setInterval(async () => {
            const data = await refreshToken(oldToken);

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