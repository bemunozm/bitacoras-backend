import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { ProvisionController } from "../controllers/ProvisionController";

const router = Router();

router.use(authenticate);

router.post('/create',
    body('name').notEmpty().withMessage('El nombre no puede ir vacío'),
    body('provision_category_id').isNumeric().withMessage('El ID de la categoría debe ser un número').notEmpty().withMessage('El ID de la categoría no puede ir vacío'),
    handleInputErrors,
    ProvisionController.createProvision
);

router.get('/get',
    handleInputErrors,
    ProvisionController.getProvisions
);

router.get('/get/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ProvisionController.getProvision
);

router.put('/update/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ProvisionController.updateProvision
);

router.delete('/delete/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ProvisionController.deleteProvision
);

router.get('/get/assigned-provisions/:date/:turn',
    param('date').notEmpty().withMessage('La fecha no puede ir vacía'),
    param('turn').notEmpty().withMessage('El turno no puede ir vacío'),
    handleInputErrors,
    ProvisionController.getProvisionsAssignedByDate
);

router.get('/participant/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ProvisionController.getProvisionsByParticipant
)

router.get('/delivered/:id',
    param('id').isNumeric().withMessage('El ID debe ser un número').notEmpty().withMessage('El ID no puede ir vacío'),
    handleInputErrors,
    ProvisionController.getDeliveredBenefit
)


export default router;
