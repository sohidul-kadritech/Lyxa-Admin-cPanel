import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

/*

 field: 'account',
    flex: 1.5,
    sortable: false,
    minWidth: 240,
    headerAlign: 

    
*/

function Header({ columns = [] }) {
  const theme = useTheme();
  return (
    <Stack direction="row" sx={{ borderBottom: `1px dashed ${theme.palette.custom.border}`, padding: '12px 0px' }}>
      {columns?.map((column, index) => (
        <Stack flex={column?.flex || 1} key={index} sx={{ minWidth: column?.minWidth }}>
          {!column?.headerComponent ? (
            <Typography
              sx={{
                textAlign: column?.headerAlign,
                color: '#737373',
                fontWeight: '600',
                fontSize: '14px !important',
                letterSpacing: '0.03em',
                overflow: 'hidden',
                textWrap: 'nowrap',
                textOverflow: 'ellipsis',
                ...(column?.headerSx || {}),
              }}
            >
              {column?.headerName}
            </Typography>
          ) : (
            column?.headerComponent
          )}
        </Stack>
      ))}
    </Stack>
  );
}

export default Header;
