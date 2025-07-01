import Group from "../models/Group";
import mongoose from "mongoose";
import { Request, Response } from 'express';
import ValidationHelper from "../helpers/validations/ValidationHelper";

class GroupController {
    async newGroup(req: Request, res: Response) {
        try {
            const validationRules = {
                members: 'array|required|min:2',
                group_name: 'string|required|min:3|max:20'
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                console.log("Validation Error")
                return res.status(400).json(validationResult);
            }

            const user_id = req.userId;
            const { members, group_name } = req.body;

            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return res.status(400).json({ error: "Invalid user_id" });
            }
            if (!Array.isArray(members) || members.length === 0) {
                return res.status(400).json({ error: "recipient_ids must be a non-empty array" });
            }

            const invalidIds = members.filter((id: string) => !mongoose.Types.ObjectId.isValid(id));
            if (invalidIds.length > 0) {
                return res.status(400).json({ error: `Invalid recipient_id(s): ${invalidIds.join(', ')}` });
            }

            if(!members.includes(user_id)){
                members.push(user_id);
            }

            const newGroup = await Group.create({
                members,
                name: group_name,
                admin: user_id
            });

            return res.status(201).json(newGroup);
        }
        catch (err) {
            console.error("Error creating conversation:", err);
            return res.status(500).send({ error: "Internal Server Error" });
        }
    }

    async getGroups(req: Request, res: Response){
        try{
            const user_id = req.userId;
            const conversations = await Group.find({members: user_id});

            return res.status(200).send(JSON.stringify(conversations));
        }
        catch(err){
            return res.status(500).send({error:err});
        }
    }
}

export default new GroupController();
