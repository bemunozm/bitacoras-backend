import { Router } from "express";
import { ResidenceController } from "../controllers/ResidenceController";
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
    ResidenceController.createResidence
)

router.get('/get',
    handleInputErrors,
    ResidenceController.getResidences
)

router.get('/get/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ResidenceController.getResidence
)

router.put('/update/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ResidenceController.updateResidence
)

router.delete('/delete/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ResidenceController.deleteResidence
)



export default router;