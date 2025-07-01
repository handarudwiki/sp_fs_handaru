import {Router} from "express";
import UserController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";
const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", authMiddleware() ,UserController.findAll);

export default router;