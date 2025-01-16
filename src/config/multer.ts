import multer from 'multer';
import path from 'path';
import fs from 'fs';

declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;  // Usa Express.Multer.File directamente
            files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
        }
    }
}

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../uploads/images');

        // Verifica si la carpeta existe, si no, la crea
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Nombre de archivo único
    }
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