import express from 'express';
import { createDistribution, deleteDistribution, getDistributionById, getDistributionsByDestinataire } from '../controllers/DistributionControllers.js';


const router = express.Router();

router.post('/', createDistribution);
router.get('/', getDistributionsByDestinataire);
router.get('/:id', getDistributionById);
router.delete('/:id', deleteDistribution);



export default router;