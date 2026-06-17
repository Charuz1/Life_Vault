import express from 'express';
import { searchDocuments } from '../controllers/searchController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, searchDocuments);

export default router;
