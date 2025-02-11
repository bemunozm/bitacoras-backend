import { Router } from "express";
import { ProgramController } from "../controllers/ProgramController";
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
    body('coordinator_id')
        .notEmpty().withMessage('El coordinador no puede ir vacio'),
    handleInputErrors,
    ProgramController.createProgram
)

router.get('/get',
    handleInputErrors,
    ProgramController.getPrograms
)

router.get('/get/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ProgramController.getProgram
)

router.put('/update/:id',
    validateRole(['Administrador']),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ProgramController.updateProgram
)

router.delete('/delete/:id',
    validateRole(['Administrador']),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ProgramController.deleteProgram
)

export default router;
