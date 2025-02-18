import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { UserController } from "../controllers/UserController";
import { validateRole } from "../middleware/role-validator";
import upload from "../config/multer";
  

const router = Router();

router.use(authenticate)

router.post('/create',
    validateRole(['Administrador']),
    upload.single('profile_image'),
     body('run')
        .notEmpty().withMessage('El run no puede ir vacio'),
     body('name')
         .notEmpty().withMessage('El nombre no puede ir vacio'),
        
     handleInputErrors,
     UserController.createUser
)

router.get('/get',
    handleInputErrors,
    UserController.getUsers
)

router.get('/get/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    UserController.getUserById
)

router.put('/update/:id',
    upload.single('profile_image'),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    UserController.updateUser
)

router.delete('/delete/:id',
    validateRole(['Administrador']),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    UserController.deleteUser
)

router.get('/coordinators',
    handleInputErrors,
    UserController.getCoordinators
)

router.post('/create-replacement',
    validateRole(['Administrador', 'Coordinador']),
    body('run')
        .notEmpty().withMessage('El run no puede ir vacio'),
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    handleInputErrors,
    UserController.createReplacement
)

router.get('/get-replacements',
    handleInputErrors,
    UserController.getReplacements
)

router.get('/get-replacement/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    UserController.getReplacement
)

router.put('/update-replacement/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    UserController.updateReplacement
)


export default router;