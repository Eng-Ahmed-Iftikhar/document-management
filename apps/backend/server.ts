import express from 'express';
import app from './src/app';
import env from './src/config/env';
import { logger } from './src/utils/logger';
import { errorHandler } from './src/middlewares/error-handler';
import { bearerStrategy } from './src/config/passport';
import passport from 'passport';
import morgan from 'morgan';
import cors from 'cors';

const server = express();
server.use(morgan('tiny'));
server.use(express.json());

passport.use(bearerStrategy);
server.use(passport.initialize());
server.use(cors());
server.use('/api/v1', app);

server.listen(env.port, () => {
  logger.info(
    'Server is running on ' + env.port + ' at ' + env.nodeEnv + ' environment'
  );
});

server.use(errorHandler.handleError);

// get the unhandled rejection and throw it to another fallback handler we already have.
process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  errorHandler.handleError(error);
  if (!errorHandler.isTrustedError(error)) {
    process.exit(1);
  }
});
