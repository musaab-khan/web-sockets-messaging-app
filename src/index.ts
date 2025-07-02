import express from 'express';
import connection from './db/connection';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter';
import friendRouter from './routes/friendRouter';
import groupRouter from  './routes/groupRouter'
import messagesRouter from './routes/messagesRouter';
import groupMessageRouter from './routes/groupMessageRouter';
import friendRequestRouter from './routes/friendRequestRouter'
import cors from 'cors';
import {setupWebSocket} from './ws';
import worker from './messageQueueWorker';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users',userRouter);
app.use('/friends',friendRouter);
app.use('/messages',messagesRouter);
app.use('/groups',groupRouter)
app.use('/group_messages',groupMessageRouter);
app.use('/friend_requests',friendRequestRouter);

const PORT = process.env.PORT || 5000;

(async () => {
  await connection();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  setupWebSocket(app);
  worker;
})();
