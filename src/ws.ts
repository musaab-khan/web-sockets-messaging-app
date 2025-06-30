import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import Messages from './models/Message.js';
import dotenv from 'dotenv';
import Conversation from './models/Conversation.js';

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

    // ws.on('message', async (data) => {
    //   try {
    //     const msg = JSON.parse(data);

    //     const saved = await Messages.create({
    //       sender_id: msg.sender_id,
    //       content: msg.content,
    //       conversation_id: msg.conversation_id,
    //       attachment: msg.attachment || null
    //     });

    //     const conversation = await Conversation.findById(msg.conversation_id);

    //     if (!conversation || !conversation.members) return;

    //     for (const memberId of conversation.members) {
    //       if (memberId.toString() !== msg.sender_id) {
    //         const targetSocket = userSocketMap.get(memberId.toString());
    //         if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
    //           targetSocket.send(JSON.stringify({
    //             type: 'new_message',
    //             conversation_id: msg.conversation_id,
    //             content: msg.content,
    //             sender_id: msg.sender_id,
    //             createdAt: saved.createdAt
    //           }));
    //         }
    //       }
    //     }
    //   } catch (err) {
    //     console.error('Error handling message:', err);
    //     ws.send(JSON.stringify({ error: 'Failed to send message' }));
    //   }
    // });

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
