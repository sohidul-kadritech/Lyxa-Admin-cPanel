/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import CloseButton from '../../../components/Common/CloseButton';
import StyledFileDropzone from '../../../components/Styled/StyledFileDropzone';

export default function EditDocument({ onClose, document }) {
  const [currentFile, setCurrentFile] = useState(document?.url);
  const [files, setFiles] = useState([]);

  return (
    <Box
      sx={{
        padding: '12px 16px 16px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        minWidth: 'min(800px, 90vw)',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" pb={4}>
        <Typography variant="h6">Edit Document</Typography>
        <CloseButton size="sm" onClick={onClose} />
      </Stack>
      <Box
        sx={{
          width: '100%',
          height: '300px',
          borderRadius: '8px',
          overflow: 'hidden',

          '& > img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          },
        }}
      >
        <img src={currentFile} alt="doc" />
      </Box>
      <Stack gap="20px" pt={8.5}>
        <StyledFileDropzone />
        <Button variant="contained" fullWidth>
          Upload
        </Button>
      </Stack>
    </Box>
  );
}
