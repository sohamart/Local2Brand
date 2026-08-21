import express from 'express';
import {
  getAnalytics,
  getClients,
  getAllProjects,
  adminCreateProject,
  adminUpdateProject,
  adminUpdateProjectStage,
  getLeads,
  updateLeadStatus,
  getAllInvoices,
  createInvoice,
  updateInvoiceStatus,
  addDemo,
  updateDemo,
  deleteDemo,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/analytics', getAnalytics);
router.get('/clients', getClients);

router.route('/projects')
  .get(getAllProjects)
  .post(adminCreateProject);

router.route('/projects/:id')
  .put(adminUpdateProject);

router.route('/projects/:id/stages')
  .put(adminUpdateProjectStage);

router.route('/leads')
  .get(getLeads);

router.route('/leads/:id')
  .put(updateLeadStatus);

router.route('/invoices')
  .get(getAllInvoices)
  .post(createInvoice);

router.route('/invoices/:id')
  .put(updateInvoiceStatus);

router.route('/demos')
  .post(addDemo);

router.route('/demos/:id')
  .put(updateDemo)
  .delete(deleteDemo);

export default router;
