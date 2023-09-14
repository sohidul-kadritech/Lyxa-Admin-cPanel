import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import StyledBox from './StyledBox';

const checkIsExpandedOrNot = (expandedIndex, dropdownOpen) =>
  expandedIndex !== undefined ? expandedIndex : dropdownOpen;

const dropdownProps = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  minHeight: '100%',
  zIndex: 99,
};

export default function InfoCard({
  value,
  title,
  Tag,
  isDropdown,
  children,
  valueSx,
  titleSx,
  valueContainerSx,
  valueComponent,
  index = -1,
  expandedIndex,
  setExpandedIndex,
  sx,
  ...props
}) {
  // eslint-disable-next-line no-unused-vars
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // console.log('expandedIndex', expandedIndex, title, index);
  return (
    <Grid {...props}>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <StyledBox sx={isDropdown ? { ...dropdownProps, ...(sx || {}) } : undefined}>
          <Box
            sx={{
              padding: '14px 10px 10px 20px',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              pb={4.5}
              onClick={() => {
                setDropdownOpen((prev) => {
                  if (setExpandedIndex) {
                    setExpandedIndex(() => (!prev ? index : -1));
                  }
                  return !prev;
                });
              }}
              sx={{
                cursor: isDropdown ? 'pointer' : 'default',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  lineHeight: '24px',
                  fontWeight: '600',
                  flex: 1,
                  ...titleSx,
                }}
              >
                {title}
              </Typography>
              {isDropdown ? (
                checkIsExpandedOrNot(expandedIndex, dropdownOpen) ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )
              ) : null}
            </Stack>
            <Stack direction="row" alignItems="flex-end" sx={valueContainerSx}>
              {valueComponent && valueComponent}

              {value !== undefined && (
                <Typography
                  variant="h2"
                  sx={{
                    lineHeight: '24px',
                    fontSize: '40px !important',
                    ...valueSx,
                  }}
                >
                  {value}
                </Typography>
              )}

              {/* tag component */}
              {Tag}
            </Stack>
          </Box>
          {isDropdown && (
            <Accordion
              expanded={checkIsExpandedOrNot(expandedIndex, dropdownOpen)}
              onChange={() => {
                setDropdownOpen((prev) => {
                  if (setExpandedIndex) {
                    setExpandedIndex(() => (!prev ? index : -1));
                  }
                  return !prev;
                });
              }}
              sx={{
                '&::before': {
                  display: 'none',
                },

                '&.Mui-expanded': {
                  margin: '8px 0px',
                },
              }}
            >
              <AccordionSummary
                sx={{
                  display: 'none',
                }}
                expandIcon={<ExpandMoreIcon />}
              ></AccordionSummary>
              <AccordionDetails
                sx={{
                  padding: '0px 25px 15px 20px',
                }}
              >
                {children}
              </AccordionDetails>
            </Accordion>
          )}
        </StyledBox>
      </Box>
    </Grid>
  );
}
