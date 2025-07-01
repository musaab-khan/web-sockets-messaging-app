import {Router} from 'express';
import GroupController from '../controllers/GroupController';
import authenticateToken from '../middleware/authenticateToken';

const router = Router();
router.use(authenticateToken);

router.post("/new", GroupController.newGroup);
router.get("/get_groups", GroupController.getGroups);

export default router;

