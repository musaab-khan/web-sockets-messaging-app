import {Router} from 'express';
import authenticateToken from "../middleware/authenticateToken";
import FriendRequestController from '../controllers/FriendRequestController';

const router = Router();
router.use(authenticateToken);

router.post('/new',FriendRequestController.creatRequest);
router.get('/all',FriendRequestController.getRequests);
router.post('/accept_request',FriendRequestController.acceptRequest);

export default router;
