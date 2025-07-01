import mongoose, { mongo } from "mongoose";
import redis from "../../redis";
import FriendController from '../../controllers/FriendController'

export default async function saveUserFriendsIdsInRedis(user_id: mongoose.Types.ObjectId){
    try{
        const list = await FriendController.getFriendsIdsFormattedForSavingInRedis(user_id);
        await redis.set(user_id.toString(), JSON.stringify(list));
    }
    catch(err){
        throw(err)
    }
};