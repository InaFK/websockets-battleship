import { httpServer } from "./src/http_server/index.js";
import { startWebSocketServer } from "./src/websocket-server/index.js";
import config from './src/config/config.js';
// import WebSocket from 'ws';

console.log(`Start static http server on the ${config.HTTP_PORT} port!`);
httpServer.listen(config.HTTP_PORT);

startWebSocketServer(httpServer);
console.log(`WebSocket server is ready to accept connections on port ${config.WS_PORT}.`);

// Handle graceful shutdown
const cleanup = () => {
    console.log('Shutting down gracefully...');
    // wss.close();
    process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);