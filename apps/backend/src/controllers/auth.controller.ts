import env from '../config/env';
import {
  PasswordsDoNotMatchError,
  UserAlreadyExistsError,
  UserIsVerifiedError,
  UserNotActiveError,
} from '../errors/auth.error';
import { NotFoundError } from '../errors/common.error';
import asyncHandler from '../middlewares/aysnc-handler';
import {
  authService,
  codeService,
  emailService,
  profileService,
  tokenService,
  userService,
} from '../services';
import { generateSecureCode } from '../utils/helpers';

export const registerUser = asyncHandler(async (req, res) => {
  let user = await userService.getUserByEmail(req.body.email);
  if (user && !user.is_active) {
    throw new UserAlreadyExistsError('User already exists with this email');
  }
  const password = await authService.hashedPassword(req.body.password);
  req.body.password = password;
  user = await userService.createUser(req.body);

  const profile = await profileService.createProfile({
    user_id: user.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  });

  const accessToken = await tokenService.createToken(
    { userId: user.id, email: user.email },
    env.jwt.accessToken.secret,
    env.jwt.accessToken.expiration
  );

  const refreshToken = await tokenService.createToken(
    { userId: user.id, email: user.email },
    env.jwt.refreshToken.secret,
    env.jwt.refreshToken.expiration
  );

  await tokenService.saveToken({
    user_id: user.id,
    token: refreshToken,
    type: 'refresh',
    expires_at: new Date(Date.now() + env.jwt.refreshToken.expiration * 1000), // Convert seconds to milliseconds
  });

  const codeResponse = await codeService.createCode({
    user_id: user.id,
    code: generateSecureCode(),
    type: 'email_verification',
    expires_at: new Date(
      Date.now() + env.jwt.emailVerification.expiration * 1000
    ),
  });

  await emailService.sendWelcomeEmail(
    profile.first_name + ' ' + profile.last_name,
    user.email,
    codeResponse.code
  );

  res.status(201).json({
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        profile,
      },
      accessToken,
      expireIn: new Date(Date.now() + env.jwt.accessToken.expiration * 1000),
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new NotFoundError('User not found with this email');
  }

  if (!user.is_active) {
    throw new UserNotActiveError('User is not active');
  }

  const isPasswordValid = await authService.comparePassword(
    password,
    user.password
  );
  if (!isPasswordValid) {
    throw new PasswordsDoNotMatchError('Passwords do not match');
  }

  const accessToken = await tokenService.createToken(
    { userId: user.id, email: user.email },
    env.jwt.accessToken.secret,
    env.jwt.accessToken.expiration
  );

  let refreshToken = (await tokenService.getTokenByUserId(user.id, 'refresh'))
    ?.token;

  if (!refreshToken) {
    refreshToken = await tokenService.createToken(
      { userId: user.id, email: user.email },
      env.jwt.refreshToken.secret,
      env.jwt.refreshToken.expiration
    );

    await tokenService.saveToken({
      user_id: user.id,
      token: refreshToken,
      access_token: accessToken,
      type: 'refresh',
      expires_at: new Date(Date.now() + env.jwt.refreshToken.expiration * 1000), // Convert seconds to milliseconds
    });
  } else {
    await tokenService.updateTokenByUserId(user.id, 'refresh', {
      access_token: accessToken,
    });
  }

  const profile = await profileService.getProfileByUserId(user.id);

  res.status(200).json({
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        profile,
      },
      accessToken,
      expireIn: new Date(Date.now() + env.jwt.accessToken.expiration * 1000),
    },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user as number; // Assuming user ID is available in req.user
  await tokenService.deleteTokenByUserId(userId, 'refresh');
  res.status(200).json({ message: 'Logout successful' });
});

