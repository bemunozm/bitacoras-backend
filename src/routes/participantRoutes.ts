import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { ParticipantController } from "../controllers/ParticipantController";

const router = Router();

router.use(authenticate);

router.get('/get/:id/diseases',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ParticipantController.getDiseasesByParticipant
)

router.post('/create',
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('run').notEmpty().withMessage('El RUN no puede ir vacío'),
    ParticipantController.createParticipant
);

router.get('/get',
    handleInputErrors,
    ParticipantController.getParticipants
);

router.get('/get/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ParticipantController.getParticipant
);

router.get('/get/:id/populated',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ParticipantController.getPopulatedParticipant
)

router.put('/update/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ParticipantController.updateParticipant
);

router.delete('/delete/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ParticipantController.deleteParticipant
);

router.post('/deliver-benefits',
    body('participant_id').isNumeric().withMessage('El ID del participante debe ser un número').notEmpty().withMessage('El ID del participante no puede ir vacío'),
    body('benefits').isArray().withMessage('Los beneficios deben ser un arreglo').notEmpty().withMessage('Los beneficios no pueden ir vacíos'),
    body('date')
        .notEmpty().withMessage('La fecha no puede ir vacía'),
    body('turn')
        .notEmpty().withMessage('El turno no puede ir vacío'),
    handleInputErrors,
    ParticipantController.deliverBenefits
)

router.delete('/remove-delivered-benefits',

    handleInputErrors,
    ParticipantController.deleteDeliveredBenefits
)

router.put('/update-delivered-benefits/:id',
    param('id')
        .isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    body('date')
        .notEmpty().withMessage('La fecha no puede ir vacía'),
    body('turn')
        .notEmpty().withMessage('El turno no puede ir vacío'),
    body('provision_id')
        .notEmpty().withMessage('Los beneficios no pueden ir vacíos'),
    handleInputErrors,
    ParticipantController.updateDeliveredBenefit
)

router.get('/get-residences/:id',
    param('id')
        .isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ParticipantController.getParticipantResidences
)


export default router;
