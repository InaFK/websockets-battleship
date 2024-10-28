import WebSocket from 'ws';

const clients = new Map<string, WebSocket>();

export const handleConnection = (ws: WebSocket) => {
    const clientId = generateClientId();
    clients.set(clientId, ws);

    console.log(`New client connected with ID: ${clientId}`);

    ws.send(JSON.stringify({ message: `Welcome, client ${clientId}!` }));

    (ws as any).clientId = clientId;

    ws.on('close', () => handleDisconnection(ws));
};

export const handleMessage = (ws: WebSocket, message: string) => {
    console.log(`Received message: ${message}`);
    
    if (!message) {
        console.error('Received empty or undefined message');
        return;
    }

    try {
        const parsedMessage = JSON.parse(message);

        if (typeof parsedMessage !== 'object' || !parsedMessage.type) {
            ws.send(JSON.stringify({ type: 'error', message: 'Message must have a type field.' }));
            return;
        }

        console.log(`Processing command: ${parsedMessage.type}`);

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
                ws.send(JSON.stringify({ type: 'error', message: 'Unknown command type.' }));
        }
    } catch (error) {
        console.error('Error parsing message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON format.' }));
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

function handleRegistration(ws: WebSocket, message: { name?: string; password?: string }) {
    const { name, password } = message;

    if (!name || !password) {
        const errorResponse = {
            type: 'reg',
            status: 'error',
            message: 'Name and password are required.'
        };
        ws.send(JSON.stringify(errorResponse));
        return;
    }

    console.log(`Registering user: ${name} with password: ${password}`);

    const response = { type: 'reg', status: 'success', message: 'Login successful!', userId: name };
    ws.send(JSON.stringify(response));
    console.log(`Sent response: ${JSON.stringify(response)}`);

    broadcastMessage(`User ${name} has joined the game.`);
}

function handleRoomCreation(ws: WebSocket, message: any) {
    console.log('Room creation request received', message);
    // Implement room creation logic
    const response = { type: 'create_room', status: 'success', message: 'Room created successfully!' };
    ws.send(JSON.stringify(response));
    console.log(`Sent response: ${JSON.stringify(response)}`);
}

function handleAttack(ws: WebSocket, message: any) {
    console.log('Attack request received', message);
    // Implement attack logic
    const response = { type: 'attack', status: 'success', message: 'Attack registered!' };
    ws.send(JSON.stringify(response));
    console.log(`Sent response: ${JSON.stringify(response)}`);
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
