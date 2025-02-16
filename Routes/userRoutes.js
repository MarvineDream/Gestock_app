import express from 'express';
import { createUserForAgency, deleteUser, getAllUsers, getUserById, loginUser, registerUser, updateUser } from '../controllers/userControllers.js';


const router = express.Router();


router.post('/Register', registerUser);
router.post('/Login', loginUser);
router.post('/', createUserForAgency);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;