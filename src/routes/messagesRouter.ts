import {Router} from 'express';
import MessageController from '../controllers/MessageController';
import authenticateToken from '../middleware/authenticateToken';

const router = Router();
router.use(authenticateToken);

router.post("/new", MessageController.createMessage);
router.post("/get_messages", MessageController.getMessages);

export default router;

