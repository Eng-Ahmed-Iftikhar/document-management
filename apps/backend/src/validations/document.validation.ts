import Joi from 'joi';

export const createDocument = Joi.object({
  body: Joi.object({
    title: Joi.string().min(6).max(100).required(),
    description: Joi.string().optional(),
    summary: Joi.string().optional(),
  }),
});

export const updateDocument = Joi.object({
  body: Joi.object({
    title: Joi.string().min(6).max(100).optional(),
    description: Joi.string().optional(),
    summary: Joi.string().optional(),
  }),
  params: Joi.object({
    id: Joi.number().required(),
  }),
});

export const deleteDocument = Joi.object({
  params: Joi.object({
    id: Joi.number().required(),
  }),
});

export const getDocument = Joi.object({
  params: Joi.object({
    id: Joi.number().required(),
  }),
});

export const getDocuments = Joi.object({
  query: Joi.object({
    page: Joi.number().optional(),
    pageSize: Joi.number().optional(),
  }),
});
