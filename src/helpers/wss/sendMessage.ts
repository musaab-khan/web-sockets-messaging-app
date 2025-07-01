import WebSocket from 'ws';
import mongoose from 'mongoose';
import { userSocketMap } from "../../ws";

export default function broadcastMessage(members : mongoose.Types.ObjectId[], senderId : string, message : Record<string, any>){
    try{
        members.forEach(member => {
            const userId = member.toString();
            if (userId === senderId) return;

            const socket = userSocketMap.get(userId);
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify(message));
            }
        });
    }
    catch(err){
        console.log("helpers/wss/sendMessage error: ", err);
        return {
            message: 'An error occurred during validation'
        };
    }
}
