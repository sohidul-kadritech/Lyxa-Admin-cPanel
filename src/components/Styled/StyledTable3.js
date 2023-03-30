import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';

const StyledGrid3 = styled(DataGrid)(({ theme }) => ({
  border: `0px`,
  borderRadius: '7px',
  WebkitFontSmoothing: 'auto',
  letterSpacing: 'normal',

  '& .MuiDataGrid-columnHeaders': {
    borderBottom: `1px dashed ${theme.palette.custom.border}`,
  },

  '& .MuiDataGrid-columnHeader': {
    padding: '0 24px',

    '&:focus-within': {
      outline: 'none',
    },
  },

  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },

  '& .MuiDataGrid-columnHeaderTitle': {
    [theme.breakpoints.up('lg')]: {
      fontWeight: '600',
      fontSize: '14px',
      lineHeight: '17px',
      letterSpacing: '0.03em',
      color: theme.palette.text.secondary2,
    },

    color: theme.palette.text.heading,
  },

  '& .MuiDataGrid-footerContainer': {
    display: 'none',
  },

  '& .MuiDataGrid-row:hover': {
    backgroundColor: 'transparent!important',
  },

  '& .MuiDataGrid-cell': {
    fontSize: '17px',
    borderBottom: `1px dashed ${theme.palette.custom.border}`,
    padding: '0px 24px',

    '&:focus-within': {
      outline: 'none',
    },
  },
}));

export default function StyledTable({ ...props }) {
  return (
    <StyledGrid3
      density="standard"
      headerHeight={48}
      autoHeight
      disableColumnMenu
      disableSelectionOnClick
      hideFooterPagination
      {...props}
    />
  );
}
