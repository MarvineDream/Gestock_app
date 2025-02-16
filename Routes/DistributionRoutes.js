import express from 'express';
import { createDistribution, deleteDistribution, getAllDistributions, getDistributionById, getDistributionsByDestinataire } from '../controllers/DistributionControllers.js';


const router = express.Router();

router.post('/', createDistribution);
router.get('/', getAllDistributions);
router.get('/:id', getDistributionsByDestinataire);
router.get('/:id', getDistributionById);
router.delete('/:id', deleteDistribution);



export default router;