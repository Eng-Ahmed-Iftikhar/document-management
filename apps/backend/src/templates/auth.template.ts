export const wellcomeEmailTemplate = (name: string, code: string) => {
  return `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for joining us! We're excited to have you on board.</p>
        <p>Please verify your email address by clicking the link below:</p>
        <p>Verification Code: ${code}</p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br>Your Team</p>
    `;
};

export const resetPasswordEmailTemplate = (resetLink: string) => {
  return `
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, click the link below:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>Your Team</p>
    `;
};

export const emailVerificationTemplate = (
  verificationLink: string,
  code: string
) => {
  return `
        <h1>Email Verification</h1>
        <p>Thank you for registering! Please verify your email address by clicking the link below:</p>
        <p>Verification Code: ${code}</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br>Your Team</p>
    `;
};

export const emailVerificationSuccessTemplate = (email: string) => {
  return `
        <h1>Email Verification Successful</h1>
        <p>Your email address ${email} has been successfully verified.</p>
        <p>Thank you for verifying your email!</p>
        <p>Best regards,<br>Your Team</p>
    `;
};
export const resetPasswordSuccessTemplate = (email: string) => {
  return `
        <h1>Password Reset Successful</h1>
        <p>Your password has been successfully reset for the email address ${email}.</p>
        <p>If you did not request this change, please contact support immediately.</p>
        <p>Best regards,<br>Your Team</p>
    `;
};

export const passwordChangeTemplate = (email: string) => {
  return `
        <h1>Password Change Notification</h1>
        <p>Your password has been successfully changed for the email address ${email}.</p>
        <p>If you did not make this change, please contact support immediately.</p>
        <p>Best regards,<br>Your Team</p>
    `;
};
