import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

import type {
    IMessage
} from "@stomp/stompjs";

class WebSocketService {

    private client: Client | null = null;
    private isConnecting = false;
    private isConnected = false;
    private connectionPromise: Promise<void> | null = null;

    /**
     * Get connection status
     */
    getIsConnected(): boolean {
        return this.isConnected && !!this.client?.active;
    }

    /**
     * Check if currently connecting
     */
    getIsConnecting(): boolean {
        return this.isConnecting;
    }

    /**
     * Connect to WebSocket (idempotent - only connects once)
     */
    connect(onConnected?: () => void): Promise<void> {
        // If already connected, return immediately
        if (this.isConnected && this.client?.active) {
            console.log("[WebSocket] Already connected");
            if (onConnected) onConnected();
            return Promise.resolve();
        }

        // If currently connecting, return existing promise
        if (this.isConnecting && this.connectionPromise) {
            console.log("[WebSocket] Connection in progress, waiting...");
            return this.connectionPromise;
        }

        // Start new connection
        this.isConnecting = true;

        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("[WebSocket] No token found in localStorage");
                    this.isConnecting = false;
                    reject(new Error("No authentication token"));
                    return;
                }

                this.client = new Client({

                    webSocketFactory: () =>
                        new SockJS(
                            "http://localhost:8080/ws"
                        ),

                    connectHeaders: {
                        Authorization: `Bearer ${token}`
                    },

                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,

                    onConnect: () => {
                        console.log("[WebSocket] Connected successfully");
                        this.isConnected = true;
                        this.isConnecting = false;

                        if (onConnected) {
                            onConnected();
                        }
                        resolve();
                    },

                    onStompError: (frame) => {
                        console.error("[WebSocket] STOMP Error:", frame);
                        this.isConnecting = false;
                        reject(new Error(`STOMP Error: ${frame.headers.message}`));
                    },

                    onDisconnect: () => {
                        console.log("[WebSocket] Disconnected");
                        this.isConnected = false;
                    },
                });

                this.client.activate();
            } catch (e) {
                console.error("[WebSocket] Connection error:", e);
                this.isConnecting = false;
                reject(e);
            }
        });

        return this.connectionPromise;
    }

    /**
     * Subscribe to a destination
     */
    subscribe(
        destination: string,
        callback: (data: any) => void
    ): (() => void) | null {

        if (!this.client) {
            console.error("[WebSocket] Client not initialized");
            return null;
        }

        if (!this.client.active) {
            console.error("[WebSocket] Client not connected");
            return null;
        }

        const subscription = this.client.subscribe(
            destination,
            (message: IMessage) => {
                try {
                    const data = JSON.parse(message.body);
                    console.log(`[WebSocket] Message received from ${destination}:`, data);
                    callback(data);
                } catch (e) {
                    console.error("[WebSocket] Error parsing message:", e);
                }
            }
        );

        // Return unsubscribe function
        return () => {
            subscription.unsubscribe();
            console.log(`[WebSocket] Unsubscribed from ${destination}`);
        };
    }

    /**
     * Send message to destination
     */
    send(
        destination: string,
        body: any
    ): void {

        if (!this.client) {
            console.error("[WebSocket] Client not initialized");
            throw new Error("WebSocket client not initialized");
        }

        if (!this.client.active) {
            console.error("[WebSocket] Client not connected, current state:", this.client.state);
            throw new Error("There is no underlying STOMP connection. WebSocket is not ready yet. Try again in a moment.");
        }

        try {
            const payload = JSON.stringify(body);
            console.log(`[WebSocket] Sending message to ${destination}:`, body);

            this.client.publish({
                destination,
                body: payload
            });
        } catch (e) {
            console.error("[WebSocket] Error sending message:", e);
            throw e;
        }
    }

    /**
     * Disconnect from WebSocket
     */
    disconnect(): void {
        if (this.client) {
            this.client.deactivate();
            this.isConnected = false;
            console.log("[WebSocket] Disconnected");
        }
    }
}

export default new WebSocketService();