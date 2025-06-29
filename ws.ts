import express from 'express';
import http from 'http';
import WebSocket, {WebSocketServer} from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);
        // Echo the message back
        ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.send('musaabs message');
});

server.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000');
});
