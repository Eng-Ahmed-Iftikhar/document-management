'use client';

// material-ui
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';

// project imports
import MainCard from 'components/MainCard';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// types
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { Button, Typography } from '@mui/material';
import {
  useCreateDocumentMutation,
  useLazyGetDocumentQuery,
  useUpdateDocumentMutation,
} from 'api/services/documentApi';
import { openSnackbar } from 'api/snackbar';
import AnimateButton from 'components/@extended/AnimateButton';
import Loader from 'components/Loader';
import { FormikHelpers } from 'formik/dist/types';
import { ChangeEvent, useEffect } from 'react';
import { SnackbarProps } from 'types/snackbar';
import { urlToFile } from 'utils/fileUtils';
import Link from 'next/link';

interface FormProps {
  id?: number;
}

const validationSchema = yup.object({
  title: yup.string().required('Name is required'),
  description: yup.string().optional(),
  summary: yup.string().optional(),
  file: yup.mixed<File>().required('File is required'),
});

type DocumentFormType = yup.InferType<typeof validationSchema>;

const initialValues: DocumentFormType = {
  title: '',
  description: '',
  summary: '',
  file: new File([], ''),
};

export default function Form({ id }: FormProps) {
  const [refetch, { data, isLoading }] = useLazyGetDocumentQuery();
  const [updateDocument] = useUpdateDocumentMutation();
  const [createDocument] = useCreateDocumentMutation();
  const document = data?.data;
  const router = useRouter();

  const onSubmit = async (
    values: DocumentFormType,
    { setFieldError }: FormikHelpers<DocumentFormType>
  ) => {
    let response;

    if (!values.file.name) {
      setFieldError('file', 'File is required');
      return;
    }

    const data = new FormData();
    data.append('title', values.title);
    if (values.description) {
      data.append('description', values.description);
    }
    if (values.summary) {
      data.append('summary', values.summary);
    }

    data.append('file', values.file);

    if (id) {
      if (values.file.name === document?.url) {
        data.delete('file');
      }
      response = await updateDocument({
        data,
        id,
      });
    } else {
      response = await createDocument(data);
    }

    if (response.error as FetchBaseQueryError) {
      console.log('error: ', response.error);

      openSnackbar({
        open: true,
        message: 'Something went wrong!',
        variant: 'alert',
        alert: {
          color: 'error',
        },
      } as SnackbarProps);

      return;
    }

    openSnackbar({
      open: true,
      message: `Document ${id ? 'updated' : 'create'} successfully!`,
      variant: 'alert',
      alert: {
        color: 'success',
      },
    } as SnackbarProps);

    router.push('/documents');
  };

  const {
    setFieldValue,
    errors,
    touched,
    handleBlur,
    handleChange,
    setValues,
    handleSubmit,
    values,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  // on mounted
  useEffect(() => {
    if (document) {
      setValues({
        title: document.title,
        description: document.description || '',
        summary: document.summary || '',
        file: new File([], ''),
      });
      urlToFile(document.url, document.url).then((file) => {
        setFieldValue('file', file);
      });
    }
  }, [document, setFieldValue, setValues]);

  useEffect(() => {
    if (id) refetch(id);
  }, [id, refetch]);

  if (isLoading) return <Loader />;

  return (
    <MainCard>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="title">Title</InputLabel>
              <TextField
                fullWidth
                id="title"
                name="title"
                placeholder="Enter title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="description">Description</InputLabel>
              <TextField
                fullWidth
                id="description"
                name="description"
                placeholder="Enter description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack spacing={1}>
              <InputLabel htmlFor="document">Document</InputLabel>
              <TextField
                fullWidth
                id="document"
                type="file"
                name="file"
                placeholder="Enter document"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFieldValue('file', e.target.files?.[0])
                }
                error={touched.file && Boolean(errors.file)}
                helperText={touched.file && (errors.file as string)}
              />
              {values.file.name && (
                <Link target="_blank" download href={values.file.name}>
                  <Typography>{values.file.name}</Typography>
                </Link>
              )}
            </Stack>
          </Grid>
        </Grid>
        <Grid sx={{ mt: 3 }} size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" justifyContent="flex-end">
            <AnimateButton>
              <Button variant="contained" type="submit">
                {isSubmitting
                  ? 'Submiting...'
                  : id
                  ? 'Update Document'
                  : 'Create Document '}
              </Button>
            </AnimateButton>
          </Stack>
        </Grid>
      </form>
    </MainCard>
  );
}
