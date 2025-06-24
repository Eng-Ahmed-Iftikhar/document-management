import Joi from 'joi';

export const register = Joi.object({
  body: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(100).required(),
    email: Joi.string().email().required(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
  }),
});

export const login = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
  }),
});

export const forgotPassword = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
});

export const resetPassword = Joi.object({
  body: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).max(100).required(),
  }),
});

export const changePassword = Joi.object({
  body: Joi.object({
    currentPassword: Joi.string().min(6).max(100).required(),
    newPassword: Joi.string().min(6).max(100).required(),
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
  }),
}).messages({
  'any.only': 'New passwords do not match',
});

export const verifyEmail = Joi.object({
  body: Joi.object({
    code: Joi.string().required(),
  }),
});

export const resendVerificationEmail = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
});

export const refreshToken = Joi.object({
  body: Joi.object({
    access_token: Joi.string().required(),
  }),
});
