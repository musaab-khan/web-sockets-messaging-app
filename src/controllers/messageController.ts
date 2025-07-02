import Message from "../models/Message";
import mongoose from "mongoose";
import { Request, Response } from "express";
import ValidationHelper from "../helpers/validations/ValidationHelper";
import sendMessage from '../helpers/wss/sendMessage';
import redis from "../redis";
import saveUserFriendsIdsInRedis from '../helpers/redis/saveUserFriendsIdsInRedis';

class MessageController {
    async createMessage(req: Request, res: Response) {
        console.log(req.body);
        try {
            const validationRules = {
                sent_to: "string|required",
                content: "string",
                attachment: "string"
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                return res.status(400).json(validationResult);
            }

            const sent_by = req.userId;
            const { content, sent_to, attachment } = req.body;

            if (!mongoose.Types.ObjectId.isValid(sent_by)) {
                return res.status(400).json({ error: "Invalid sender_id" });
            }
            
            if (!mongoose.Types.ObjectId.isValid(sent_to)) {
                return res.status(400).json({ error: "The user who is being sent the message does not exist" });
            }

            const newMessage = await Message.create({
                sent_by,
                sent_to,
                content: content || '',
                attachment: attachment || null
            });

            let raw = await redis.get(sent_by.toString());
            if (!raw) {
                await saveUserFriendsIdsInRedis(sent_by);
                raw = await redis.get(sent_by.toString());
            }

            const friendIds = JSON.parse(raw);
            if (!Array.isArray(friendIds) || !friendIds.includes(sent_to)) {
                return res.status(401).send({
                    Error: "The user you're sending the message to is not your friend"
                });
            }
            
            sendMessage([sent_to], sent_by, newMessage);

            res.status(201).json(newMessage);
        } catch (err) {
            console.error("Error creating message:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async createMessageViaQueueWorker(message) {
        try {
            const { sent_to,content, sent_by, attachment } = message;

            await Message.create({
                sent_by,
                sent_to,
                content: content || '',
                attachment: attachment || null
            });

            console.log("Personal message saved");

        } 
        catch (err) {
            console.error("Error creating message:", err);
            throw(err);
        }
    }

    async getMessages(req: Request, res: Response){
        const sent_by = req.userId;
        const {sent_to} = req.body;
        const messages = await Message.find({
            $or: [
                { sent_by: sent_by, sent_to: sent_to },
                { sent_by: sent_to, sent_to: sent_by }
            ]
        });
        res.status(200).send({messages:messages});
    }
    async getAllMessages(req: Request, res: Response){
        const sent_by = req.userId;
        const messages = await Message.find({
            $or: [
                { sent_by: sent_by},
                { sent_to: sent_by }
            ]
        });
        res.status(200).send(JSON.stringify(messages));
    }

}

export default new MessageController();
