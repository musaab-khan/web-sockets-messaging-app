import Messages from "../models/Messages";
import mongoose from "mongoose";
import { Request, Response } from "express";
import ValidationHelper from "../helpers/validations/ValidationHelper";
import { userSocketMap } from "../ws";
import Conversations from "../models/Conversations";

class messageController {

    async createMessage(req: Request, res: Response) {
        try {
            const validationRules = {
                sender_id: "string|required",
                conversation_id: "string|required",
                content: "string",
                attachment: "string"
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                return res.status(400).json(validationResult);
            }

            const { sender_id, content, conversation_id, attachment } = req.body;

            if (!mongoose.Types.ObjectId.isValid(sender_id)) {
                return res.status(400).json({ error: "Invalid sender_id" });
            }

            if (!mongoose.Types.ObjectId.isValid(conversation_id)) {
                return res.status(400).json({ error: "Invalid conversation_id" });
            }

            const message = await Messages.create({
                sender_id,
                content: content || '',
                conversation_id,
                attachment: attachment || null
            });

            const conversation = await Conversations.findById(conversation_id);
            if (!conversation || !conversation.members) {
                return res.status(404).json({ error: "Conversation not found" });
            }

            conversation.members.forEach(member => {
                const userId = member.toString();
                if (userId !== sender_id) {
                    const socket = userSocketMap.get(userId);
                    if (socket && socket.readyState === 1) { // 1 = OPEN
                        socket.send(JSON.stringify({
                            type: "new_message",
                            conversation_id,
                            sender_id,
                            content,
                            attachment,
                            createdAt: message.createdAt
                        }));
                    }
                }
            });


            return res.status(201).json(message);
        } catch (err) {
            console.error("Error creating message:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getMessage(req: Request, res: Response){
        const {conversation_id} = req.body;

        const messages = await Messages.find({conversation_id});
        res.status(200).send({messages:messages});
    }

}

export default new messageController();
