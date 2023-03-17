import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';

const StyledGrid2 = styled(DataGrid)(({ theme }) => ({
  border: 0,
  color: theme.palette.mode === 'light' ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,0.85)',
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',
  '& .MuiDataGrid-main': {
    border: `1px solid ${theme.palette.custom.border}`,
    borderRadius: '7px',
  },
  '& .MuiDataGrid-columnHeaders': {
    borderBottom: `2px solid ${theme.palette.grey[200]}`,
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    [theme.breakpoints.up('xl')]: {
      fontSize: '18px',
      fontWeight: 600,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '16px',
      fontWeight: 600,
    },
  },
  '& .MuiDataGrid-footerContainer': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell': {
    fontSize: '17px',
    borderBottom: `0px`,

    '&:focus-within': {
      outline: 'none',
    },
  },
}));

export default function StyledTable({ ...props }) {
  return (
    <StyledGrid2
      density="comfortable"
      autoHeight
      disableColumnMenu
      disableSelectionOnClick
      hideFooterPagination
      {...props}
    />
  );
}
