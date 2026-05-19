import { useEffect } from 'react';
import WebSocketService from '../apis/WebSocketService';

export const useWebSocket = () => {

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) return;

        if (
            !WebSocketService.getIsConnected() &&
            !WebSocketService.getIsConnecting()
        ) {
            console.log(
                '[WebSocket] reconnect after refresh'
            );

            WebSocketService.connect().catch(err => {
                console.error(err);
            });
        }
    }, []);
};