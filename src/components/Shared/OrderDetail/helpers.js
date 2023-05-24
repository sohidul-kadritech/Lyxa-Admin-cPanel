import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, styled, useTheme } from '@mui/material';

// Order Details Handling
export function StyledOrderDetailBox({ title, children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
      }}
    >
      {title && (
        <Typography variant="body4" display="block" pb={2} fontWeight={600}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  minHeight: '20px',
  '&.icon-hidden .MuiAccordionSummary-expandIconWrapper': {
    visibility: 'hidden',
  },

  '& .MuiSvgIcon-root': {
    color: theme.palette.text.primary,
    fontSize: '24px',
  },

  '& .MuiAccordionSummary-content': {
    margin: '0',
    '&.Mui-expanded': {
      margin: 0,
    },
  },
}));

export function StyledOrderDetailBox2({ title, children }) {
  const theme = useTheme();
  return (
    <Accordion
      sx={{
        border: `1px solid ${theme.palette.custom.border}`,
        borderRadius: '10px',
        padding: '12px 16px',
        '&:before': {
          display: 'none',
        },
      }}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          '&.Mui-expanded': {
            minHeight: '16px',
          },
        }}
        aria-controls="panel1a-content"
      >
        {title && (
          <Typography variant="body4" display="block" pb={2} fontWeight={600}>
            {title}
          </Typography>
        )}
      </StyledAccordionSummary>

      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
