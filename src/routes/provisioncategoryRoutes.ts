import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { ProvisionCategoryController } from "../controllers/ProvisionCategoryController";
import { validateRole } from "../middleware/role-validator";

const router = Router();

router.use(authenticate);

router.post('/create',
    validateRole(['Administrador', 'Monitor']),
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    handleInputErrors,
    ProvisionCategoryController.createProvisionCategory
);

router.get('/get',
    handleInputErrors,
    ProvisionCategoryController.getProvisionCategories
);

router.get('/get/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ProvisionCategoryController.getProvisionCategory
);

router.put('/update/:id',
    validateRole(['Administrador', 'Monitor']),
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ProvisionCategoryController.updateProvisionCategory
);

router.delete('/delete/:id',
    validateRole(['Administrador', 'Monitor']),
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ProvisionCategoryController.deleteProvisionCategory
);

export default router;
