import express from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/documentController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getDocuments)
  .post(protect, upload.single('file'), uploadDocument);

router.route('/:id')
  .delete(protect, deleteDocument);

export default router;
