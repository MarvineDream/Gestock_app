import express from 'express';
import { createSupplier, deleteSupplier, getSupplierById, getSuppliers, updateSupplier } from '../controllers/FournisseurControllers.js';


const router = express.Router();

router.post('/', createSupplier);
router.get('/', getSuppliers);
router.get('/:id', getSupplierById);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);







export default router;