// utils/cloudinaryStorage.js
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'your-folder-name',
    allowed_formats: ['jpg', 'png', 'pdf', 'jpeg'],
  },
});

const upload = multer({ storage });

export default upload;
