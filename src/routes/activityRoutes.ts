import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { validateRole } from "../middleware/role-validator";
import { ActivityController } from "../controllers/ActivityController";
import upload from "../config/multer";

const router = Router();

router.use(authenticate)


router.post('/create',
    upload.array('attachments[]',10),
    body('description')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('date')
        .notEmpty().withMessage('El campo fecha no puede ir vacio'),
    body('bitacora_id')
        .isNumeric().withMessage('El id debe ser un número')
        .notEmpty().withMessage('El id de usuario no puede ir vacio'),
    body('category_id')
        .isNumeric().withMessage('El id debe ser un número')
        .notEmpty().withMessage('El id de programa no puede ir vacio'),
    handleInputErrors,
    ActivityController.createActivity
)

router.get('/get',
    handleInputErrors,
    ActivityController.getActivities
)

router.get('/get/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ActivityController.getActivity
)

router.put('/update/:id',
    upload.array('newAttachments[]',10),
    param('id')
        .isNumeric().withMessage('El id debe ser un número')
        .notEmpty().withMessage('El id no puede ir vacio'),
    body('description')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('date')
        .notEmpty().withMessage('El campo fecha no puede ir vacio'),
    body('bitacora_id')
        .notEmpty().withMessage('El id de usuario no puede ir vacio'),
    body('category_id')
        .notEmpty().withMessage('El id de programa no puede ir vacio'),
    handleInputErrors,
    ActivityController.updateActivity
)

router.delete('/delete/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ActivityController.deleteActivity
)

router.get('/bitacora/:id',
    param('id')
        .notEmpty().withMessage('El id no puede ir vacio'),
    handleInputErrors,
    ActivityController.getActivitiesByBitacora
)

export default router;
