import Chat from "../models/Conversations"; // Correct model name
import mongoose from "mongoose";
import { Request, Response } from 'express';
import ValidationHelper from "../helpers/validations/ValidationHelper";

class conversationController {

    async newConversation(req: Request, res: Response) {
        try {
            // const validationRules = {
            //     user_id: 'string|required',
            //     recipient_ids: 'Array|required',
            //     isGroup: 'boolean|required',
            //     conversation_name: 'string|min:3|max:20'
            // };

            // const validationResult = ValidationHelper.validateRequest(req, validationRules);
            // if (validationResult) {
            //     console.log("Validation Error")
            //     return res.status(400).json(validationResult);
            // }

            const { user_id, recipient_ids, isGroup, conversation_name } = req.body;

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

            const conversation = await Chat.create({
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
            const {user_id} = req.body;

            const conversations = await Chat.find({
                members: new mongoose.Types.ObjectId(user_id)
            });
            return res.status(200).send({conversations})



        }
        catch(err){
            return res.status(500).send({error:err});
        }
    }
}

export default new conversationController();
