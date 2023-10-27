/* eslint-disable no-unused-vars */
import { Stack, useTheme } from '@mui/material';
import React from 'react';
import Row from './Row';

function Rows({
  columns,
  rows = [],
  isExpandable = true,
  expandWithRowClick,
  NoRowsOverlay,
  rowSx,
  onRowClick,
  rowInnerContainerSx,
}) {
  const theme = useTheme();

  return (
    <Stack flex={1}>
      {rows?.map((row, index) => (
        <Row
          key={index}
          row={row}
          onRowClick={onRowClick}
          columns={columns}
          expandWithRowClick={expandWithRowClick}
          rowSx={rowSx}
          rowInnerContainerSx={rowInnerContainerSx}
        />
      ))}
      {rows?.length <= 0 && (
        <Stack minHeight={150} justifyContent="center" alignContent="center" alignItems="center">
          {NoRowsOverlay}
        </Stack>
      )}
    </Stack>
  );
}

export default Rows;
