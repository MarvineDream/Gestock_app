import express from 'express';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../controllers/CategorieControllers.js';


const router = express.Router();


router.post('/', createCategory);
router.get('/', getCategories);
router.put('/', updateCategory);
router.delete('/', deleteCategory);



export default router;