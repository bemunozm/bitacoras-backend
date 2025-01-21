import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { validateRole } from "../middleware/role-validator";
import { BitacoraController } from "../controllers/BitacoraController";

const router = Router();

router.use(authenticate)

router.post('/create',
    body('month')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('recipe')
        .notEmpty().withMessage('La receta no puede ir vacia'),
    body('user_id')
        .notEmpty().withMessage('El id de usuario no puede ir vacio'),
    body('program_id')
        .notEmpty().withMessage('El id de programa no puede ir vacio'),
    handleInputErrors,
    BitacoraController.createBitacora
)

router.get('/get',
    handleInputErrors,
    BitacoraController.getBitacoras
)

router.get('/get-by-period/:period',
    param('period')
        .notEmpty().withMessage('El periodo no puede ir vacio'),
    handleInputErrors,
    BitacoraController.getBitacorasByPeriod
)

router.get('/get/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    BitacoraController.getBitacora
)

router.put('/update/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    body('month')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('recipe')
        .notEmpty().withMessage('La receta no puede ir vacia'),
    body('user_id')
        .notEmpty().withMessage('El id de usuario no puede ir vacio'),
    body('program_id')
        .notEmpty().withMessage('El id de programa no puede ir vacio'),
    handleInputErrors,
    BitacoraController.updateBitacora
)

router.delete('/delete/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    BitacoraController.deleteBitacora
)

router.put('/change-status/:id',
    body('status')
        .notEmpty().withMessage('El status no puede ir vacio'),
    handleInputErrors,
    BitacoraController.changeBitacoraStatus
)



export default router;