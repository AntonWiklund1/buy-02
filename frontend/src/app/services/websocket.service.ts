import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { StompMessage } from '../models/StompMessage.model';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    public stompClient: any;
    private serverUrl = 'https://localhost:8084/ws'; // The URL to your WebSocket endpoint

    constructor() {
        this.initializeWebSocketConnection();
    }

    initializeWebSocketConnection() {

        if (this.stompClient?.connected) {            // Already connected
            return;
        }
        // Use SockJS as the WebSocket client
        const ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        const that = this;

        // Connect to the WebSocket server
        this.stompClient.connect({}, function () {
            that.stompClient.subscribe('/topic/order-confirmation', (message: StompMessage) => {
                if (message.body) {
                    console.log(message.body);
                    // Here you can handle your incoming message
                }
            });
        });
    }

    // Function to send messages to the server
    sendMessage(message: any) {
        this.stompClient.send('/app/send/message', {}, message);
    }

    // Disconnect the WebSocket connection
    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log('Disconnected');
    }


    // In the service, add a method to check if we are connected or not
    isConnected(): boolean {
        return this.stompClient?.connected;
    }    
}
