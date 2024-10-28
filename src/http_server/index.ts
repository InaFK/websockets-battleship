import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';


export const httpServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    const baseDir = path.resolve(path.dirname(''));
    const filePath = path.join(baseDir, req.url === '/' ? '/front/index.html' : `/front${req.url}`);

    fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'File not found' }));
          return;
        }
    
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
});
