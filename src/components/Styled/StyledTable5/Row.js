/* eslint-disable no-unused-vars */
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { AccordionDetails, Box, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';

function Row({ row, columns, isExpandable = true, expandWithRowClick, rowSx, rowInnerContainerSx, onRowClick }) {
  const theme = useTheme();

  const [isExpanded, setIsExpanded] = useState(false);

  const [expandedComponents, setExpandedComponents] = useState(<Typography>Hello</Typography>);

  const Icon = isExpanded ? ExpandLess : ExpandMore;

  const onExpandHandler = (expandedComponents) => {
    setIsExpanded((prev) => !prev);
    setExpandedComponents(expandedComponents);
  };

  const dropdownProps = {
    position: 'relative',
    borderBottomLeftRadius: '7px',
    borderLeft: `1px solid ${theme.palette.custom.border}`,
    borderBottom: `1px solid ${theme.palette.custom.border}`,
    width: '100%',
    transition: 'all 0.3s linear',
    zIndex: 99,
  };

  return (
    <Box
      sx={{ borderBottom: `1px dashed ${theme.palette.custom.border}`, cursor: 'pointer', ...(rowSx || {}) }}
      onClick={() => {
        if (onRowClick) onRowClick({ row });
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{ padding: '12px 0px', ...(rowInnerContainerSx || {}) }}
        onClick={(e) => {
          if (expandWithRowClick) {
            onExpandHandler(expandWithRowClick(row));
          }
        }}
      >
        {columns?.map((column, index) => (
          <Stack
            direction="row"
            flex={column?.flex || 1}
            key={index}
            textAlign={column?.align}
            justifyContent={
              column?.align === 'right' ? 'flex-end' : column?.align === 'center' ? 'center' : 'flex-start'
            }
            sx={{ minWidth: column?.minWidth || 60 }}
            onClick={({ value, row }) => {
              if (column?.expandWithCellClick) {
                onExpandHandler(column?.expandWithCellClick({ value, row }));
              }
            }}
          >
            {typeof column?.renderCell === 'object'
              ? column?.renderCell
              : typeof column?.renderCell === 'function'
              ? column?.renderCell({ row, value: row[column?.field] || '', onExpandHandler })
              : column?.renderCell}
          </Stack>
        ))}
      </Stack>

      <AccordionDetails
        sx={
          isExpanded
            ? { ...dropdownProps, opacity: 1, padding: '8px 0px 8px 8px' }
            : {
                ...dropdownProps,
                opacity: 0,
                height: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                '&.MuiAccordionDetails-root': {
                  padding: '0px',
                },
              }
        }
      >
        {expandedComponents}
      </AccordionDetails>
    </Box>
  );
}

export default Row;
