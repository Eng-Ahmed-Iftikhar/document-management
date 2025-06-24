import joi from 'joi';
import * as dotenv from 'dotenv';

const envPath =
  process.env.NODE_ENV === 'production'
    ? 'apps/backend/.env.production'
    : 'apps/backend/.env.development';
dotenv.config({
  path: envPath,
});

const envSchema = joi.object({
  PORT: joi.number().default(3000),
  NODE_ENV: joi
    .string()
    .default('development')
    .valid('production', 'development'),
  DATABASE_URL: joi.string().required(),
  ACCESS_JWT_SECRET: joi.string().required(),
  ACCESS_JWT_EXPIRATION: joi
    .number()
    .default(3600) // Default to 1 hour
    .min(60) // Minimum 1 minute
    .max(86400), // Maximum 24 hours
  REFRESH_JWT_SECRET: joi.string().required(),
  REFRESH_JWT_EXPIRATION: joi.number().default(604800).min(60).max(2592000), // Default to 7 days, min 1 minute, max 30 days
  RESET_PASSWORD_JWT_SECRET: joi.string().required(),
  RESET_PASSWORD_JWT_EXPIRATION: joi
    .number()
    .default(3600) // Default to 1 hour
    .min(60) // Minimum 1 minute
    .max(86400), // Maximum 24 hours

  EMAIL_VERIFICATION_JWT_SECRET: joi.string().required(),
  EMAIL_VERIFICATION_JWT_EXPIRATION: joi
    .number()
    .default(86400) // Default to 24 hours
    .min(60) // Minimum 1 minute
    .max(2592000), // Maximum 30 days,
  SMTP_HOST: joi.string().required(),
  SMTP_PORT: joi.number().default(587).min(1).max(65535),
  SMTP_USER: joi.string().required(),
  SMTP_PASSWORD: joi.string().required(),

  APP_URL: joi.string().uri().required(),
  SUPABASE_BUCKET_NAME: joi.string().required(),
  SUPABASE_KEY: joi.string().required(),
  SUPABASE_URL: joi.string().uri().required(),
});

// Validate the loaded environment variables
const { error, value } = envSchema.validate(process.env, {
  allowUnknown: true,
  abortEarly: false,
});

if (error) {
  console.error('Environment variable validation error:', error.details);
  process.exit(1); // Exit the application if validation fails
}
export default {
  port: value.PORT,
  nodeEnv: value.NODE_ENV,
  databaseUrl: value.DATABASE_URL,
  jwt: {
    accessToken: {
      secret: value.ACCESS_JWT_SECRET,
      expiration: value.ACCESS_JWT_EXPIRATION,
    },
    refreshToken: {
      secret: value.REFRESH_JWT_SECRET,
      expiration: value.REFRESH_JWT_EXPIRATION,
    },
    resetPassword: {
      secret: value.RESET_PASSWORD_JWT_SECRET,
      expiration: value.RESET_PASSWORD_JWT_EXPIRATION,
    },
    emailVerification: {
      secret: value.EMAIL_VERIFICATION_JWT_SECRET,
      expiration: value.EMAIL_VERIFICATION_JWT_EXPIRATION,
    },
  },

  smtp: {
    host: value.SMTP_HOST,
    port: value.SMTP_PORT,
    user: value.SMTP_USER,
    pass: value.SMTP_PASSWORD,
  },
  appUrl: value.APP_URL,
  supabase: {
    bucketName: value.SUPABASE_BUCKET_NAME,
    key: value.SUPABASE_KEY,
    url: value.SUPABASE_URL,
  },
};
