import WebSocket from 'ws';

const clients = new Map<string, WebSocket>();

export const handleConnection = (ws: WebSocket) => {
    const clientId = generateClientId();
    clients.set(clientId, ws);

    console.log(`New client connected with ID: ${clientId}`);

    ws.send(JSON.stringify({ message: `Welcome, client ${clientId}!` }));

    (ws as any).clientId = clientId;
};

export const handleMessage = (ws: WebSocket, message: string) => {
    console.log(`Received message: ${message}`);
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
        case 'reg':
            handleRegistration(ws, parsedMessage);
            break;
        case 'create_room':
            handleRoomCreation(ws, parsedMessage);
            break;
        case 'attack':
            handleAttack(ws, parsedMessage);
            break;
        default:
            console.log('Unknown message type');
    }
};

export const handleDisconnection = (ws: WebSocket) => {
    const clientId = (ws as any).clientId;
    if (clientId && clients.has(clientId)) {
        clients.delete(clientId);
        console.log(`Client ${clientId} disconnected`);
        broadcastMessage(`Client ${clientId} has left the game.`);
    }
};

function handleRegistration(ws: WebSocket, message: { name: string; password: string }) {
    const { name, password } = message;
    console.log(`Registering user: ${name} with password: ${password}`);

    ws.send(JSON.stringify({ message: 'Login successful!', type: 'reg', userId: name }));
    broadcastMessage(`User ${name} has joined the game.`);
}

function handleRoomCreation(ws: WebSocket, message: any) {
    console.log('Room creation request received', ws, message);
}

function handleAttack(ws: WebSocket, message: any) {
    console.log('Attack request received', ws, message);
}

function generateClientId() {
    return Math.random().toString(36).substring(2, 15);
}

function broadcastMessage(message: string) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message }));
        }
    });
}