import { httpServer } from "./src/http_server/index.js";
import { startWebSocketServer } from "./src/websocket-server/index.js";
import config from './src/config/config.js';

console.log(`Start static http server on the ${config.HTTP_PORT} port!`);
httpServer.listen(config.HTTP_PORT);

startWebSocketServer(httpServer);
