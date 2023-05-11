import { Pagination, Stack } from '@mui/material';
import React from 'react';

function TableDataPagination({ currentPage, lisener, totalPage }) {
  // console.log('page: ', currentPage, lisener, totalPage);
  return (
    <Stack direction="row" justifyContent="end" sx={{ marginTop: '20px' }}>
      <Pagination
        // color="primary"
        count={totalPage || 1}
        page={currentPage}
        onChange={(event, value) => {
          lisener(value);
        }}
        // size='small'
        shape="circular"
        siblingCount={0}
        showFirstButton
        showLastButton
        variant="outlined"
      />
    </Stack>
  );
}

export default TableDataPagination;
