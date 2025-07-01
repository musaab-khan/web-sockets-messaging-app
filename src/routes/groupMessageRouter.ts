import {Router} from 'express';
import GroupMessageController from '../controllers/GroupMessageController';
import authenticateToken from '../middleware/authenticateToken';

const router = Router();
router.use(authenticateToken);

router.post("/new", GroupMessageController.createGroupMessage);
router.post("/get_messages", GroupMessageController.getGroupMessages);

export default router;

