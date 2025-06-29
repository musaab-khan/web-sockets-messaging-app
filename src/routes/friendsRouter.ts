import {Router} from 'express';
import friendsController from '../controllers/friendsController';
import printRequest from '../middleware/test';

const router = Router();

router.post("/new_request", printRequest, friendsController.newRequest);
router.post("/pending_requests", printRequest, friendsController.pendingRequests);
router.post("/accept_request", printRequest, friendsController.acceptRequest);
router.post("/get_friends", printRequest, friendsController.getFriendsList);

export default router;