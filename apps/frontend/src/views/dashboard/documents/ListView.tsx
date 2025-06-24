'use client';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

import { Button, Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import { ColumnDef } from '@tanstack/react-table';
import {
  useLazyGetDocumentsQuery,
  useDeleteDocumentMutation,
} from 'api/services/documentApi';
import AnimateButton from 'components/@extended/AnimateButton';
import SSDataTable from 'components/SSDataTable';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Document } from 'types/api/document';
import ConfirmationDialog from 'components/ConfirmationDialog';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';

export default function ListView() {
  const [getFilteredData, { data: rawData }] = useLazyGetDocumentsQuery();
  const [deleteDocument] = useDeleteDocumentMutation();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const {
    data: documents = [],
    totalPages = 0,
    page = 1,
    pageSize = 10,
  } = rawData || {};
  const [documentId, setDocumentId] = useState<number>(0);
  const router = useRouter();

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleOnView = useCallback(
    (item: Document) => {
      router.push(`/documents/${item.id}`);
    },
    [router]
  );

  const handleOnDelete = useCallback((item: Document) => {
    setDocumentId(item.id);
  }, []);

  const handleOnEdit = useCallback(
    (item: Document) => {
      router.push(`/documents/${item.id}/edit`);
    },
    [router]
  );

  const columns = useMemo<ColumnDef<Document>[]>(() => {
    return [
      {
        header: 'Title',
        accessorKey: 'title',
      },
      {
        header: 'Description',
        accessorKey: 'description',
        enableColumnFilter: false,
        cell({ renderValue }) {
          return renderValue() || 'N/A';
        },
      },
      {
        header: 'Summary',
        accessorKey: 'summary',
        enableColumnFilter: false,
        cell({ renderValue }) {
          return renderValue() || 'N/A';
        },
      },

      {
        header: 'Action',
        accessorKey: 'action',
        cell: (props) => {
          return (
            <Stack
              spacing={2}
              direction="row"
              justifyContent="center"
              alignContent="center"
            >
              <EyeOutlined
                size={20}
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() => handleOnView(props.row.original)}
              />

              <EditOutlined
                size={20}
                style={{ cursor: 'pointer', color: 'green' }}
                onClick={() => handleOnEdit(props.row.original)}
              />

              <DeleteOutlined
                size={20}
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={() => handleOnDelete(props.row.original)}
              />
            </Stack>
          );
        },
        enableColumnFilter: false,
      },
    ] as ColumnDef<Document>[];
  }, [handleOnDelete, handleOnEdit, handleOnView]);

  const fetchData = useCallback(
    async ({ page, pageSize }: { page: number; pageSize: number }) => {
      // Create a new AbortController for the current request
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const response = await getFilteredData({
        page: page + 1,
        pageSize,
      }).unwrap();

      return {
        rows: response.data || [],
        totalRows: response.totalPages * pageSize, // Or use the total row count if directly available
      };
    },
    [getFilteredData]
  );

  const handleDeleteConfirmation = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteDocument(documentId).unwrap();
      await getFilteredData({
        page,
        pageSize,
      }).unwrap();
      setDocumentId(0);
      openSnackbar({
        open: true,
        message: 'Document deleted successfully.',
        variant: 'alert',
        alert: {
          color: 'success',
        },
      } as SnackbarProps);
    } catch (error) {
      openSnackbar({
        open: true,
        message: "Document couldn't be deleted.",
        variant: 'alert',
        alert: {
          color: 'error',
        },
      } as SnackbarProps);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteDocument, documentId, getFilteredData, page, pageSize]);

  return (
    <>
      <Grid size={{ xs: 12 }} sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="flex-end">
          <AnimateButton>
            <Button
              variant="contained"
              type="button"
              href={'/documents/create'}
            >
              Add Documents
            </Button>
          </AnimateButton>
        </Stack>
      </Grid>

      <SSDataTable
        abortControllerRef={abortControllerRef}
        columns={columns}
        initialData={documents as Document[]}
        fetchData={fetchData}
        totalPages={totalPages}
      />
      <ConfirmationDialog
        open={Boolean(documentId)}
        title="Delete Document"
        message="Are you sure you want to delete this document?"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
        confirmationBtnColor="error"
        onClose={() => setDocumentId(0)}
        onConfirm={handleDeleteConfirmation}
        loading={isDeleting}
        onCancel={() => setDocumentId(0)}
      />
    </>
  );
}
