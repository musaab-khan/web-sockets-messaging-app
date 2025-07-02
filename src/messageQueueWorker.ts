import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import MessageController from './controllers/MessageController';
import GroupMessageController from './controllers/GroupMessageController';

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  'messagesQueue',
  async job => {
        const messageObj = job.data;
        if(messageObj.type == "personal"){
            console.log("Personal message")
            await MessageController.createMessageViaQueueWorker(messageObj);
        }
        else if(messageObj.type == "group"){
            GroupMessageController.createGroupMessageQueueWorker(messageObj);
        }
  },
  { connection },
);

export default worker;