import { Accordion, AccordionSummary, styled } from '@mui/material';

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: '0',
  background: 'transparent',
  borderBottom: '1px solid #EEEEEE',

  '& .MuiSvgIcon-root': {
    color: theme.palette.text.primary,
  },

  '& .MuiAccordionSummary-content': {
    marginTop: '13px',
    marginBottom: '13px',
  },
}));

export const StyledAccordion = styled(Accordion)(() => ({
  background: 'transparent',

  '&:before': {
    display: 'none',
  },

  '& .MuiAccordionDetails-root': {
    paddingBottom: '30px',
    paddingLeft: '30px',
  },
}));
