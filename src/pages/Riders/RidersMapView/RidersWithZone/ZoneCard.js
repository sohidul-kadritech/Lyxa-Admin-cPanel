import { Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

export const statusColor = {
  busy: {
    background: '#FFB01733',
    color: '#FFAB09',
  },

  active: {
    background: '#DCFCE7',
    color: '#417C45',
  },
  inactive: {
    background: '#FEE2E2',
    color: '#DD5B63',
  },
};

function ZoneCard({ name, status, number, onClick, polygon }) {
  const theme = useTheme();
  const styleForZoneList = {
    padding: '12px 20px 10px 20px',
    borderLeft: `4px solid transparent`,
    backgroundColor: 'rgba(177, 177, 177, 0.1)',
    cursor: 'pointer',
    '&:hover': {
      borderLeft: `4px solid ${theme.palette.danger.main}`,
      backgroundColor: 'rgba(177, 177, 177, 0.2)',
    },
  };
  return (
    <Stack
      sx={styleForZoneList}
      onClick={() => {
        onClick(polygon);
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" flex={1}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography variant="h6">{name}</Typography>
          <span
            style={{
              padding: '2px 4px',
              borderRadius: '10px',
              background: statusColor[status].background,
              color: statusColor[status].color,
              fontSize: '12px',
            }}
          >
            {status}
          </span>
        </Stack>

        <Typography variant="h6">{number}</Typography>
      </Stack>
    </Stack>
  );
}

export default ZoneCard;
