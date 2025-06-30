import {Router} from 'express';
import FriendController from '../controllers/FriendController';
import authenticateToken from '../middleware/authenticateToken'

const router = Router();
router.use(authenticateToken)

router.post("/new_request", FriendController.newRequest);
router.post("/pending_requests", FriendController.pendingRequests);
router.post("/accept_request", FriendController.acceptRequest);
router.post("/get_friends", FriendController.getFriendsList);

export default router;