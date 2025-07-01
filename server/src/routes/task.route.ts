import {Router} from "express";
import authMiddleware from "../middlewares/auth.middleware";
import TaskController from "../controllers/task.controller";

const router = Router();

router.use(authMiddleware())

router.post('/', TaskController.create);
router.put('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);
router.get('/:projectId', TaskController.findAll);
router.get('/:projectId/analytics', TaskController.analytics);

export default router;