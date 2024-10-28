import WebSocket from 'ws';

export const handleConnection = (ws: WebSocket) => {
    console.log('New client connected');
};

export const handleMessage = (ws: WebSocket, message: string) => {
    console.log(`Received message: ${message}`);
    const parsedMessage = JSON.parse(message);

    // Process messages based on their type
    switch (parsedMessage.type) {
        case 'reg':
            // Handle registration logic
            break;
        case 'create_room':
            // Handle room creation logic
            break;
        case 'attack':
            // Handle attack logic
            break;
        // Add other cases as needed
        default:
            console.log('Unknown message type');
    }
};
