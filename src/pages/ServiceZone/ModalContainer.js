import { Box, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import CloseButton from '../../components/Common/CloseButton';

// eslint-disable-next-line prettier/prettier, no-unused-vars
function ModalContainer({ onClose, sx, children, title }) {
  const theme = useTheme();
  return (
    <Box sx={sx}>
      <Stack sx={{ height: '100%' }}>
        <Stack flexDirection="row" alignItems="center" alignContent="center">
          <Typography
            flex={1}
            sx={{ fontSize: '20px', fontWeight: 600, lineHeight: '24px', color: theme.palette.text.primary }}
          >
            {title || 'No Title'}
          </Typography>
          <CloseButton
            disableRipples
            onClick={onClose}
            sx={{
              color: theme.palette.text.primary,
              padding: '0px',
            }}
          />
        </Stack>
        <Box sx={{ flex: 1, marginTop: '20px', overflow: 'auto' }}>{children}</Box>
      </Stack>
    </Box>
  );
}

export default ModalContainer;
