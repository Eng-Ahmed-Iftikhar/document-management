import asyncHandler from '../middlewares/aysnc-handler';
import { documentService } from '../services';
import { BadRequestError } from '../errors/common.error';
import { File } from '../types/document';

export const createUserDocument = asyncHandler(async (req, res) => {
  const userId = req.user as number;
  const file = req.file as File;

  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }
  const fileUrl = await documentService.uploadDocument(file);

  req.body.url = fileUrl;
  req.body.user_id = userId;

  const document = await documentService.createDocument(req.body);

  res.status(201).json({
    message: 'Document created successfully',
    data: { document },
  });
});

export const getUserDocuments = asyncHandler(async (req, res) => {
  const userId = req.user as number;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;

  const documents = await documentService.getPaginatedUserDocuments(
    page,
    pageSize,
    userId
  );

  const totalPages = await documentService.getDocumentsCountByUserId(userId);

  res.status(200).json({
    message: 'Documents fetched successfully',
    data: documents,
    page,
    pageSize,
    totalPages,
  });
});

export const getUserDocumentById = asyncHandler(async (req, res) => {
  const userId = req.user as number;
  const documentId = Number(req.params.id);
  const document = await documentService.getUserDocumentById(
    documentId,
    userId
  );
  res.status(200).json({
    message: 'Document fetched successfully',
    data: document,
  });
});

export const updateUserDocumentById = asyncHandler(async (req, res) => {
  const userId = req.user as number;
  const documentId = Number(req.params.id);
  const file = req.file as File;
  console.log({ file });

  if (file) {
    const fileUrl = await documentService.uploadDocument(file);
    req.body.url = fileUrl;
  }

  const document = await documentService.updateUserDocumentById(
    userId,
    documentId,
    req.body
  );
  res.status(200).json({
    message: 'Document updated successfully',
    data: { document },
  });
});

export const deleteUserDocumentById = asyncHandler(async (req, res) => {
  const userId = req.user as number;
  const documentId = Number(req.params.id);
  const document = await documentService.deleteUserDocumentById(
    documentId,
    userId
  );
  res.status(200).json({
    message: 'Document deleted successfully',
    data: { document },
  });
});
