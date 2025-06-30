import express from 'express';
import connection from './db/connection';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter';
import friendRouter from './routes/friendRouter';
import conversationRouter from './routes/conversationRouter';
import messagesRouter from './routes/messagesRouter';
import cors from 'cors';
import {setupWebSocket} from './ws'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users',userRouter);
app.use('/friends',friendRouter);
app.use('/conversations',conversationRouter);
app.use('/messages',messagesRouter);

const PORT = process.env.PORT || 5000;

(async () => {
  await connection();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  setupWebSocket(app);
})();
