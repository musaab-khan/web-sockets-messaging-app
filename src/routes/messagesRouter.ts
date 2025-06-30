import {Router} from 'express';
import messageController from '../controllers/messageController';
import printRequest from '../middleware/test';

const router = Router();

router.post("/new", printRequest, messageController.createMessage);
router.post("/get_messages", printRequest, messageController.getMessage);

export default router;

