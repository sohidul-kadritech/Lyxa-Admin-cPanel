import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';

function CustomerInfo({ title, image, subtitle }) {
  return (
    <Stack direction="row" alignItems="center" gap={2.5}>
      <Avatar src={image} alt="customer_image" sx={{ width: '36px', height: '36px' }}>
        {title?.charAt(0)?.toUpperCase()}
      </Avatar>
      <Stack>
        {title && (
          <Typography variant="h5" sx={{ fontSize: '15px', fontWeight: 400, lineHeight: '18.15px' }}>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="h5" sx={{ fontSize: '15px', fontWeight: 600, lineHeight: '18.15px' }}>
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}

export default CustomerInfo;
