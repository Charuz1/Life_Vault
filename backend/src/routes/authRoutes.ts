import express from 'express';
import { registerUser, loginUser, updateAvatar } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

export default router;
