import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { EventController } from "../controllers/EventController";

const router = Router();

router.use(authenticate);

router.post('/create',
    body('date').notEmpty().withMessage('La fecha no puede ir vacía'),
    body('description').notEmpty().withMessage('La descripción no puede ir vacía'),
    body('type').notEmpty().withMessage('El tipo no puede ir vacío'),
    body('participant_id').isNumeric().withMessage('El ID del participante debe ser un número').notEmpty().withMessage('El ID del participante no puede ir vacío'),
    handleInputErrors,
    EventController.createEvent
);

router.get('/get',
    handleInputErrors,
    EventController.getEvents
);

router.get('/get/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    EventController.getEvent
);

router.put('/update/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    EventController.updateEvent
);

router.delete('/delete/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    EventController.deleteEvent
);

router.get('/participant/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    EventController.getEventsByParticipant
);

export default router;
