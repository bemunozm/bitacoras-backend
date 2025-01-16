import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { UserController } from "../controllers/UserController";
import { validateRole } from "../middleware/role-validator";
import upload from "../config/multer";
  

const router = Router();

router.use(authenticate)
router.use(validateRole(['Administrador']))

router.post('/create',
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
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    UserController.deleteUser
)

router.get('/coordinators',
    handleInputErrors,
    UserController.getCoordinators
)



export default router;