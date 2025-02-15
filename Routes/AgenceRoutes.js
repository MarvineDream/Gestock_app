import express from 'express';
import { createAgency, deleteAgency, getAgencies, getAgencyById, updateAgency } from '../controllers/AgenceControllers.js';


const router = express.Router();

router.post('/', createAgency);
router.get('/', getAgencies);
router.get('/:id', getAgencyById);
router.put('/:id', updateAgency);
router.delete('/:id', deleteAgency);


export default router;