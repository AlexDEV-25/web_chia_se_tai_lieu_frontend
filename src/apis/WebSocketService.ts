import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

import type {
    IMessage
} from "@stomp/stompjs";

class WebSocketService {

    private client: Client | null = null;

    connect(onConnected?: () => void) {

        const token =
            localStorage.getItem("token");

        this.client = new Client({

            webSocketFactory: () =>
                new SockJS(
                    "http://localhost:8080/ws"
                ),

            connectHeaders: {

                Authorization:
                    `Bearer ${token}`
            },

            reconnectDelay: 5000,

            onConnect: () => {

                console.log(
                    "WebSocket Connected"
                );

                if (onConnected) {
                    onConnected();
                }
            },

            onStompError: (frame) => {

                console.error(
                    "STOMP Error",
                    frame
                );
            }
        });

        this.client.activate();
    }

    subscribe(
        destination: string,
        callback: (data: any) => void
    ) {

        if (!this.client) {
            return;
        }

        this.client.subscribe(

            destination,

            (message: IMessage) => {

                callback(
                    JSON.parse(message.body)
                );
            }
        );
    }

    send(
        destination: string,
        body: any
    ) {

        if (!this.client) {
            return;
        }

        this.client.publish({

            destination,

            body: JSON.stringify(body)
        });
    }

    disconnect() {

        this.client?.deactivate();
    }
}

export default new WebSocketService();