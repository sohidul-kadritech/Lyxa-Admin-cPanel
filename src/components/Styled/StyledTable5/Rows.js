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
  rowInnerContainerSx,
}) {
  const theme = useTheme();

  return (
    <Stack>
      {rows?.map((row, index) => (
        <Row
          key={index}
          row={row}
          columns={columns}
          expandWithRowClick={expandWithRowClick}
          rowSx={rowSx}
          rowInnerContainerSx={rowInnerContainerSx}
        />
      ))}
      {rows?.length <= 0 && NoRowsOverlay}
    </Stack>
  );
}

export default Rows;
