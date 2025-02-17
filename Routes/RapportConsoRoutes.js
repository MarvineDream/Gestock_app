import express from 'express';
import { createConsumptionReport, createConsumptionReportFromDistribution } from '../controllers/RapportControllers.js';


const router = express.Router();

router.post('/', createConsumptionReport);
router.post('/creer', createConsumptionReportFromDistribution);




export default router;