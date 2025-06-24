import env from '../config/env';
import { sendNoReplayEmail } from '../config/nodemailer';
import { authTemplate } from '../templates';

export const sendWelcomeEmail = async (
  name: string,
  email: string,
  code: string
) => {
  const html = authTemplate.wellcomeEmailTemplate(name, code); // Assuming you have a verification link to pass
  const subject = 'Welcome to Our Service! Please Verify Your Email';
  return await sendNoReplayEmail(email, subject, html);
};

export const sendResetPasswordEmail = async (
  email: string,
  resetToken: string
) => {
  const resetLink = env.appUrl + '/reset-password' + '?token=' + resetToken; // Construct the reset password link
  const html = authTemplate.resetPasswordEmailTemplate(resetLink); // Assuming you have a reset password template
  const subject = 'Reset Your Password';
  return await sendNoReplayEmail(email, subject, html);
};
export const sendEmailVerification = async (email: string, code: string) => {
  const verificationLink = env.appUrl + '/verify-email'; // Construct the verification link
  const html = authTemplate.emailVerificationTemplate(verificationLink, code); // Assuming you have a verification link to pass
  const subject = 'Please Verify Your Email Address';
  return await sendNoReplayEmail(email, subject, html);
};
export const sendEmailVerificaionSuccess = async (email: string) => {
  const html = authTemplate.emailVerificationSuccessTemplate(email); // Assuming you have a success template
  const subject = 'Email Verification Successful';
  return await sendNoReplayEmail(email, subject, html);
};

export const sendResetPasswordSuccess = async (email: string) => {
  const html = authTemplate.resetPasswordSuccessTemplate(email); // Assuming you have a success template
  const subject = 'Password Reset Successful';
  return await sendNoReplayEmail(email, subject, html);
};
export const sendPasswordChangeSuccess = async (email: string) => {
  const html = authTemplate.passwordChangeTemplate(email); // Assuming you have a password change notification template
  const subject = 'Password Changed Successful';
  return await sendNoReplayEmail(email, subject, html);
};
