import { Router } from "express";
import { ResidenceController } from "../controllers/ResidenceController";
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
    validateRole(['Administrador']),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ResidenceController.updateResidence
)

router.delete('/delete/:id',
    validateRole(['Administrador']),
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ResidenceController.deleteResidence
)

router.post('/participant-entrance',
    validateRole(['Administrador']),
    body('residence_id')
        .notEmpty().withMessage('El id de la residencia no puede ir vacio'),
    body('participant_id')
        .notEmpty().withMessage('El id del participante no puede ir vacio'),
    body('status')
        .notEmpty().withMessage('El estado no puede ir vacio'),
    body('admission_date')
        .notEmpty().withMessage('La fecha de ingreso no puede ir vacio'),
    handleInputErrors,
    ResidenceController.ParticipantEntrance
)

router.post('/participant-departure',
    validateRole(['Administrador']),
    body('residence_id')
        .notEmpty().withMessage('El id de la residencia no puede ir vacio'),
    body('participant_id')
        .notEmpty().withMessage('El id del participante no puede ir vacio'),
    body('status')
        .notEmpty().withMessage('El estado no puede ir vacio'),
    body('departure_date')
        .notEmpty().withMessage('La fecha de ingreso no puede ir vacio'),
    handleInputErrors,
    ResidenceController.ParticipantDeparture
)

router.get('/active-participants',
    ResidenceController.getActiveParticipants
)

router.get('/get-participants/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ResidenceController.getParticipantsByResidence
)



export default router;