import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Document from '../models/Document';
import cloudinary from '../utils/cloudinary';
import { extractTextFromImage } from '../services/ocrService';
import streamifier from 'streamifier';

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, tags, issueDate, expiryDate } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    // Process OCR if image
    let ocrText = '';
    if (file.mimetype.startsWith('image/')) {
      ocrText = await extractTextFromImage(file.buffer);
    }

    // Upload to Cloudinary or save locally
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name') {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'lifevault', resource_type: 'auto' },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Cloudinary upload failed', error });
          }
          const document = await Document.create({
            userId: req.user._id, title, description, fileUrl: result?.secure_url,
            fileType: file.mimetype, category, tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
            ocrText, issueDate, expiryDate,
          });
          res.status(201).json(document);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    } else {
      // Local fallback
      import('fs').then(async fs => {
        import('path').then(async path => {
          const filename = `${Date.now()}-${file.originalname}`;
          const filepath = path.default.join(process.cwd(), 'uploads', filename);
          fs.default.writeFileSync(filepath, file.buffer);
          
          const document = await Document.create({
            userId: req.user._id, title, description, fileUrl: `http://localhost:5000/uploads/${filename}`,
            fileType: file.mimetype, category, tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
            ocrText, issueDate, expiryDate,
          });
          res.status(201).json(document);
        });
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const documents = await Document.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    if (document.userId.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
