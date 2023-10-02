import { Box } from '@mui/material';
import React from 'react';

function ClickableAddress({ latitude, longitude, children, sx, target, url }) {
  const redirectTo = () => {
    const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    console.log('map url', mapUrl);
    window.open(url || mapUrl, !target ? '_blank' : target);
  };

  return (
    <Box sx={{ cursor: 'pointer', ...(sx || {}) }} onClick={redirectTo}>
      {children}
    </Box>
  );
}

export default ClickableAddress;
