import { Modal, Paper } from '@mui/material';
import React from 'react';

export default function MSettingsModal({ children, open }) {
  return (
    <Modal
      open={open}
      sx={{
        minHeight: '0',
        maxHeight: '90%',
        top: '5%',
      }}
    >
      <Paper
        sx={{
          maxWidth: 'calc(100vw - 100px)',
          width: 'min(calc(100vw - 100px), 1500px)',
          position: 'relative',
          borderRadius: '10px',
          height: '100%',
        }}
      >
        {children}
      </Paper>
    </Modal>
  );
}
