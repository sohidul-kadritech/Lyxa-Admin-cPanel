import { Modal, Paper } from '@mui/material';
import React from 'react';

export default function MSettingsModal({ children, open }) {
  return (
    <Modal
      open={open}
      sx={{
        minHeight: '0',
        maxHeight: {
          lg: '90%',
          md: '95%',
        },
        top: {
          lg: '5%',
          md: '2.5%',
        },
        zIndex: 999,
      }}
    >
      <Paper
        sx={{
          maxWidth: {
            lg: 'calc(100vw - 100px)',
            md: 'calc(100vw - 50px)',
          },
          width: {
            lg: 'min(calc(100vw - 100px), 1500px)',
            md: 'min(calc(100vw - 50px), 1500px)',
          },
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
