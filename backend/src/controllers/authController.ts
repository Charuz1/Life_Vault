import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import cloudinary from '../utils/cloudinary';
import streamifier from 'streamifier';
import path from 'path';
import fs from 'fs';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });

    if (user) {
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        avatarUrl: user.avatarUrl, token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        avatarUrl: user.avatarUrl, token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name') {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'lifevault_avatars', resource_type: 'image' },
        async (error, result) => {
          if (error) return res.status(500).json({ message: 'Cloudinary upload failed', error });
          
          const user = await User.findByIdAndUpdate(req.user._id, { avatarUrl: result?.secure_url }, { new: true });
          res.json({ avatarUrl: user?.avatarUrl });
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    } else {
      const filename = `avatar-${Date.now()}-${file.originalname}`;
      const filepath = path.join(process.cwd(), 'uploads', filename);
      fs.writeFileSync(filepath, file.buffer);
      
      const user = await User.findByIdAndUpdate(req.user._id, { avatarUrl: `http://localhost:5000/uploads/${filename}` }, { new: true });
      res.json({ avatarUrl: user?.avatarUrl });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
