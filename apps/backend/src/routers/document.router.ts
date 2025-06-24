import { Router } from 'express';
import dataValidator from '../middlewares/data-validator';
import { documentValidation } from '../validations';
import multer from 'multer';
import { documentController } from '../controllers';
import passport from 'passport';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  passport.authenticate('bearer', { session: false }),
  upload.single('file'),
  dataValidator(documentValidation.createDocument),
  documentController.createUserDocument
);
router.get(
  '/',
  passport.authenticate('bearer', { session: false }),
  dataValidator(documentValidation.getDocuments),
  documentController.getUserDocuments
);
router.get(
  '/:id',
  passport.authenticate('bearer', { session: false }),
  dataValidator(documentValidation.getDocument),
  documentController.getUserDocumentById
);
router.patch(
  '/:id',
  passport.authenticate('bearer', { session: false }),
  upload.single('file'),
  dataValidator(documentValidation.updateDocument),
  documentController.updateUserDocumentById
);
router.delete(
  '/:id',
  passport.authenticate('bearer', { session: false }),
  dataValidator(documentValidation.deleteDocument),
  documentController.deleteUserDocumentById
);

export default router;
