import { createApi } from '@reduxjs/toolkit/query/react';
import { Document, GetDocumentsResponse } from 'types/api/document';
import API_ROUTES from '../routes';
import { baseQueryWithReAuth } from './baseApi';

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // post document
    createDocument: builder.mutation<Document, FormData>({
      query: (body) => ({
        url: API_ROUTES.document.post,
        method: 'POST',
        body,
      }),
    }),

    // get all documents
    getDocuments: builder.query<
      GetDocumentsResponse,
      {
        page: number;
        pageSize: number;
      }
    >({
      query: ({ page, pageSize }) =>
        API_ROUTES.document.list
          .replace(':page', String(page))
          .replace(':pageSize', String(pageSize)),
    }),

    // get document by id
    getDocument: builder.query<{ data: Document }, number>({
      query: (id) => API_ROUTES.document.get.replace(':id', id.toString()),
    }),

    // update document
    updateDocument: builder.mutation<Document, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: API_ROUTES.document.update.replace(':id', id.toString()),
        method: 'PATCH',
        body: data,
      }),
    }),

    // delete document
    deleteDocument: builder.mutation<Document, number>({
      query: (id) => ({
        url: API_ROUTES.document.delete.replace(':id', id.toString()),
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useLazyGetDocumentsQuery,
  useLazyGetDocumentQuery,
} = documentApi;
