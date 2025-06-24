'use client';
import { Box, Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import {
  useLazyGetDocumentQuery,
  useUpdateDocumentMutation,
} from 'api/services/documentApi';
import Loader from 'components/Loader';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { generateTheSummary } from 'utils/generateSummary';

export default function DetailsView() {
  const [refetch, { data, isLoading }] = useLazyGetDocumentQuery();
  const [updateDocument] = useUpdateDocumentMutation();
  const document = data?.data;
  const [generatedSummary, setGeneratedSummary] = useState<string>('');

  const handleGenerateSummary = useCallback(async () => {
    setGeneratedSummary(generateTheSummary());
  }, []);

  const handleSaveSummary = useCallback(async () => {
    if (!generatedSummary) return;
    if (!document) return;
    const data = new FormData();
    data.append('summary', generatedSummary);
    data.append('title', document.title || '');

    await updateDocument({
      id: document.id,
      data,
    }).unwrap();
    await refetch(document.id);
    setGeneratedSummary('');
  }, [document, generatedSummary, refetch, updateDocument]);

  const { id }: { id: string } = useParams();

  useEffect(() => {
    if (id) refetch(Number(id));
  }, [id, refetch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {document && (
        <Box
          bgcolor="white"
          sx={{ padding: '20px' }}
          borderRadius="10px"
          boxShadow="1px 2px 10px rgba(0, 0, 0, 0.1)"
        >
          <Stack
            bgcolor={'white'}
            spacing={2}
            direction="row"
            justifyContent="starts"
            alignContent="center"
          >
            <h2>Document Details</h2>
          </Stack>

          <Stack spacing={2} direction="row" alignContent="center">
            <div style={{ width: '50%' }}>
              {document.title && <p>Title: {document.title}</p>}

              <p>Description: {document.description || 'N/A'}</p>
              <Box>
                <Box sx={{ display: 'flex', gap: '10px' }}>
                  <Button variant="contained" onClick={handleGenerateSummary}>
                    {document.summary ? 'Regenerate ' : 'Generate '}
                    Summary
                  </Button>

                  {generatedSummary && (
                    <Button onClick={handleSaveSummary} variant="contained">
                      Save
                    </Button>
                  )}
                </Box>

                <p>Summary: {generatedSummary || document.summary || 'N/A'}</p>
              </Box>
            </div>
          </Stack>
        </Box>
      )}
    </>
  );
}
