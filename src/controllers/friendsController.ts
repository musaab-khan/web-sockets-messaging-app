import {Request, Response} from 'express';
import ValidationHelper from "../helpers/validations/ValidationHelper";
import Friends from "../models/Friends";
import mongoose from "mongoose";

class friendController{
    async newRequest( req: Request, res: Response ){
        try{
            const validationRules = {
                requester: 'number|required',
                recipient: 'number|required'
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                return res.status(400).json(validationResult);
            }

            const { requester, recipient } =req.body;
            const [userA, userB] = requester < recipient 
                                                    ? [requester, recipient]
                                                    : [recipient, requester];

            const newFriendRequest = await Friends.create({
            user1: userA,
            user2: userB,
            sent_by: requester,
            status: 'pending'
            });

            res.status(201).send({msg:"Friend request sent", Users: newFriendRequest});
        }
        catch(err){
            return res.status(400).send({error:err});
        }
    }

    async pendingRequests( req: Request, res: Response ){
        try{
            const {user_id} = req.body;
            if(!user_id){
                return res.status(400).json({error:"user_id is required"});
            }
            const requests = await Friends.find({
                status: 'pending',
                $or: [
                        { user1: user_id },
                        { user2: user_id }
                    ],
                sent_by: { $ne: user_id }
            }).populate('user1 user2 sent_by', 'name email');

            res.status(200).json({ requests });
        }
        catch(err){
            return res.status(400).json({error:err});
        }
    }

    async acceptRequest(req: Request, res: Response) {
        try {
            const { request_id } = req.body;

            if (!request_id) {
                return res.status(400).json({ error: "Missing request_id" });
            }

            const updated = await Friends.findByIdAndUpdate(
                request_id,
                { status: 'accepted' },
                { new: true }
            );

            if (!updated) {
            return res.status(404).json({ error: "Friend request not found" });
            }

            return res.status(200).json({ message: "Friend request accepted", friend: updated });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message || err });
        }
    }

    async getFriendsList(req: Request, res: Response) {
        try {
            const { user_id } = req.body;

            if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: "Invalid or missing user_id" });
            }

            const friends = await Friends.find({
            status: 'accepted',
            $or: [
                { user1: user_id },
                { user2: user_id }
            ]
            }).populate('user1 user2', 'user_name email');

            const formatted = friends.map(f => {
            const friendUser = f.user1._id.toString() === user_id
                ? f.user2
                : f.user1  as any;
                return {
                    _id: friendUser._id,
                    name: friendUser.user_name,
                    email: friendUser.email,
                    friendship_id: f._id
                };
            });

            return res.status(200).json({ friends: formatted });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message || err });
        }
}

}

export default new friendController();