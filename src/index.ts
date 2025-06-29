import express from 'express';
import connection from './db/connection';
import dotenv from 'dotenv';
import userRouter from './routes/userRouter'
import friendRouter from './routes/friendsRouter'

dotenv.config();

const app = express();
app.use(express.json());

app.use('/users',userRouter);
app.use('/friends',friendRouter);

const PORT = process.env.PORT || 5000;

(async () => {
  await connection();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
