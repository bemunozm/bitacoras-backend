import multer from 'multer';
import multerStorageCloudinary from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,

    api_secret: process.env.CLOUDINARY_API_SECRET,

});

declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;  // Usa Express.Multer.File directamente
            files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
        }
    }
}

// Configuración de almacenamiento de multer
const storage = multerStorageCloudinary({
    cloudinary: cloudinary,
    params: {
        public_id: (req, file) => file.originalname.replace(/\.[^/.]+$/, ""), // Elimina la extensión del archivo
    },
});

// Filtro de archivos para validar tipo de archivo
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Límite de tamaño para los archivos (10MB)
const limits = {
    fileSize: 10 * 1024 * 1024, // 10 MB
};

// Inicialización de multer con la configuración anterior
const upload = multer({ storage, fileFilter, limits });

export default upload;