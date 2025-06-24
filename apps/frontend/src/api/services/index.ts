import { Middleware, Reducer } from '@reduxjs/toolkit';

// project imports
import { documentApi } from './documentApi';

export const apiMiddlewares: Middleware[] = [documentApi.middleware];

export const apiReducers: Record<string, Reducer> = {
  [documentApi.reducerPath]: documentApi.reducer,
};
