import {Router} from 'express';
import FriendController from '../controllers/FriendController';
import authenticateToken from '../middleware/authenticateToken'

const router = Router();
router.use(authenticateToken)

router.get("/get_friends", FriendController.getFriendsList);

export default router;