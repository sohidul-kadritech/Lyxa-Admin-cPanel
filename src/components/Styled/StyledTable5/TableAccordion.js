/* eslint-disable no-unused-vars */
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import React, { useRef, useState } from 'react';

import { AccordionDetails, Box, Stack, Typography, useTheme } from '@mui/material';

function TableAccordion({ sx, expandIconGap, summarySx, isDropdow = true, renderRow, children, ...props }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef();
  const theme = useTheme();
  const dropdownProps = {
    position: 'relative',
    top: '0px',
    left: '-15px',
    borderRadius: '7px',
    border: `1px solid ${theme.palette.custom.border}`,
    width: '100%',

    zIndex: 99,
    transition: 'all 0.5s ease-in-out',
  };

  const Icon = dropdownOpen ? ExpandLess : ExpandMore;
  return (
    <Stack
      sx={{ position: 'relative', cursor: 'pointer' }}
      onClick={() => {
        setDropdownOpen((prev) => !prev);
      }}
    >
      {renderRow}

      {isDropdow && (
        <Box sx={dropdownOpen ? { ...dropdownProps, height: '100%' } : { ...dropdownProps, height: '0px' }}>
          <AccordionDetails
            sx={{
              padding: '12px 0px 12px 16px',
              background: 'red',
            }}
          >
            <Typography>hello</Typography>
          </AccordionDetails>
        </Box>
      )}
    </Stack>
  );
}

export default TableAccordion;
