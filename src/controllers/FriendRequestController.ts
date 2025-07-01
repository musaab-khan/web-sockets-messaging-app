import FriendRequest from "../models/FriendRequest";
import {Request, Response} from 'express';
import ValidationHelper from "../helpers/validations/ValidationHelper";
import mongoose from "mongoose";
import Friend from "../models/Friend";

class FriendRequestController{
    async creatRequest(req: Request, res: Response){
        try{
            const validationRules = {
                sent_to: 'string|required'
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                console.log("Validation Error")
                return res.status(400).json(validationResult);
            }

            const sent_by = req.userId;
            const {sent_to} = req.body;

            if (!mongoose.Types.ObjectId.isValid(sent_to)){
                return res.status(400).json({ error: "Invalid ID: sent_to" });
            }

            const findRequest:any = await FriendRequest.findOne({
                $or: [
                    { sent_by: sent_by, sent_to: sent_to },
                    { sent_by: sent_to, sent_to: sent_by }
                ]
            }).populate([
                { path: 'sent_by', select: 'user_name' },
                { path: 'sent_to', select: 'user_name' }
            ]);

            if(findRequest){
                return res.status(400).json({ error: `Request Already Exists by ${findRequest.sent_by.user_name} to ${findRequest.sent_to.user_name}` });
            }

            const newRequest = await FriendRequest.create({
                sent_by,
                sent_to
            });

            res.status(200).json({ msg: "Request Generated", Request: newRequest });
        }
        catch(err){
            return res.status(500).send({error:err});
        }
    }
    
    async acceptRequest(req: Request, res: Response) {
        try {
            const validationRules = {
                request_id: 'string|required'
            };

            const validationResult = ValidationHelper.validateRequest(req, validationRules);
            if (validationResult) {
                return res.status(400).json(validationResult);
            }

            const user_id = req.userId;
            const { request_id } = req.body;
            if (!mongoose.Types.ObjectId.isValid(request_id)) {
                return res.status(400).json({ error: "Invalid request_id format" });
            }

            const request = await FriendRequest.findById(request_id);
            console.log(request);
            if (!request || request.sent_to.toString() !== user_id) {
                return res.status(400).send({
                    msg: "Either request does not exist or you do not have permission to accept the request"
                });
            }

            await request.deleteOne();
            await Friend.create({ user_id, friend_id: request.sent_by, status: "accepted" });
            await Friend.create({ user_id: request.sent_by, friend_id: user_id, status: "accepted" });

            res.status(200).send({ msg: "Request Accepted" });
        } catch (err) {
            return res.status(500).send({ error: err });
        }
    }
    
    async getRequests(req: Request, res: Response){
        try{
            const sent_to = req.userId;

            const requests = await FriendRequest.find({sent_to});

            res.status(200).json({ Requests: requests });
        }
        catch(err){
            return res.status(500).send({error:err});
        }
    }
}

export default new FriendRequestController();
