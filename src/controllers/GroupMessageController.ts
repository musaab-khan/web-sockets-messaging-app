import GroupMessage from "../models/GroupMessage";
import mongoose from "mongoose";
import { Request, Response } from "express";
import ValidationHelper from "../helpers/validations/ValidationHelper";
import sendMessage from '../helpers/wss/sendMessage'
import Group from "../models/Group";

class GroupMessageController {
    async createGroupMessage(req: Request, res: Response) {
        console.log(req.body);
        try {
            const validationRules = {
                group_id: "string|required",
                content: "string",
                attachment: "string"
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                return res.status(400).json(validationResult);
            }

            const sent_by = req.userId;
            const { content, group_id, attachment } = req.body;

            if (!mongoose.Types.ObjectId.isValid(group_id)) {
                return res.status(400).json({ error: "Invalid group_id" });
            }

            const newGroupMessage = await GroupMessage.create({
                sent_by,
                group_id,
                content: content || '',
                attachment: attachment || null
            });

            const group = await Group.findById(group_id);
            if (!group || !group.members) {
                return res.status(404).json({ error: "Group not found" });
            }

            // group.members.forEach(member => {
            //     const userId = member.toString();
            //     if (userId !== sent_by) {
            //         const socket = userSocketMap.get(userId);
            //         if (socket && socket.readyState === 1) {
            //                 socket.send(JSON.stringify({
            //                         type: "new_message",
            //                         group_id,
            //                         sent_by,
            //                         content,
            //                         attachment,
            //                         createdAt: newGroupMessage.createdAt
            //                 }));   
            //         }
            //     }
            // });
            
            sendMessage(group.members, sent_by, newGroupMessage);

            return res.status(201).json(newGroupMessage);
        } catch (err) {
            console.error("Error creating group message:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getGroupMessages(req: Request, res: Response){
        const user_id = req.userId;
        const {group_id} = req.body;
        if (!mongoose.Types.ObjectId.isValid(group_id)) {
                return res.status(400).json({ error: "Invalid group_id" });
        }

        const group = await Group.findById(group_id);
        if (!group || !group.members) {
            return res.status(404).json({ error: "Conversation not found" });
        }
        if (!group.members.includes(user_id)){
            return res.status(404).json({ error: "Cannot get messages because you are not a member of the group" });
        }
        const groupMessages = await GroupMessage.find({group_id});
        res.status(200).send({messages:groupMessages});
    }

}

export default new GroupMessageController();
