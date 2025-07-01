import {Router} from 'express';
import MessageController from '../controllers/MessageController';
import authenticateToken from '../middleware/authenticateToken';

const router = Router();
router.use(authenticateToken);

router.post("/new", MessageController.createMessage);
router.post("/get_messages", MessageController.getMessages);
router.get("/get_all_messages", MessageController.getAllMessages);

export default router;

