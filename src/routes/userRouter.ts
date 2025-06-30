import {Router} from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.post("/signup", UserController.create);
router.post("/login", UserController.login);

export default router;

