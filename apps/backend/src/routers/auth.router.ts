import { Router } from 'express';
import { authController } from '../controllers';
import { authValidation } from '../validations';
import dataValidator from '../middlewares/data-validator';
import passport from 'passport';
const router = Router();

router.post(
  '/register',
  dataValidator(authValidation.register),
  authController.registerUser
);
router.post(
  '/login',
  dataValidator(authValidation.login),
  authController.loginUser
);
router.post(
  '/refresh-token',
  dataValidator(authValidation.refreshToken),
  authController.refreshToken
);
router.post(
  '/forgot-password',
  dataValidator(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  '/reset-password',
  dataValidator(authValidation.resetPassword),
  authController.resetPassword
);
router.post(
  '/change-password',
  passport.authenticate('bearer', { session: false }),
  dataValidator(authValidation.changePassword),
  authController.changePassword
);
router.post(
  '/verify-email',
  passport.authenticate('bearer', { session: false }),
  dataValidator(authValidation.verifyEmail),
  authController.verifyEmail
);
router.post(
  '/send-verification-email',
  passport.authenticate('bearer', { session: false }),
  dataValidator(authValidation.resendVerificationEmail),
  authController.resendVerificationEmail
);
router.get(
  '/logout',
  passport.authenticate('bearer', { session: false }),
  authController.logoutUser
);
router.get(
  '/me',
  passport.authenticate('bearer', { session: false }),
  authController.currentUser
);

export default router;
