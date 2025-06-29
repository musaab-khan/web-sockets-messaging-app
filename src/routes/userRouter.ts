import {Router} from 'express';
import userController from '../controllers/userController';
import printRequest from '../middleware/test';

const router = Router();

router.post("/signup", printRequest, userController.create);
router.post("/login", printRequest, userController.login);

export default router;

