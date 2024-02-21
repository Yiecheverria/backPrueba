import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads')
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
      
    }
});
export const upload = multer({
    storage,
    fileFilter(req, file, callback) {
        const fileExtension = path.extname(file.originalname)
        if (!fileExtension.includes('.pdf')) {
            callback(new Error('Only pdfs are allowed'))
        }
        callback(null, true)
    }
}).single('pdf');