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

router.post('/associate',
    validateRole(['Administrador', 'Coordinador']),	
    body('program_id')
        .notEmpty().withMessage('El programa no puede ir vacio'),
    body('user_id')
        .notEmpty().withMessage('El usuario no puede ir vacio'),
    body('turn')
        .notEmpty().withMessage('El turno no puede ir vacio'),
    handleInputErrors,
    ProgramController.associateUser
)

router.delete('/disassociate/:id',
    validateRole(['Administrador', 'Coordinador']),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ProgramController.disassociateUser
)

router.put('/update-association/:id',
    validateRole(['Administrador', 'Coordinador']),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    body('turn')
        .notEmpty().withMessage('El turno no puede ir vacio'),
    handleInputErrors,
    ProgramController.updateAssociation
)

export default router;
