import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { DiseaseController } from "../controllers/DiseaseController";

const router = Router();

router.use(authenticate);

router.post('/create',
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('type').notEmpty().withMessage('El tipo no puede ir vacío'),
    body('treatment_required').isBoolean().withMessage('El campo de tratamiento requerido debe ser booleano'),
    body('contagious').isBoolean().withMessage('El campo de contagio debe ser booleano'),
    handleInputErrors,
    DiseaseController.createDisease
);

router.get('/get',
    handleInputErrors,
    DiseaseController.getDiseases
);

router.get('/get/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    DiseaseController.getDisease
);

router.put('/update/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    DiseaseController.updateDisease
);

router.delete('/delete/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    DiseaseController.deleteDisease
);

router.post('/assign-participant',
    body('disease_id').isNumeric().withMessage('El ID de la enfermedad debe ser un número').notEmpty().withMessage('El ID de la enfermedad no puede ir vacío'),
    body('participant_id').isNumeric().withMessage('El ID del participante debe ser un número').notEmpty().withMessage('El ID del participante no puede ir vacío'),
    body('date').notEmpty().withMessage('La fecha no puede ir vacía'),
    body('treatment_status').notEmpty().withMessage('El estado del tratamiento no puede ir vacío'),
    handleInputErrors,
    DiseaseController.assignParticipant
)

router.put('/update-participant',
    body('id').isNumeric().withMessage('El ID de la enfermedad asignada debe ser un número').notEmpty().withMessage('El ID de la enfermedad asignada no puede ir vacío'),
    body('date').notEmpty().withMessage('La fecha no puede ir vacía'),
    body('treatment_status').notEmpty().withMessage('El estado del tratamiento no puede ir vacío'),
    handleInputErrors,
    DiseaseController.updateAssignedDisease
)

router.delete('/remove-participant/:id',
    param('id').isNumeric().withMessage('El ID de la enfermedad asignada debe ser un número').notEmpty().withMessage('El ID de la enfermedad asignada no puede ir vacío'),
    handleInputErrors,
    DiseaseController.deleteAssignedDisease
)

router.get('/get-disease/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    DiseaseController.getAssignedDisease
)


export default router;
