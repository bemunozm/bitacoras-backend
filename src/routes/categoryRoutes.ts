import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { validateRole } from "../middleware/role-validator";

const router = Router();

router.use(authenticate)
router.use(validateRole(['Administrador']))

router.post('/create',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    handleInputErrors,
    CategoryController.createCategory
)

router.get('/get',
    handleInputErrors,
    CategoryController.getCategories
)

router.get('/get/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    CategoryController.getCategory
)

router.put('/update/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    CategoryController.updateCategory
)

router.delete('/delete/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    CategoryController.deleteCategory
)

export default router;