export const currentUser = asyncHandler(async (req, res) => {
  const userId = req.user as number; // Assuming user ID is available in req.user
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (!user.is_active) {
    throw new UserNotActiveError('User is not active');
  }

  const profile = await profileService.getProfileByUserId(userId);

  res.status(200).json({
    message: 'Current user retrieved successfully',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        profile,
      },
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const access_token = req.body.access_token as string;

  const tokenData = await tokenService.getTokenByAccessToken(access_token);
  if (!tokenData) {
    throw new NotFoundError('Access token not found');
  }
  const isExpired = await tokenService.isTokenExpired(tokenData.token);

  if (isExpired) {
    await tokenService.updateTokenById(tokenData.id, {
      status: 'expired',
      expires_at: new Date(Date.now() + env.jwt.accessToken.expiration * 1000), // Convert seconds to milliseconds
    });
    throw new NotFoundError('Refresh token has expired');
  }

  const user = await userService.getUserById(tokenData.user_id as number);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const accessToken = await tokenService.createToken(
    { userId: user.id, email: user.email },
    env.jwt.accessToken.secret,
    env.jwt.accessToken.expiration
  );

  await tokenService.updateTokenById(tokenData.id, {
    access_token: accessToken,
  });

  res.status(200).json({
    message: 'Access token refreshed successfully',
    data: { accessToken },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new NotFoundError('User not found with this email');
  }
  const resetToken = await tokenService.createToken(
    { userId: user.id, email: user.email },
    env.jwt.resetPassword.secret,
    env.jwt.resetPassword.expiration
  );

  await emailService.sendResetPasswordEmail(user.email, resetToken);

  // Send resetToken to user's email (not implemented here)
  res.status(200).json({
    message: 'Password reset token generated successfully',
    data: { resetToken },
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const isExpired = await tokenService.isTokenExpired(token);

  if (isExpired) {
    throw new NotFoundError('Reset token has expired');
  }
  const tokenData = (await tokenService.decodeToken(token)) as {
    userId: number;
    email: string;
  };

  const hashedPassword = await authService.hashedPassword(password);
  await userService.updateUser(tokenData?.userId, { password: hashedPassword });

  await emailService.sendResetPasswordSuccess(tokenData.email);
  res.status(200).json({
    message: 'Password reset successfully',
    data: { userId: tokenData.userId },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user as number; // Assuming user ID is available in req.user
  const { oldPassword, newPassword } = req.body;

  const user = await userService.getUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isOldPasswordValid = await authService.comparePassword(
    oldPassword,
    user.password
  );
  if (!isOldPasswordValid) {
    throw new PasswordsDoNotMatchError('Old password is incorrect');
  }

  const hashedNewPassword = await authService.hashedPassword(newPassword);
  await userService.updateUser(user.id, { password: hashedNewPassword });
  await emailService.sendPasswordChangeSuccess(user.email);
  res.status(200).json({
    message: 'Password changed successfully',
    data: { userId: user.id },
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const codeData = await codeService.getCodeByCode(code);
  if (!codeData) {
    throw new NotFoundError('Verification code not found');
  }

  const isExpired = await codeService.isCodeExpired(code);
  if (isExpired) {
    throw new NotFoundError('Verification code has expired');
  }

  const user = await userService.getUserById(req.user as number); // Assuming user ID is available in req.user
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Mark the user's email as verified
  await userService.updateUser(user.id, { is_verified: true });

  await codeService.updateCode(codeData.id, { status: 'used' });

  await emailService.sendEmailVerificaionSuccess(user.email);
  res.status(200).json({
    message: 'Email verified successfully',
    data: { userId: user.id },
  });
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new NotFoundError('User not found with this email');
  }
  if (user.is_verified) {
    throw new UserIsVerifiedError('User email is already verified');
  }

  const codeResponse = await codeService.createCode({
    user_id: user.id,
    code: generateSecureCode(),
    type: 'email_verification',
    expires_at: new Date(
      Date.now() + env.jwt.emailVerification.expiration * 1000
    ),
  });

  await emailService.sendEmailVerification(user.email, codeResponse.code);

  res.status(200).json({
    message: 'Verification email sent successfully',
  });
});
