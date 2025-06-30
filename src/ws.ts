import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

export const userSocketMap = new Map();

export function setupWebSocket(app) {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const user_id = url.searchParams.get('user_id');

    if (!user_id) {
      ws.send(JSON.stringify({ error: 'Missing user_id in connection URL' }));
      ws.close();
      return;
    }
    userSocketMap.set(user_id, ws);
    ws.user_id = user_id;

    console.log(`User ${user_id} connected via WebSocket`);

    ws.on('close', () => {
      console.log(`User ${user_id} disconnected`);
      userSocketMap.delete(user_id);
    });

    ws.send(JSON.stringify({ system: "Connected to WebSocket server" }));
  });

  const WS_PORT = process.env.WS_PORT || 3001;
  server.listen(WS_PORT, () => {
    console.log(`WebSocket server listening at ws://localhost:${WS_PORT}`);
  });
}
