import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = path.join(__dirname, '../uploads/');
    
    if (file.fieldname === 'idFront' || file.fieldname === 'idBack') {
      folder = path.join(folder, 'ids/');
    } else if (file.fieldname === 'selfieWithId') {
      folder = path.join(folder, 'selfies/');
    }
    
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${req.userId}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const uploadVerificationImages = upload.fields([
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'selfieWithId', maxCount: 1 }
]);