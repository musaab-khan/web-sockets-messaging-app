import {Router} from 'express';
import ConversationController from '../controllers/ConversationController';
import authenticateToken from '../middleware/authenticateToken';

const router = Router();
router.use(authenticateToken);

router.post("/new", ConversationController.newConversation);
router.post("/get_conversations", ConversationController.getConversations);

export default router;

