import {Router} from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import ProjectController from '../controllers/project.controller';

const router = Router();

router.use(authMiddleware())

router.post('/', ProjectController.create);
router.put('/:id', ProjectController.update);
router.delete('/:id', ProjectController.delete);
router.get('/', ProjectController.findAll);
router.get('/:id', ProjectController.details); // Assuming this is to get a specific project, might need to adjust based on your needs
router.post('/:id/invite', ProjectController.inviteMember);
router.post('/:id/kick', ProjectController.kickMember);

export default router;

