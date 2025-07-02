import mongoose, { mongo } from "mongoose";
import redis from "../../redis";
import GroupController from '../../controllers/GroupController'

export default async function saveGroupMembersIdsInRedis(group_id: mongoose.Types.ObjectId){
    try{
        const list = await GroupController.getMemberIdsFormattedForSavingInRedis(group_id);
        await redis.set(group_id.toString(), JSON.stringify(list));
    }
    catch(err){
        throw(err)
    }
};