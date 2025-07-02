import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import {messagesQueue} from './bullMQ';
import redis from './redis';
import saveUserFriendsIdsInRedis from './helpers/redis/saveUserFriendsIdsInRedis';
import sendMessage from './helpers/wss/sendMessage';
import mongoose from 'mongoose';
import saveGroupMembersIdsInRedis from './helpers/redis/saveGroupMemberIdsInRedis';

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

    ws.on('message', async (rawMessage)=>{
      console.log(rawMessage.toString());
      try{
        const message = JSON.parse(rawMessage.toString());
        const sent_by:any = user_id;
        const {type, content} = message;
        var messageObj;
        if(type=='personal'){
            let raw = await redis.get(sent_by.toString());
            const {sent_to} = message;
            if (!raw) {
                await saveUserFriendsIdsInRedis(sent_by);
                raw = await redis.get(sent_by.toString());
            }

            const friendIds = JSON.parse(raw);
            if (!Array.isArray(friendIds) || !friendIds.includes(sent_to)) {
                return sendMessage([sent_by], "", {error:"The user you are sending the message to is not your friend"})
            }
            sendMessage(friendIds,sent_by,message);
            messageObj =  {
              sent_to,
              sent_by,
              content,
              type,
              createdAt: new Date().toISOString()
            }
        }
        else if(type=='group'){
          const {group_id} = message;
          let raw = await redis.get(group_id.toString());
          if (!raw) {
              await saveGroupMembersIdsInRedis(group_id);
              raw = await redis.get(group_id.toString());
          }

          const groupMemberIds = JSON.parse(raw);
          if (!Array.isArray(groupMemberIds) || !groupMemberIds.includes(sent_by)) {
              return sendMessage([sent_by], "", {error: "You are not the member of the group you are sending the message to"})
          }
          sendMessage(groupMemberIds,sent_by,message);
          messageObj =  {
            group_id,
            sent_by,
            content,
            type,
            createdAt: new Date().toISOString()
          }
        }
          await messagesQueue.add('savePrivateMessage', messageObj);
      }
      catch(err){
        console.log(err)
      }
      
    });

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