/* eslint-disable no-unused-vars */
import { Stack } from '@mui/material';
import React from 'react';
import Header from './Header';
import Rows from './Rows';

function StyledTable5({
  tableSx,
  expandWithRowClick,
  columns,
  rows,
  NoRowsOverlay,
  showHeader = true,
  rowSx,
  rowInnerContainerSx,
  onRowClick,
}) {
  return (
    <Stack sx={{ background: '#fff', paddingBottom: '12px', ...(tableSx || {}) }}>
      {showHeader && <Header columns={columns} />}
      <Rows
        columns={columns}
        rows={rows}
        expandWithRowClick={expandWithRowClick}
        NoRowsOverlay={NoRowsOverlay}
        rowSx={rowSx}
        rowInnerContainerSx={rowInnerContainerSx}
        onRowClick={onRowClick}
      />
    </Stack>
  );
}

export default StyledTable5;
