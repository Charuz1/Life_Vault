import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Document from '../models/Document';

export const searchDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    // Basic MongoDB Text Search (handles keywords from natural language)
    const documents = await Document.find({
      userId: req.user._id,
      $text: { $search: query },
    }).sort({ score: { $meta: 'textScore' } });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
