import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getProductsByCategory, getProductsBySupplier, updateProduct } from '../controllers/ProduitControllers.js';


const router = express.Router();

router.post('/', addProduct);
router.get('/', getAllProducts);
router.get('/supplier/:supplierId', getProductsBySupplier);
router.get('/category/:categoryId', getProductsByCategory);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);







export default router;