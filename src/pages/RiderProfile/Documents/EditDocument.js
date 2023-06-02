/* eslint-disable no-unused-vars */
import { Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useMutation } from 'react-query';
import CloseButton from '../../../components/Common/CloseButton';
import StyledFileDropzone from '../../../components/Styled/StyledFileDropzone';
import { getImageUrl } from '../../../helpers/images';
import { successMsg } from '../../../helpers/successMsg';

export default function EditDocument({ onClose, document, onReplaceDoc, loading }) {
  const [currentFile, setCurrentFile] = useState(document?.url);
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    if (newFiles?.length) {
      setFiles(newFiles);
      setCurrentFile(newFiles[0]?.preview);
    }
  };

  const uploadDoc = useMutation(() => getImageUrl(files[0]), {
    onSuccess: (data) => {
      if (!data) {
        successMsg(data?.message);
        return;
      }

      onReplaceDoc({ ...document, url: data });
    },
    onError: (error) => {
      successMsg(error?.message);
    },
  });

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
          height: '420px',
          borderRadius: '8px',
          border: '1px solid #eee',
          padding: '10px',
          overflow: 'hidden',

          '& > img': {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          },
        }}
      >
        <img src={currentFile} alt="doc" />
      </Box>
      <Stack gap="20px" pt={8.5}>
        <StyledFileDropzone onDrop={onDrop} multiple={false} maxFiles={1} />
        <Button
          variant="contained"
          fullWidth
          disabled={!files.length || uploadDoc.isLoading || loading}
          onClick={() => {
            uploadDoc.mutate();
          }}
        >
          Replace
        </Button>
      </Stack>
    </Box>
  );
}
