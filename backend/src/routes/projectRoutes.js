import express from 'express';
import { createProjectRequest, getMyProjects, getProjectById, uploadProjectFile } from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createProjectRequest)
  .get(getMyProjects);

router.route('/:id')
  .get(getProjectById);

router.route('/:id/files')
  .post(uploadProjectFile);

export default router;
