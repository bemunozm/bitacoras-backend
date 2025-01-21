import { Router } from "express";
import { RoleController } from "../controllers/RoleController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { validateRole } from "../middleware/role-validator";
  

const router = Router();

router.use(authenticate)

router.post('/create',
    validateRole(['Administrador']),
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    handleInputErrors,
    RoleController.createRole
)

router.get('/get',
    handleInputErrors,
    RoleController.getRoles
)

router.get('/get/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    RoleController.getRole
)

router.put('/update/:id',
    validateRole(['Administrador']),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    RoleController.updateRole
)

router.delete('/delete/:id',
    validateRole(['Administrador']),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    RoleController.deleteRole
)



export default router;