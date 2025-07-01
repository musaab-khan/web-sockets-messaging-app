import {Request, Response} from 'express';
import Friends from "../models/Friend";
import mongoose from "mongoose";

class FriendController{
    async getFriendsIdsFormattedForSavingInRedis(user_id: mongoose.Types.ObjectId) {
        try {
            const friends: any = await Friends.find({ user_id });
            const formatted = friends.map(friend => friend.friend_id.toString());
            return formatted;
        }
        catch (err) {
            throw err;
        }
    }

    async getFriendsList(req: Request, res: Response) {
        try {
            const user_id = req.userId;

            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return res.status(400).json({ error: "Invalid or missing user_id" });
            }       

            const friends:any = await Friends.find({user_id}).populate({path: 'friend_id', select: 'user_name email'});
            const formatted = friends.map(friend => ({
                friendship_id: friend._id,
                name: friend.friend_id?.user_name || '',
                email: friend.friend_id?.email || ''
            }));

            res.status(200).json({ friends: formatted });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message || err });
        }
}
}

export default new FriendController();