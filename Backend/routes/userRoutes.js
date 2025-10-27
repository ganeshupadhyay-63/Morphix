import express from 'express';
import { auth } from '../middlewares/auth.js';
import { getPublishedCreations, getUserCreations, toggleLikeCreation } from '../controllers/userController.js';

const useRouter = express.Router();

useRouter.get('/get-user-creations', auth, getUserCreations);
useRouter.get('/get-published-creations', auth, getPublishedCreations);
useRouter.post('/toggle-like-creation', auth, toggleLikeCreation);

export default useRouter;
