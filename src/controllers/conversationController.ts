import Conversation from "../models/Conversation";
import mongoose from "mongoose";
import { Request, Response } from 'express';
import ValidationHelper from "../helpers/validations/ValidationHelper";

class ConversationController {

    async newConversation(req: Request, res: Response) {
        try {
            const validationRules = {
                recipient_ids: 'array|required',
                isGroup: 'boolean|required',
                conversation_name: 'string|min:3|max:20'
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                console.log("Validation Error")
                return res.status(400).json(validationResult);
            }

            const user_id = req.userId;
            const { recipient_ids, isGroup, conversation_name } = req.body;

            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return res.status(400).json({ error: "Invalid user_id" });
            }
            if (!Array.isArray(recipient_ids) || recipient_ids.length === 0) {
                return res.status(400).json({ error: "recipient_ids must be a non-empty array" });
            }
            const invalidIds = recipient_ids.filter((id: string) => !mongoose.Types.ObjectId.isValid(id));
            if (invalidIds.length > 0) {
                return res.status(400).json({ error: `Invalid recipient_id(s): ${invalidIds.join(', ')}` });
            }
            if (!isGroup && recipient_ids.includes(user_id)) {
                return res.status(400).json({ error: "Cannot create a one-to-one conversation with yourself" });
            }

            const members = [user_id, ...recipient_ids];

            const conversation = await Conversation.create({
                members,
                isGroup,
                name: isGroup ? conversation_name : undefined,
                admin: isGroup ? user_id : undefined
            });

            return res.status(201).json(conversation);
        }
        catch (err) {
            console.error("Error creating conversation:", err);
            return res.status(500).send({ error: "Internal Server Error" });
        }
    }

    async getConversations(req: Request, res: Response){
        try{
            const user_id = req.userId;

            const conversations = await Conversation.find({
                members: new mongoose.Types.ObjectId(user_id)
            });

            return res.status(200).send({conversations})
        }
        catch(err){
            return res.status(500).send({error:err});
        }
    }
}

export default new ConversationController();
