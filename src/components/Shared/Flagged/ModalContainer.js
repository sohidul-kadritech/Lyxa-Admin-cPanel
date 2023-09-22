/* eslint-disable no-unused-vars */
import { Paper, useTheme } from '@mui/material';
import React from 'react';

function ModalContainer({ children }) {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        width: '86vw',
        height: '80vh',
        overflow: 'hidden',
      }}
    >
      {children}
    </Paper>
  );
}

export default ModalContainer;
