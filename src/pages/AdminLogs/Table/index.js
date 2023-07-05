import { Box, Stack, useTheme } from '@mui/material';
import React from 'react';
import TablePagination from '../../../components/Common/TablePagination';
import StyledTable from '../../../components/Styled/StyledTable3';
import { useGlobalContext } from '../../../context';
import { allColumns, getValue } from './helpers';

function AdminLogsTable({ data, loading, queryParams, setQueryParams, secondaryCurrency, totalPage }) {
  const theme = useTheme();

  const { general } = useGlobalContext();

  const { currency } = general;

  return (
    <>
      <Box
        sx={{
          maxHeight: '480px',
          overflow: 'auto',
          position: 'relative',
          border: `1px solid ${theme.palette.custom.border}`,
          borderRadius: '7px',
          top: 0,
        }}
      >
        <Box
          sx={{
            padding: '7.5px 16px  2px',
          }}
        >
          <StyledTable
            columns={allColumns(getValue, currency, secondaryCurrency)}
            rows={data || []}
            getRowId={(row) => row?._id}
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                position: 'sticky',
                top: '-2px',
                backgroundColor: theme?.palette?.primary?.contrastText,
                zIndex: theme.zIndex.mobileStepper - 1,
              },
              '& .MuiDataGrid-virtualScroller': {
                marginTop: '0 !important',
              },
              '& .MuiDataGrid-main': {
                overflow: 'visible',
              },
              '& .MuiDataGrid-cell': {
                cursor: 'default',
              },
            }}
            components={{
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  {loading ? 'Loading...' : 'No Logs Found'}
                </Stack>
              ),
            }}
          />
        </Box>
      </Box>
      <TablePagination
        currentPage={queryParams?.page}
        lisener={(page) => {
          setQueryParams((prev) => ({ ...prev, page }));
        }}
        totalPage={totalPage}
      />
    </>
  );
}

export default AdminLogsTable;
