import {Router} from 'express';
import conversationController from '../controllers/conversationController';
import printRequest from '../middleware/test';

const router = Router();

router.post("/new", printRequest, conversationController.newConversation);
router.post("/get_conversations", printRequest, conversationController.getConversations);

export default router;

