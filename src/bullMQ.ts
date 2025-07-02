import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis();

export const messagesQueue = new Queue('messagesQueue',{connection});
export const groupMessagesQueue = new Queue('groupMessagesQueue', { connection });