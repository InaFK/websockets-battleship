import WebSocket, { WebSocketServer } from 'ws'
import { handleConnection, handleMessage, handleDisconnection } from './handlers.js';

const wss = new WebSocketServer({ noServer: true });

export const startWebSocketServer = (server: any) => {
    server.on('upgrade', (request: any, socket: any, head: any) => {
        wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
            wss.emit('connection', ws, request);
        });
    });

    wss.on('connection', (ws: WebSocket) => {
        handleConnection(ws);
        ws.on('message', (message: string) => handleMessage(ws, message));
        ws.on('close', () => {
            handleDisconnection(ws);
        });
    });

    console.log('WebSocket server started');
};
